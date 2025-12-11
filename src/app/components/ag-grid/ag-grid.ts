import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, Input} from '@angular/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid',
  imports: [AgGridAngular],
  standalone: true,
  templateUrl: './ag-grid.html',
  styleUrl: './ag-grid.scss'
})
export class AgGrid {
  @Input() rowData: any[] = [];

  colDefs: ColDef[] = [
    {
      field: "make",
      headerName: 'Make',
    },
    {
      field: "model",
      headerName: 'Model',
    },
    {
      field: "price",
      headerName: 'Price',
    },
    {
      field: "make",
      headerName: 'Electric',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    headerClass: 'align-center',
    suppressMovable: true,
    flex: 1
  };
}
