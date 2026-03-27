import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AgCharts } from 'ag-charts-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-charts-community';
import { AllEnterpriseModule } from 'ag-charts-enterprise';
import type { AgCartesianChartOptions } from 'ag-charts-community';

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

/** Describes one line on the chart */
export interface PriceSeriesConfig {
  /** Field name in data objects, e.g. 'binanceBid' */
  key: string;
  /** Display name shown in legend / tooltip, e.g. 'Binance Bid' */
  name: string;
  /** Line colour, e.g. '#0ecb81' */
  color: string;
}

/** A single data row — `time` + arbitrary price fields matching PriceSeriesConfig.key */
export interface PricePoint {
  time: number;
  [key: string]: number;
}

@Component({
  selector: 'app-price-chart',
  imports: [AgCharts],
  standalone: true,
  templateUrl: './price-chart.html',
  styleUrl: './price-chart.scss',
})
export class PriceChart implements OnInit, OnChanges, OnDestroy {
  @Input() data: PricePoint[] = [];
  @Input() series: PriceSeriesConfig[] = [];
  @Input() hiddenKeys: string[] = [];
  @Input() streaming = false;

  options: AgCartesianChartOptions = {};

  private chartData: PricePoint[] = [];
  private streamIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  /** Full config without data — rebuilt only when series/hiddenKeys/streaming change */
  private baseOptions: AgCartesianChartOptions = {};

  ngOnInit(): void {
    this.rebuildBaseOptions();
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const structureChanged =
      changes['series'] || changes['hiddenKeys'] || changes['streaming'];

    if (structureChanged) {
      this.rebuildBaseOptions();
      this.initChart();
    } else if (changes['data']) {
      // Fast path — only data changed, keep existing config
      if (this.streaming) {
        // In streaming mode initChart manages its own feed; restart it with new source
        this.initChart();
      } else {
        this.chartData = [...this.data];
        this.applyData();
      }
    }
  }

  ngOnDestroy(): void {
    this.clearStreamInterval();
  }

  /* ── streaming ── */

  private initChart(): void {
    this.clearStreamInterval();

    if (this.streaming && this.data.length > 0) {
      this.chartData = [];
      this.streamIndex = 0;
      this.applyData();
      this.intervalId = setInterval(() => this.tick(), 500);
    } else {
      this.chartData = [...this.data];
      this.applyData();
    }
  }

  private tick(): void {
    if (this.streamIndex < this.data.length) {
      this.chartData = [...this.chartData, this.data[this.streamIndex]];
      this.streamIndex++;
      this.applyData();
    } else {
      this.clearStreamInterval();
    }
  }

  private clearStreamInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /* ── options management ── */

  /**
   * Rebuild everything EXCEPT data — series, axes, legend, zoom, navigator.
   * Called only when series / hiddenKeys / streaming change.
   */
  private rebuildBaseOptions(): void {
    const hidden = new Set(this.hiddenKeys);
    const seriesDefs = this.series
      .filter((s) => !hidden.has(s.key))
      .map((s) => ({
        type: 'line' as const,
        xKey: 'time',
        yKey: s.key,
        yName: s.name,
        stroke: s.color,
        strokeWidth: 2,
        marker: { enabled: false },
        tooltip: {
          renderer: (params: any) => ({
            title: s.name,
            content: `${Number(params.datum[params.yKey]).toFixed(4)}`,
          }),
        },
      }));

    this.baseOptions = {
      background: { fill: '#161a25' },
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      height: 500,
      series: seriesDefs,
      axes: {
        x: {
          type: 'number',
          position: 'bottom',
          label: {
            color: '#848e9c',
            formatter: (params: any) => {
              const d = new Date(params.value);
              return `${d.getHours().toString().padStart(2, '0')}:${d
                .getMinutes()
                .toString()
                .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
            },
          },
          gridLine: { style: [{ stroke: '#2b3139', lineDash: [4, 4] }] },
          line: { stroke: '#2b3139' },
          crosshair: { enabled: true, stroke: '#848e9c', lineDash: [4, 4] },
        },
        y: {
          type: 'number',
          position: 'right',
          label: { color: '#848e9c' },
          gridLine: { style: [{ stroke: '#2b3139', lineDash: [4, 4] }] },
          line: { stroke: '#2b3139' },
          crosshair: { enabled: true, stroke: '#848e9c', lineDash: [4, 4] },
        },
      },
      legend: {
        position: 'top',
        item: { label: { color: '#eaecef' } },
      },
      zoom: {
        enabled: true,
        axes: 'x',
        scrollingStep: 0.3,
      },
      navigator: {
        enabled: true,
        height: 30,
      },
    };
  }

  /**
   * Lightweight update — only swaps data in the existing config.
   * Creates a new options reference so ag-charts picks up the change.
   */
  private applyData(): void {
    this.options = { ...this.baseOptions, data: [...this.chartData] };
  }
}
