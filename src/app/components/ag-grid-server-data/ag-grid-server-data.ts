import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, Input} from '@angular/core';
import {Indicator} from '../ag-grid-components/indicator/indicator';
import {Timer} from '../ag-grid-components/timer/timer';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-server-data',
  imports: [AgGridAngular],
  standalone: true,
  templateUrl: './ag-grid-server-data.html',
  styleUrl: './ag-grid-server-data.scss'
})
export class AgGridServerData {
  @Input() rowData: any[] = [];

  colDefs: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'authorizationData',
      headerName: 'Authorization Data',
      flex: 1,

    },
    {
      field: 'version',
      headerName: 'Version',
      flex: 1,
    },
    {
      headerName: 'Time To Close',
      cellRenderer: Timer,
      flex: 1,
      valueGetter: (params) => {
        const ts = params.data?.timestamp;
        return ts > Date.now() ? ts : null;
      },
    },
    {
      headerName: 'Time After Close',
      cellRenderer: Timer,
      flex: 1,
      valueGetter: (params) => {
        const ts = params.data?.timestamp;
        return ts < Date.now() ? ts : null;
      },
    },
    {
      field: 'bots',
      headerName: 'Bots',
      flex: 1,
    },
    {
      field: 'status',
      width: 80,
      headerName: 'Status',
      cellRenderer: Indicator,
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
