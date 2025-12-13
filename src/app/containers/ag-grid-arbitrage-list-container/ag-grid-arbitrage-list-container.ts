import {Component, inject} from '@angular/core';
import {AgGrid} from '../../components/ag-grid/ag-grid';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {getDataActiveBot} from '../../+state/servers/servers.selectors';
import {ColDef, ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'app-ag-grid-arbitrage-list-container',

  imports: [
    AgGrid,
    AsyncPipe
  ],
  templateUrl: './ag-grid-arbitrage-list-container.html',
  styleUrl: './ag-grid-arbitrage-list-container.scss',
})

export class AgGridArbitrageListContainer {
  private store = inject(Store);

  dataActiveBot$ = this.store.select(getDataActiveBot);

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
      width: 150,
      cellStyle: { textAlign: 'left' },
      wrapText: true,
      autoHeight: true,
      cellClass: 'selectable-text',

      valueFormatter: p => {
        const v = p.value;
        if (!v) return "";

        const date = new Date(v);
        if (isNaN(date.getTime())) return String(v);

        return date.toLocaleString();
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

        return JSON.stringify(v.groups, null, 2);
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
