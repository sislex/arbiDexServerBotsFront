import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, Input} from '@angular/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-api-list',
  imports: [
    AgGridAngular
  ],
  standalone: true,
  templateUrl: './ag-grid-api-list.html',
  styleUrl: './ag-grid-api-list.scss',
})
export class AgGridApiList {
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
      field: "method",
      headerName: 'Type',
      flex: 1,
      cellStyle: { textAlign: 'left' },
    },
    {
      field: "path",
      headerName: 'Address API',
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
    resizable: false,
    suppressMovable: true,
  };
}
