import type {ColDef} from 'ag-grid-community';
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import {AgGridAngular} from 'ag-grid-angular';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IndicatorContainer} from '../../containers/ag-grid-containers/indicator-container/indicator-container';
import {ActionsContainer} from '../../containers/ag-grid-containers/actions-container/actions-container';
import {PauseBotContainer} from '../../containers/pause-bot-container/pause-bot-container';
import {RestartBotContainer} from '../../containers/restart-bot-container/restart-bot-container';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-bot-control-panel',
  imports: [
    AgGridAngular
  ],
  standalone: true,
  templateUrl: './ag-grid-bot-control-panel.html',
  styleUrl: './ag-grid-bot-control-panel.scss',
})
export class AgGridBotControlPanel {
  @Input() rowData: any[] = [];

  @Output() emitter = new EventEmitter<any>();

  onAction(event: any, row: any) {
    this.emitter.emit({ ...event, row });
  }

  colDefs: ColDef[] = [
    {
      field: "id",
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
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
    //   field: "isSendData",
    //   headerName: 'Send Data',
    //   flex: 1,
    //   cellRenderer: ToggleContainer,
    //   cellRendererParams: {
    //     onAction: this.onAction.bind(this),
    //   },
    // },
    {
      field: "paused",
      headerName: 'Start/Pause',
      flex: 1,
      cellRenderer: PauseBotContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
    {
      headerName: 'Restart',
      flex: 1,
      cellRenderer: RestartBotContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
    {
      headerName: 'Edit',
      width: 125,
      cellRenderer: ActionsContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
    headerClass: 'align-center',
    resizable: false,
    suppressMovable: true,
  };
}
