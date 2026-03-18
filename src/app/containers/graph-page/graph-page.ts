import {Component, inject} from "@angular/core";
import { AgCharts } from "ag-charts-angular";
import {
  AgChartOptions,
  CategoryAxisModule, ChartToolbarModule,
  LegendModule,
  LineSeriesModule,
  ModuleRegistry,
  NumberAxisModule,
  ZoomModule,
  TimeAxisModule,
  UnitTimeAxisModule,
} from "ag-charts-enterprise";
import {Store} from '@ngrx/store';
import {setQuotesCostData} from '../../+state/graphs/graphs.actions';
import {getQuotesCostData} from '../../+state/graphs/graphs.selectors';

ModuleRegistry.registerModules([
  CategoryAxisModule,
  LegendModule,
  LineSeriesModule,
  NumberAxisModule,
  ZoomModule,
  ChartToolbarModule,
  TimeAxisModule,
  UnitTimeAxisModule,
]);

@Component({
  selector: 'app-graphs-page',
  imports: [AgCharts],
  templateUrl: './graph-page.html',
  styleUrl: './graph-page.scss',
})
export class GraphPage {
  private store = inject(Store);
  public options: any;

  data: any;
  constructor() {
    this.store.dispatch(setQuotesCostData());

    this.options = {
      data: [],
      initialState: {
        zoom: {
          ratioX: { start: 0.3, end: 1 },
        },
      },
      autoSize: true,
      height: 600,
      width: 1200,
      zoom: {
        enabled: true,
        enableScrolling: true,
      },
      axes: {
        x: {
          type: 'unit-time',
          position: 'bottom',
          tick: {
            intervals: [
              { step: 'day' },
              { step: 'hour' },
              { step: 'minute' }
            ],
          },
          label: {
            format: '%H:%M\n%d %b',
          }
        },
        y: {
          type: 'number',
          position: 'left',
          title: { text: 'Стоимость (Cost)' },
        },
      },
      series: [
        {
          type: "line",
          xKey: "timestamp",
          yKey: "cost",
          yName: "Cost",
        },
      ],
      listeners: {
        zoom: (event: any) => {
          const range = event.ratioX.end - event.ratioX.start;

          let step: 'day' | 'hour' | 'minute' = 'day';
          let format = '%d %b';

          if (range < 0.2) {
            step = 'hour';
            format = '%H:%M\n%d %b';
          }

          if (range < 0.1) {
            step = 'minute';
            format = '%H:%M';
          }

          this.options = {
            ...this.options,
            axes: {
              x: {
                ...this.options.axes.x,
                interval: {
                  step,
                },
                label: {
                  format,
                },
              },
              y: this.options.axes.y,
            },
          };
        }
      }
    };

    this.store.select(getQuotesCostData).subscribe(data => {
      if (!data?.length) return;

      const grouped: Record<string, any[]> = {};

      data.forEach(item => {
        const [a, b] = [item.token0Id, item.token1Id].sort();
        const key = `${a}-${b}`;

        if (!grouped[key]) grouped[key] = [];

        grouped[key].push({
          timestamp: new Date(item.timestamp),
          costBuy: Number(item.costBuy),
          costSell: Number(item.costSell),
        });
      });

      const series: any[] = [];

      Object.entries(grouped).forEach(([pair, values]) => {
        values.sort((a, b) => a.timestamp - b.timestamp);

        series.push({
          type: 'line',
          xKey: 'timestamp',
          yKey: 'costBuy',
          yName: `Pair ${pair} (Buy)`,
          data: values,
        });

        series.push({
          type: 'line',
          xKey: 'timestamp',
          yKey: 'costSell',
          yName: `Pair ${pair} (Sell)`,
          data: values,
          strokeDasharray: [5, 5],
        });
      });

      this.options = {
        ...this.options,
        series,
      };
    });
  }
}
