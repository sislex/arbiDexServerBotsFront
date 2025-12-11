import {Component, Input} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {AllCommunityModule, ColDef, ModuleRegistry} from 'ag-grid-community';


ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-arbitrage-list',
  imports: [
    AgGridAngular
  ],
  templateUrl: './ag-grid-arbitrage-list.html',
  styleUrl: './ag-grid-arbitrage-list.scss',
})
export class AgGridArbitrageList {

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
      field: 'details',
      headerName: 'Arbitrage',
      flex: 1,
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    headerClass: 'align-center',
    suppressMovable: true,
  };
}
