import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, Input} from '@angular/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-bots-control',
  imports: [
    AgGridAngular
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
      field: "status",
      headerName: 'Status',
    },
    {
      field: "isSendData",
      headerName: 'Send Data',
    },
    {
      field: "isStart",
      headerName: 'Start/Stop',
    },
    {
      field: "actions",
      headerName: 'Actions',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    headerClass: 'align-center',
    resizable: false,
    suppressMovable: true,
    flex: 1
  };
}
