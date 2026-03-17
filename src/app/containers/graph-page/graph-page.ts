import { Component } from "@angular/core";
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
} from "ag-charts-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  CategoryAxisModule,
  LegendModule,
  LineSeriesModule,
  NumberAxisModule,
  ZoomModule,
  ChartToolbarModule,
  TimeAxisModule
]);

@Component({
  selector: 'app-graph-page',
  imports: [AgCharts],
  templateUrl: './graph-page.html',
  styleUrl: './graph-page.scss',
})
export class GraphPage {
  public options: any;

  constructor() {

    this.options = {
      data: getData(),
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
          type: 'time',
          position: 'bottom',
          // title: { text: 'Время' },
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
          if (event.ratioX.start <= 0.1) {
            console.log('10% - Пора подгружать данные! Вызываем GET API', event);
          }
        }
      },
    };
  }
}
