import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {ITypesList} from '../../models/servers';
import {getJobTypesList} from '../../+state/servers/servers.selectors';
import type {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../components/ag-grid/ag-grid';

@Component({
  selector: 'app-ag-grid-action-list-container',
  imports: [
    AsyncPipe,
    AgGrid
  ],
  standalone: true,
  templateUrl: './ag-grid-action-list-container.html',
  styleUrl: './ag-grid-action-list-container.scss'
})
export class AgGridActionListContainer {
  private store = inject(Store);

  jobTypesList$: Observable<ITypesList[]> = this.store.select(getJobTypesList);


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
