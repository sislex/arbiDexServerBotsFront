import {Component, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {getActiveServerIpPort, getBotsControlList} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {Router} from '@angular/router';
import {take} from 'rxjs';
import type {ColDef} from 'ag-grid-community';
import {IndicatorContainer} from '../ag-grid-containers/indicator-container/indicator-container';
import {AgGrid} from '../../components/ag-grid/ag-grid';

@Component({
  selector: 'app-ag-grid-bots-control-container',
  imports: [
    AsyncPipe,
    AgGrid
  ],
  standalone: true,
  templateUrl: './ag-grid-bots-control-container.html',
  styleUrl: './ag-grid-bots-control-container.scss'
})
export class AgGridBotsControlContainer {
  readonly dialog = inject(MatDialog);
  readonly store = inject(Store);
  private router = inject(Router);

  botsControlList$ = this.store.select(getBotsControlList);
  ipPort$ = this.store.select(getActiveServerIpPort);

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
      width: 120,
      cellClass: 'selectable-text',
    },
    {
      field: "createdAt",
      headerName: 'Created',
      flex: 1,
      cellClass: 'selectable-text',
      valueFormatter: params => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleString('ru-RU', {
          timeZone: 'Europe/Moscow'
        });
      },
    },
    {
      field: "jobCount",
      headerName: 'Jobs',
      width: 100,
    },
    {
      field: "arbitrageCount",
      headerName: 'Arbitrages',
      width: 120,
    },
    {
      field: "errorCount",
      headerName: 'Errors',
      width: 100,
    },
    {
      field: "latency",
      headerName: 'Average Request Time',
      flex: 1,
    },
    {
      field: "lastLatency",
      headerName: 'Last Request Time',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      cellRenderer: IndicatorContainer,
      cellRendererParams: {
        colorMapping: {
          'active': 'green',
          '': 'red',
          'finished': 'gray',
          'pause': 'yellow',
        }
      },
      cellStyle: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' },
      headerClass: 'align-center little-width',
    },
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
