import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PriceChart } from '../../components/price-chart/price-chart';
import type { PricePoint, PriceSeriesConfig } from '../../components/price-chart/price-chart';
import { ServerDataService } from '../../services/server-data.service';
import { findPriceKeys, formatPipeKeyName, PRICE_COLORS } from '../../services/price-key-utils';
import { getInfoActiveBot } from '../../+state/servers/servers.selectors';
import { forkJoin, Subscription, filter, take, switchMap, map } from 'rxjs';
import { LoaderContainer } from '../loader-container/loader-container';

@Component({
  selector: 'app-price-chart-container',
  imports: [PriceChart, LoaderContainer],
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
  isLoading = true;

  ngOnInit(): void {
    this.loadPrices();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private loadPrices(): void {
    this.sub = this.store
      .select(getInfoActiveBot)
      .pipe(
        filter((info) => {
          const jp = info?.jobParams as any;
          const token0 = jp?.token0 ?? jp?.opts?.tokenIn?.symbol;
          const token1 = jp?.token1 ?? jp?.opts?.tokenOut?.symbol;
          return !!jp?.source && !!token0 && !!token1;
        }),
        take(1),
        switchMap((info) =>
          this.serverDataService.getPriceKeys().pipe(map((keys) => ({ info, keys }))),
        ),
      )
      .subscribe(({ info, keys: allKeys }) => {
        const jp = info.jobParams as any;
        const jobType = String(jp?.jobType ?? '');
        const source = String(jp?.source ?? '');
        const token0 = String(jp?.token0 ?? jp?.opts?.tokenIn?.symbol ?? '');
        const token1 = String(jp?.token1 ?? jp?.opts?.tokenOut?.symbol ?? '');
        const isCexQuotes = jobType === 'get_Cex_Quotes';

        const found = findPriceKeys(allKeys, source, token0, token1);
        if (!found) {
          this.isLoading = false;
          return;
        }

        const pipeKeys = [found.bidKey, found.askKey];
        const flatKeys = pipeKeys.map((k) => k.replace(/\|/g, ''));
        const symbol = found.bidKey.split('|')[1];
        const midKey = `${source}${symbol}mid`;

        if (isCexQuotes) {
          this.series = [
            {
              key: midKey,
              name: `${source.charAt(0).toUpperCase() + source.slice(1)} ${symbol} Mid`,
              color: PRICE_COLORS[2],
            },
          ];
        } else {
          this.series = pipeKeys.map((k, i) => ({
            key: flatKeys[i],
            name: formatPipeKeyName(k),
            color: PRICE_COLORS[i],
          }));
        }

        const requests = pipeKeys.reduce(
          (acc, pipeKey) => {
            const flatKey = pipeKey.replace(/\|/g, '');
            acc[flatKey] = this.serverDataService.getPriceByKey(pipeKey);
            return acc;
          },
          {} as Record<string, ReturnType<ServerDataService['getPriceByKey']>>,
        );


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
          for (const key of flatKeys) {
            cursors[key] = 0;
          }

          this.data = times.map((t) => {
            const point: PricePoint = { time: t };
            for (const key of flatKeys) {
              const pts = sorted[key];
              while (cursors[key] < pts.length && pts[cursors[key]].t <= t) {
                lastKnown[key] = pts[cursors[key]].v;
                cursors[key]++;
              }
            }

            if (isCexQuotes) {
              const bid = lastKnown[flatKeys[0]];
              const ask = lastKnown[flatKeys[1]];
              if (bid !== undefined && ask !== undefined) {
                point[midKey] = (bid + ask) / 2;
              }
            } else {
              for (const key of flatKeys) {
                if (lastKnown[key] !== undefined) {
                  point[key] = lastKnown[key]!;
                }
              }
            }

            return point;
          });

          this.isLoading = false;
        });
      });
  }
}
