import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, Input} from '@angular/core';
import {IndicatorContainer} from '../../containers/ag-grid-containers/indicator-container/indicator-container';
import {TimerContainer} from '../../containers/ag-grid-containers/timer-container/timer-container';
import {IServerData} from '../../models/servers';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-server-data',
  imports: [AgGridAngular],
  standalone: true,
  templateUrl: './ag-grid-server-data.html',
  styleUrl: './ag-grid-server-data.scss'
})
export class AgGridServerData {
  @Input() rowData: IServerData[] = [];

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
        const ts = params.data?.timestampFinish;
        return ts > Date.now() ? ts : null;
      },
    },
    {
      headerName: 'Time After Close',
      cellRenderer: TimerContainer,
      flex: 1,
      valueGetter: (params) => {
        const ts = params.data?.timestampFinish;
        return ts < Date.now() ? ts : null;
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
      cellStyle: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' },
      headerClass: 'align-center little-width',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    headerClass: 'align-center',
    resizable: false,
    suppressMovable: true,
  };
}
