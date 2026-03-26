import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin, Subscription, take } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { PriceChart } from '../../components/price-chart/price-chart';
import type { PricePoint, PriceSeriesConfig } from '../../components/price-chart/price-chart';
import { ServerDataService } from '../../services/server-data.service';
import { buildSeriesFromKeys, rawKeyToUrlKey } from '../../services/price-key-utils';
import { getActiveServerIpPort } from '../../+state/servers/servers.selectors';

/** How often (ms) we flush buffered WS ticks into the chart */
const FLUSH_INTERVAL = 500;

/** Max data points to keep — older points are dropped, creating auto-scroll */
const MAX_POINTS = 3000;

@Component({
  selector: 'app-price-chart-live-container',
  imports: [PriceChart],
  standalone: true,
  templateUrl: './price-chart-live-container.html',
  styleUrl: './price-chart-live-container.scss',
})
export class PriceChartLiveContainer implements OnInit, OnDestroy {
  private store = inject(Store);
  private serverDataService = inject(ServerDataService);
  private ngZone = inject(NgZone);
  private sub: Subscription | null = null;
  private socket: Socket | null = null;
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  series: PriceSeriesConfig[] = [];
  data: PricePoint[] = [];
  hiddenKeys: string[] = [];

  /** Forward-fill: last known value per key */
  private lastKnown: Record<string, number> = {};
  /** All keys we're tracking */
  private keys: string[] = [];
  /** Buffer: points collected between flush intervals */
  private buffer: PricePoint[] = [];
  private dirty = false;

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.flushTimer !== null) clearInterval(this.flushTimer);
    this.socket?.disconnect();
    this.socket = null;
  }

  private init(): void {
    // 1. Fetch available keys
    this.sub = this.serverDataService.getPriceKeys().subscribe((keys) => {
      if (!keys || keys.length === 0) return;

      this.keys = keys;
      this.series = buildSeriesFromKeys(keys);

      // 2. Load historical data from REST, then start WebSocket
      const requests = keys.reduce(
        (acc, key) => {
          acc[key] = this.serverDataService.getPriceByKey(rawKeyToUrlKey(key));
          return acc;
        },
        {} as Record<string, ReturnType<ServerDataService['getPriceByKey']>>,
      );

      forkJoin(requests).subscribe((responses) => {
        // Build historical data with forward-fill
        this.data = this.mergeResponses(keys, responses);

        // Seed lastKnown from the last historical point
        if (this.data.length > 0) {
          const last = this.data[this.data.length - 1];
          for (const key of keys) {
            if (last[key] !== undefined && !isNaN(last[key])) {
              this.lastKnown[key] = last[key];
            }
          }
        }

        // 3. Now connect WebSocket to append live data on top
        this.store
          .select(getActiveServerIpPort)
          .pipe(take(1))
          .subscribe((ipPort) => {
            this.connectSocket(`http://${ipPort}`, keys);
          });
      });
    });
  }

  /* ── REST: merge historical data with forward-fill ── */

  private mergeResponses(
    keys: string[],
    responses: Record<string, { key: string; points: { t: number; v: number }[]; count: number; last: { t: number; v: number } }>,
  ): PricePoint[] {
    const timeSet = new Set<number>();
    for (const res of Object.values(responses)) {
      for (const p of res.points) {
        timeSet.add(p.t);
      }
    }
    const times = [...timeSet].sort((a, b) => a - b);

    const sorted: Record<string, { t: number; v: number }[]> = {};
    for (const [key, res] of Object.entries(responses)) {
      sorted[key] = [...res.points].sort((a, b) => a.t - b.t);
    }

    const lastKnown: Record<string, number | undefined> = {};
    const cursors: Record<string, number> = {};
    for (const key of keys) {
      cursors[key] = 0;
    }

    return times.map((t) => {
      const point: PricePoint = { time: t };
      for (const key of keys) {
        const pts = sorted[key];
        while (cursors[key] < pts.length && pts[cursors[key]].t <= t) {
          lastKnown[key] = pts[cursors[key]].v;
          cursors[key]++;
        }
        if (lastKnown[key] !== undefined) {
          point[key] = lastKnown[key]!;
        }
      }
      return point;
    });
  }

  /* ── WebSocket: live updates ── */

  private connectSocket(baseUrl: string, keys: string[]): void {
    this.socket?.disconnect();

    this.ngZone.runOutsideAngular(() => {
      this.socket = io(`${baseUrl}/prices`, {
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        const pipeKeys = keys.map(rawKeyToUrlKey);
        this.socket!.emit('subscribe', { keys: pipeKeys });
      });

      this.socket.on('priceChange', (payload: { key: string; point: { t: number; v: number } }) => {
        this.onPriceChange(payload.key, payload.point.t, payload.point.v);
      });

      this.flushTimer = setInterval(() => {
        if (this.dirty) {
          this.ngZone.run(() => this.flush());
        }
      }, FLUSH_INTERVAL);
    });
  }

  private onPriceChange(rawKey: string, timestamp: number, value: number): void {
    const key = this.resolveKey(rawKey);
    if (!key) return;

    this.lastKnown[key] = value;

    const point: PricePoint = { time: timestamp };
    for (const k of this.keys) {
      if (this.lastKnown[k] !== undefined) {
        point[k] = this.lastKnown[k];
      }
    }
    this.buffer.push(point);
    this.dirty = true;
  }

  private flush(): void {
    if (this.buffer.length === 0) return;
    const combined = [...this.data, ...this.buffer];
    this.data = combined.length > MAX_POINTS
      ? combined.slice(combined.length - MAX_POINTS)
      : combined;
    this.buffer = [];
    this.dirty = false;
  }

  private resolveKey(incoming: string): string | null {
    if (this.keys.includes(incoming)) return incoming;
    const stripped = incoming.replace(/\|/g, '');
    if (this.keys.includes(stripped)) return stripped;
    return null;
  }
}
