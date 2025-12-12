import {Component, inject} from '@angular/core';
import {AgGrid} from '../../components/ag-grid/ag-grid';
import type {ColDef} from 'ag-grid-community';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {getDataActiveBot} from '../../+state/servers/servers.selectors';

@Component({
  selector: 'app-ag-grid-error-list-container',
  imports: [
    AgGrid,
    AsyncPipe
  ],
  templateUrl: './ag-grid-error-list-container.html',
  styleUrl: './ag-grid-error-list-container.scss',
})
export class AgGridErrorListContainer {
  private store = inject(Store);

  dataActiveBot$ = this.store.select(getDataActiveBot)

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
    suppressMovable: true,
  };
}
