import type {ColDef} from 'ag-grid-community';
import {IndicatorContainer} from '../../containers/ag-grid-containers/indicator-container/indicator-container';

export const botsControlStabs_1 = [
  {
    id: 'botRule1',
    createdAt: '2025-10-15T10:30:00.000Z',
    actionCount: 5,
    errorCount: 1,
    lastActionTimeStart: '2025-11-05T12:45:30.123Z',
    status: 'active',
    isSendData: true,
    running: true,
  },
  {
    id: 'botRule2',
    createdAt: '2025-10-15T09:15:00.000Z',
    actionCount: 12,
    errorCount: 0,
    lastActionTimeStart: '2025-10-15T12:40:15.456Z',
    status: 'pending',
    isSendData: false,
    running: true,
  },
  {
    id: 'botRule3',
    createdAt: '2025-10-15T11:20:00.000Z',
    actionCount: 8,
    errorCount: 3,
    lastActionTimeStart: '2025-10-15T12:35:45.789Z',
    status: 'error',
    isSendData: true,
    running: false,
  }
];

export const botsControlColDefs: ColDef[] = [
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

export const botsControlDefaultColDef: ColDef = {
  sortable: false,
  cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
  headerClass: 'align-center',
  suppressMovable: true,
};
