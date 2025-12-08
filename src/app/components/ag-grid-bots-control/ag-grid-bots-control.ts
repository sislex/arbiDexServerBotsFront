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
      width: 120,
      cellClass: 'selectable-text',
      resizable: true,

    },
    {
      field: "createdAt",
      headerName: 'Created',
      flex: 1,
      cellClass: 'selectable-text',
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
      field: "arbitrageCount",
      headerName: 'Arbitrage Count',
      width: 100,
    },
    {
      field: "errorCount",
      headerName: 'Errors',
      width: 100,
    },
    {
      field: "latency",
      headerName: 'Average Request Time',
      flex: 1,
    },
    {
      field: "lastLatency",
      headerName: 'Last Request Time',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      cellRenderer: IndicatorContainer,
      cellRendererParams: {
        colorMapping: {
          'active': 'green',
          '': 'red',
          'finished': 'gray',
          'pause': 'yellow',
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
