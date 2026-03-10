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
} from "ag-charts-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  CategoryAxisModule,
  LegendModule,
  LineSeriesModule,
  NumberAxisModule,
  ZoomModule,
  ChartToolbarModule
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
      width: 1200,
      zoom: {
        enabled: true,
        // panKey: 'alt',
        enableScrolling: true
      },
      contextMenu: {
        enabled: true, // Включает меню по правой кнопке (Enterprise)
      },

      title: {
        text: "Annual Fuel Expenditure",
      },
      data: getData(),
      series: [
        {
          type: "line",
          xKey: "quarter",
          yKey: "petrol",
          yName: "Petrol",
        },
        {
          type: "line",
          xKey: "quarter",
          yKey: "diesel",
          yName: "Diesel",
        },
      ],
    };
  }
}


//
// export class GraphPage {
//   options: AgFinancialChartOptions = {
//
//   };
//
//   constructor() {
//     this.options = {
//       data: getData(),
//       title: { text: "Acme Inc." },
//       toolbar: true,
//       rangeButtons: true,
//       volume: false,
//       statusBar: false,
//       zoom: true,
//       width: 600,
//       initialState: {
//
//       },
//     };
//   }
// }
