import {Component, Input} from '@angular/core';
import type {ColDef} from 'ag-grid-community';
import {AgGridAngular} from 'ag-grid-angular';

@Component({
  selector: 'app-ag-grid-action-list',
  imports: [
    AgGridAngular
  ],
  standalone: true,
  templateUrl: './ag-grid-action-list.html',
  styleUrl: './ag-grid-action-list.scss'
})
export class AgGridActionList {
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
