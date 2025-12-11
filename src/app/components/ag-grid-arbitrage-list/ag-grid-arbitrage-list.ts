import {Component, Input} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {AllCommunityModule, ColDef, type ICellRendererParams, ModuleRegistry} from 'ag-grid-community';


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
      field: 'createdAt',
      headerName: 'time',
      flex: 1,
      cellStyle: { textAlign: 'left' },
      wrapText: true,
      autoHeight: true,
      cellClass: 'selectable-text',

      valueFormatter: p => {
        const v = p.value;
        if (!v) return "";

        const date = new Date(v);
        if (isNaN(date.getTime())) return String(v);

        return date.toLocaleString(); // покажет в локальной таймзоне
      },

      cellRenderer: (params: ICellRendererParams) => {
        const pre = document.createElement("pre");
        pre.style.margin = "0";
        pre.style.whiteSpace = "pre-wrap";
        pre.textContent = params.valueFormatted ?? params.value;
        return pre;
      },
    },
    {
      field: 'details',
      headerName: 'Arbitrage',
      flex: 1,
      cellStyle: { textAlign: 'left' },
      wrapText: true,
      autoHeight: true,
      cellClass: 'selectable-text',

      valueFormatter: p => {
        const v = p.value;

        if (v == null) return "";
        if (typeof v === "string") return v;
        if (typeof v === "number") return String(v);

        return JSON.stringify(v, null, 2);
      },

      cellRenderer: (params: ICellRendererParams) => {
        const pre = document.createElement("pre");
        pre.style.margin = "0";
        pre.style.whiteSpace = "pre-wrap";
        pre.textContent = params.valueFormatted ?? params.value;
        return pre;
      },
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    headerClass: 'align-center',
    suppressMovable: true,
  };
}
