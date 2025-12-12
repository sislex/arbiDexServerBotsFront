import {Component, Input} from '@angular/core';
import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import {AgGrid} from '../../components/ag-grid/ag-grid';

@Component({
  selector: 'app-ag-grid-bot-data-list-container',
  imports: [
    AgGrid,
  ],
  templateUrl: './ag-grid-bot-data-list-container.html',
  styleUrl: './ag-grid-bot-data-list-container.scss',
})
export class AgGridBotDataListContainer {
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
      width: 200,
      cellStyle: { textAlign: 'left' },
      cellClass: 'selectable-text',
    },
    {
      field: "value",
      headerName: 'Value',
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
    cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
    headerClass: 'align-center',
    suppressMovable: true,
  };
}
