import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {getApiList} from '../../+state/servers/servers.selectors';
import type {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../components/ag-grid/ag-grid';

@Component({
  selector: 'app-ag-grid-api-list-container',
  imports: [
    AsyncPipe,
    AgGrid
  ],
  templateUrl: './ag-grid-api-list-container.html',
  styleUrl: './ag-grid-api-list-container.scss',
})
export class AgGridApiListContainer {

  private store = inject(Store);

  apiList$ = this.store.select(getApiList);

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
      field: "method",
      headerName: 'Type',
      flex: 1,
      cellStyle: { textAlign: 'left' },
      cellClass: 'selectable-text',
    },
    {
      field: "path",
      headerName: 'Address API',
      flex: 1,
      cellStyle: { textAlign: 'left' },
      cellClass: 'selectable-text',
    },
    {
      field: "description",
      headerName: 'Description',
      flex: 3,
      cellStyle: { textAlign: 'left'},
      autoHeight: true,
      wrapText: true,
      cellClass: 'selectable-text',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
    headerClass: 'align-center',
    suppressMovable: true,
  };
}
