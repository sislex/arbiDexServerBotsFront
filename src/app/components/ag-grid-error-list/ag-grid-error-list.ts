import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, Input} from '@angular/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-error-list',
  imports: [
    AgGridAngular
  ],
  standalone: true,
  templateUrl: './ag-grid-error-list.html',
  styleUrl: './ag-grid-error-list.scss'
})
export class AgGridErrorList {
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
      field: 'createdAt',
      headerName: 'Time',
      flex: 1,
      valueFormatter: params => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleString('ru-RU');
      },
    },
    {
      field: "durationMs",
      headerName: 'Duration (ms)',
      flex: 1,
    },
    {
      field: "errorCode",
      headerName: 'Error Code',
      flex: 1,
    },
    {
      field: "message",
      headerName: 'Error Message',
      flex: 3,
      cellStyle: { textAlign: 'left'},
      autoHeight: true,
      wrapText: true,
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    headerClass: 'align-center',
    resizable: false,
    suppressMovable: true,
  };
}
