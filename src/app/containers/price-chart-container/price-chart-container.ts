import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PriceChart } from '../../components/price-chart/price-chart';
import type { PricePoint, PriceSeriesConfig } from '../../components/price-chart/price-chart';
import { ServerDataService } from '../../services/server-data.service';
import { buildSeriesFromKeys } from '../../services/price-key-utils';
import { getInfoActiveBot } from '../../+state/servers/servers.selectors';
import { forkJoin, Subscription, filter, take } from 'rxjs';

@Component({
  selector: 'app-price-chart-container',
  imports: [PriceChart],
  standalone: true,
  templateUrl: './price-chart-container.html',
  styleUrl: './price-chart-container.scss',
})
export class PriceChartContainer implements OnInit, OnDestroy {
  private store = inject(Store);
  private serverDataService = inject(ServerDataService);
  private sub: Subscription | null = null;

  series: PriceSeriesConfig[] = [];
  data: PricePoint[] = [];
  hiddenKeys: string[] = [];
  streaming = false;

  ngOnInit(): void {
    this.loadPrices();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** Build pipe-separated keys from the active bot's jobParams */
  private static makeKey(source: string, symbol: string, field: 'bidPrice' | 'askPrice'): string {
    return `${source}|${symbol}|${field}`;
  }

  private loadPrices(): void {
    this.sub = this.store
      .select(getInfoActiveBot)
      .pipe(
        filter((info) => !!(info?.jobParams as any)?.source && !!(info?.jobParams as any)?.symbol),
        take(1),
      )
      .subscribe((info) => {
        const { source, symbol } = info.jobParams as any;

        // Build exactly the keys this bot needs
        const pipeKeys = [
          PriceChartContainer.makeKey(source, symbol, 'bidPrice'),
          PriceChartContainer.makeKey(source, symbol, 'askPrice'),
        ];

        this.series = buildSeriesFromKeys(
          pipeKeys.map((k) => k.replace(/\|/g, '')),
        );

        const requests = pipeKeys.reduce(
          (acc, pipeKey) => {
            const flatKey = pipeKey.replace(/\|/g, '');
            acc[flatKey] = this.serverDataService.getPriceByKey(pipeKey);
            return acc;
          },
          {} as Record<string, ReturnType<ServerDataService['getPriceByKey']>>,
        );

        const keys = Object.keys(requests);

        forkJoin(requests).subscribe((responses) => {
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

          this.data = times.map((t) => {
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
        });
      });
  }
}
