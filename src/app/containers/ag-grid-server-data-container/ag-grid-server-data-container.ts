import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {getServerData} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {IServerData} from '../../models/servers';
import {AgGrid} from '../../components/ag-grid/ag-grid';
import type {ColDef} from 'ag-grid-community';
import {TimerContainer} from '../timer-container/timer-container';
import {IndicatorContainer} from '../indicator-container/indicator-container';

@Component({
  selector: 'app-ag-grid-server-data-container',
  imports: [
    AsyncPipe,
    AgGrid
  ],
  standalone: true,
  templateUrl: './ag-grid-server-data-container.html',
  styleUrl: './ag-grid-server-data-container.scss'
})
export class AgGridServerDataContainer {
  private store = inject(Store);
  serverData$: Observable<IServerData[]> = this.store.select(getServerData);

  colDefs: ColDef[] = [
    {
      field: 'ip',
      headerName: 'IP',
      flex: 1,
    },
    {
      headerName: 'Authorization Data',
      flex: 1,
      valueGetter:(params) => {
        const authorizationData = params.data?.authorizationData;
        return authorizationData || "-";
      }
    },
    {
      field: 'version',
      headerName: 'Version',
      flex: 1,
    },
    {
      headerName: 'Time To Close',
      cellRenderer: TimerContainer,
      flex: 1,
      valueGetter: (params) => {
        const time = params.data?.timestampFinish;
        if (!time) return null;

        const finishUTC = Date.parse(time);
        return finishUTC > Date.now() ? time : null;
      },
    },
    {
      headerName: 'Time After Close',
      cellRenderer: TimerContainer,
      flex: 1,
      valueGetter: (params) => {
        const time = params.data?.timestampFinish;
        if (!time) return null;

        const finishUTC = Date.parse(time);
        return finishUTC < Date.now() ? time : null;
      },
    },
    {
      field: 'botsCount',
      headerName: 'Bots',
      flex: 1,
    },
    {
      field: 'status',
      width: 80,
      headerName: 'Status',
      cellRenderer: IndicatorContainer,
      cellRendererParams: {
        colorMapping: {
          'active': 'green',
          'running': 'green',
          'inactive': 'red',
          'stopped': 'red',
          'pending': 'yellow',
          'error': 'red'
        }
      },
      cellStyle: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' },
      headerClass: 'align-center little-width',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    headerClass: 'align-center',
    suppressMovable: true,
  };
}
