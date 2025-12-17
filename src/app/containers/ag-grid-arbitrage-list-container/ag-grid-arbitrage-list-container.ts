import {Component, inject} from '@angular/core';
import {AgGrid} from '../../components/ag-grid/ag-grid';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {getDataActiveBot, getDataActiveBotArbitrage} from '../../+state/servers/servers.selectors';
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

  getDataActiveBotArbitrage$ = this.store.select(getDataActiveBotArbitrage);

  colDefs: ColDef[] = [
    {
      field: "#",
      headerName: '#',
      width: 70,
      valueGetter: params => {
        if (!params.node || params.node.rowIndex == null) return '';
        return params.node.rowIndex + 1;
      },
    },
    {
      field: 'blockNumber',
      headerName: 'block',
      width: 100,
      sortable: true,

      valueGetter: (p: any) => {
        const v = p.data?.blockNumber;
        return v == null ? null : Number(v);
      },

      filter: 'agNumberColumnFilter',
      filterParams: {
        filterOptions: ['greaterThan', 'lessThan', 'inRange', 'equals'],
        buttons: ['reset'],
        debounceMs: 200,
      },
      cellClass: 'selectable-text',
    },
    {
      field: 'poolsCount',
      headerName: 'pools',
      width: 70,
      valueGetter: (params: any) => {
        return params.data.poolsCount ?? '';
      },
    },
    {
      field: 'createdAt',
      headerName: 'time',
      width: 95,
      sortable: true,
      cellStyle: { textAlign: 'left' },
      wrapText: false,
      autoHeight: true,
      cellClass: 'selectable-text',

      // 👉 значение для сортировки (число)
      valueGetter: p => {
        const v = p.data?.createdAt;
        const t = new Date(v).getTime();
        return isNaN(t) ? null : t;
      },

      // 👉 отображение в UI
      valueFormatter: p => {
        if (p.value == null) return '';

        return new Date(p.value).toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      },
    },
    {
      field: 'spread_pct',
      headerName: 'spread',
      width: 100,
      sortable: true,

      valueGetter: (p: any) => {
        const v = p.data?.spread_pct;
        return v == null ? null : Number(v);
      },

      filter: 'agNumberColumnFilter',
      filterParams: {
        // можно оставить только нужные операции:
        filterOptions: ['greaterThan', 'lessThan', 'inRange', 'equals'],
        // чтобы не нажимать "Apply" (фильтр применится сам)
        buttons: ['reset'],
        debounceMs: 200,
      },
      cellClass: 'selectable-text',
    },
    {
      field: 'bestBuyPool',
      headerName: 'bestBuyPool',
      width: 150,
      valueGetter: (params: any) => {
        const v = params.data.bestBuyPool;
        return `${v.version} ${v.dex}  ${v.feePpm}`;
      },
      cellClass: 'selectable-text',
    },
    {
      field: 'bestSellPool',
      headerName: 'bestSellPool',
      width: 150,
      valueGetter: (params: any) => {
        const v = params.data.bestSellPool;
        return `${v.version} ${v.dex} ${v.feePpm}`;
      },
      cellClass: 'selectable-text',
    },
    {
      field: 'tokenIn',
      headerName: 'tokenIn',
      width: 390,
      valueGetter: (p: any) => p.data?.tokenIn?.address ?? null,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['equals'],
        debounceMs: 200,
      },
      cellClass: 'selectable-text',
    },
    {
      field: 'tokenOut',
      headerName: 'tokenOut',
      width: 390,
      valueGetter: p => p.data?.tokenOut?.address ?? null,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['equals'],
        debounceMs: 200,
      },
      cellClass: 'selectable-text',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    headerClass: 'align-center',
    suppressMovable: true,

    filter: true,
    floatingFilter: true,
    resizable: true,
  };
}
