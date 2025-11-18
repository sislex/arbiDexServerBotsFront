import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, Input} from '@angular/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-bot-data-list',
  imports: [AgGridAngular],
  standalone: true,
  templateUrl: './ag-grid-bot-data-list.html',
  styleUrl: './ag-grid-bot-data-list.scss',
})
export class AgGridBotDataList {
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
      field: "key",
      headerName: 'Parameter',
      flex: 1,
      cellStyle: { textAlign: 'left' },
    },
    {
      field: "value",
      headerName: 'Value',
      flex: 1,
      cellStyle: { textAlign: 'left' },
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
