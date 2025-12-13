import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {getActiveServerIpPort, getBotsControlList, getRuleList} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {take} from 'rxjs';
import {Router} from '@angular/router';
import {ColDef, ICellRendererParams} from 'ag-grid-community';
import {AgGrid} from '../../components/ag-grid/ag-grid';

@Component({
  selector: 'app-ag-grid-rules-table-container',
  imports: [
    AsyncPipe,
    AgGrid
  ],
  standalone: true,
  templateUrl: './ag-grid-rules-table-container.html',
  styleUrl: './ag-grid-rules-table-container.scss',
})
export class AgGridRulesTableContainer {
  private store = inject(Store)
  private router = inject(Router);

  botsControlList$ = this.store.select(getBotsControlList)
  ipPort$ = this.store.select(getActiveServerIpPort)
  ruleList$ = this.store.select(getRuleList)

  colDefs: ColDef[] = [
    {
      headerName: '#',
      width: 50,
      valueGetter: params => {
        if (!params.node || params.node.rowIndex == null) return '';
        return params.node.rowIndex + 1;
      },
    },
    {
      field: "id",
      headerName: 'ID',
      width: 150,
    },
    {
      field: "botParams",
      headerName: 'Bot Rule',
      flex: 1,
      cellStyle: { textAlign: 'left'},
      wrapText: true,
      autoHeight: true,
      valueFormatter: p => JSON.stringify(p.value, null, 2),

      cellRenderer: (params: ICellRendererParams) => {
        const pre = document.createElement("pre");
        pre.style.margin = "0";
        pre.style.whiteSpace = "pre-wrap";
        pre.textContent = params.valueFormatted ?? params.value;
        return pre;
      },
    },
    {
      field: "jobParams",
      headerName: 'Job Rule',
      flex: 1,
      cellStyle: { textAlign: 'left'},
      wrapText: true,
      autoHeight: true,
      valueFormatter: p => JSON.stringify(p.value, null, 2),

      cellRenderer: (params: ICellRendererParams) => {
        const pre = document.createElement("pre");
        pre.style.margin = "0";
        pre.style.whiteSpace = "pre-wrap";
        pre.textContent = params.valueFormatted ?? params.value;
        return pre;
      },
    }
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
    headerClass: 'align-center',
    suppressMovable: true,
  };

  events($event: any) {
    if ($event.event === 'AgGrid:DOUBLE_CLICKED_ROW') {
      this.ipPort$.pipe(take(1)).subscribe(ipPort => {
        this.router.navigate([`/server/${ipPort}/${$event.row.data.id}`]);
      });
    }
  }
}
