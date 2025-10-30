import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, Input} from '@angular/core';
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
    },
    {
      field: "gate",
      headerName: 'Gate',
    },
    {
      field: "maxTimeRequest",
      headerName: 'Max Time Request(ms)',
    },
    {
      field: "TimeRequest",
      headerName: 'Time Request(ms)',
    },
    {
      field: 'status',
      width: 80,
      headerName: 'Status',
      cellRenderer: IndicatorContainer,
      cellStyle: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' },
      headerClass: 'align-center little-width',
    },
    {
      field: "isSendData",
      headerName: 'Send Data',
      cellRenderer: ToggleContainer,
    },
    {
      field: "isStart",
      headerName: 'Start/Stop',
      cellRenderer: LaunchControlContainer,
    },
    {
      field: "actions",
      headerName: 'Actions',
      cellRenderer: ActionsContainer,
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
    headerClass: 'align-center',
    resizable: false,
    suppressMovable: true,
    flex: 1
  };
}
