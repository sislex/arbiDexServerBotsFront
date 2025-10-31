import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IndicatorContainer} from '../../containers/ag-grid-containers/indicator-container/indicator-container';
import {ToggleContainer} from '../../containers/ag-grid-containers/toggle-container/toggle-container';
import {
  LaunchControlContainer
} from '../../containers/ag-grid-containers/launch-control-container/launch-control-container';
import {ActionsContainer} from '../../containers/ag-grid-containers/actions-container/actions-container';

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

  colDefs: ColDef[] = [
    {
      field: "#",
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
      flex: 1,
    },
    {
      field: "gate",
      headerName: 'Gate',
      flex: 1,
    },
    {
      field: "maxTimeRequest",
      headerName: 'Max Time Request(ms)',
      flex: 1,
    },
    {
      field: "TimeRequest",
      headerName: 'Time Request(ms)',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      cellRenderer: IndicatorContainer,
      cellStyle: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' },
      headerClass: 'align-center little-width',
    },
    {
      field: "isSendData",
      headerName: 'Send Data',
      minWidth: 80,
      flex: 1,
      cellRenderer: ToggleContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
    {
      field: "isStart",
      headerName: 'Start/Stop',
      flex: 1,
      cellRenderer: LaunchControlContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
    {
      field: "actions",
      headerName: 'Actions',
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
