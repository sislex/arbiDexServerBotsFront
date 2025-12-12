import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {getBotTypesList} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {AgGrid} from '../../components/ag-grid/ag-grid';
import type {ColDef} from 'ag-grid-community';

@Component({
  selector: 'app-ag-grid-bot-list-container',
  imports: [
    AsyncPipe,
    AgGrid
  ],
  standalone: true,
  templateUrl: './ag-grid-bot-list-container.html',
  styleUrl: './ag-grid-bot-list-container.scss'
})
export class AgGridBotListContainer {
  private store = inject(Store);
  botTypesList$ = this.store.select(getBotTypesList);

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
    // {
    //   field: "label",
    //   headerName: 'Name',
    //   flex: 1,
    //   cellStyle: { textAlign: 'left' },
    // },
    {
      field: "type",
      headerName: 'Type',
      flex: 1,
      cellStyle: { textAlign: 'left' },
    },
    {
      field: "description",
      headerName: 'Description',
      flex: 3,
      cellStyle: { textAlign: 'left'},
      autoHeight: true,
      wrapText: true,
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
    headerClass: 'align-center',
    suppressMovable: true,
  };
}
