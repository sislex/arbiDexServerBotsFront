import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, Input} from '@angular/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-bot-list',
  imports: [AgGridAngular],
  standalone: true,
  templateUrl: './ag-grid-bot-list.html',
  styleUrl: './ag-grid-bot-list.scss'
})
export class AgGridBotList {
  @Input() rowData: any[] = [];

  colDefs: ColDef[] = [
    {
      field: "#",
      headerName: '#',
      width: 50,
    },
    {
      field: "name",
      headerName: 'Name',
      flex: 1,
      cellStyle: { textAlign: 'left' },
    },
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
      cellStyle: { textAlign: 'left', lineHeight: '1.5'},
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
