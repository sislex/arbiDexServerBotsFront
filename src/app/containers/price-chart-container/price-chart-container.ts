import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PriceChart } from '../../components/price-chart/price-chart';
import type { PricePoint, PriceSeriesConfig } from '../../components/price-chart/price-chart';
import { ServerDataService } from '../../services/server-data.service';
import { buildSeriesFromKeys, rawKeyToUrlKey } from '../../services/price-key-utils';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-price-chart-container',
  imports: [PriceChart],
  standalone: true,
  templateUrl: './price-chart-container.html',
  styleUrl: './price-chart-container.scss',
})
export class PriceChartContainer implements OnInit, OnDestroy {
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

  private loadPrices(): void {
    this.sub = this.serverDataService.getPriceKeys().subscribe((keys) => {
      if (!keys || keys.length === 0) return;

      this.series = buildSeriesFromKeys(keys);

      const requests = keys.reduce(
        (acc, key) => {
          acc[key] = this.serverDataService.getPriceByKey(rawKeyToUrlKey(key));
          return acc;
        },
        {} as Record<string, ReturnType<ServerDataService['getPriceByKey']>>,
      );

      forkJoin(requests).subscribe((responses) => {
        // Collect all unique timestamps across every series
        const timeSet = new Set<number>();
        for (const res of Object.values(responses)) {
          for (const p of res.points) {
            timeSet.add(p.t);
          }
        }
        const times = [...timeSet].sort((a, b) => a - b);

        // For each key build a sorted points array for forward-fill
        const sorted: Record<string, { t: number; v: number }[]> = {};
        for (const [key, res] of Object.entries(responses)) {
          sorted[key] = [...res.points].sort((a, b) => a.t - b.t);
        }

        // Merge into PricePoint[] with forward-fill (last known value)
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
