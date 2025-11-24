import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IndicatorContainer} from '../../containers/ag-grid-containers/indicator-container/indicator-container';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-bots-control',
  imports: [
    AgGridAngular,
  ],
  templateUrl: './ag-grid-bots-control.html',
  styleUrl: './ag-grid-bots-control.scss'
})
export class AgGridBotsControl {
  @Input() rowData: any[] = [];

  @Output() emitter = new EventEmitter<any>();

  onAction(event: any, row: any) {
    this.emitter.emit({ ...event, row });
  }

  onRowDoubleClicked($event: any) {
    this.emitter.emit({
      event: 'AgGridBotsControl:DOUBLE_CLICKED_ROW',
      row: $event
    });
  }

  colDefs: ColDef[] = [
    {
      headerName: '#',
      width: 50,
      valueGetter: params => {
        if (!params.node || params.node.rowIndex == null) return '';
        return params.node.rowIndex + 1;
      },
    },
    {
      field: "id",
      headerName: 'ID',
      width: 80,
    },
    {
      field: "createdAt",
      headerName: 'Created',
      flex: 1,
      valueFormatter: params => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleString('ru-RU', {
          timeZone: 'Europe/Moscow'
        });
      },
    },
    {
      field: "jobCount",
      headerName: 'Jobs',
      width: 100,
    },
    {
      field: "errorCount",
      headerName: 'Errors',
      width: 100,
    },
    {
      field: "lastLatency",
      headerName: 'Time Request',
      flex: 1,
      valueFormatter: params => {
        if (!params.data?.lastActionTimeStart) return '';

        const startTime = new Date(params.data.lastActionTimeStart).getTime(); // UTC timestamp
        const now = Date.now();
        const diff = now - startTime; // миллисекунды

        // Переводим в часы, минуты, секунды
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Форматируем как hh:mm:ss
        const formattedTime: string = [
          hours.toString().padStart(2, '0'),
          minutes.toString().padStart(2, '0'),
          seconds.toString().padStart(2, '0')
        ].join(':');

        return formattedTime;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      cellRenderer: IndicatorContainer,
      cellRendererParams: { //TODO: Записать сюда верные ПРИХОДЯЩИЕ параметры под каждый цвет
        colorMapping: {
          'active': 'green',
          'running': 'green',
          'inactive': 'red',
          'stopped': 'red',
          'pending': 'yellow',
          'error': 'red'
        }
      },
      cellStyle: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' },
      headerClass: 'align-center little-width',
    },
    // {
    //   headerName: 'Actions',
    //   width: 125,
    //   cellRenderer: ActionsContainer,
    //   cellRendererParams: {
    //     onAction: this.onAction.bind(this),
    //   },
    // },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
    headerClass: 'align-center',
    resizable: false,
    suppressMovable: true,
  };
}
