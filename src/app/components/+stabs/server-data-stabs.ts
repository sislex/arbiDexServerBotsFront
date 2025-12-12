import type {ColDef} from 'ag-grid-community';
import {TimerContainer} from '../../containers/timer-container/timer-container';
import {IndicatorContainer} from '../../containers/indicator-container/indicator-container';

const addDaysUTC = (days: number): string => {
  const now = new Date();
  const utcNow = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + days,
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );
  return new Date(utcNow).toISOString();
};

export const serverStabs_1 = {
  ip: '192.168.0.10',
  port: '6060',
  version: '1.0.0',
  status: 'active',
  timestampStart: addDaysUTC(-3),
  timestampFinish: addDaysUTC(3),
  botsCount: 2,
};

export const serverStabs_2 = [
  {
    ip: '192.168.0.11',
    port: '6061',
    version: '1.0.0',
    status: 'active',
    timestampStart: addDaysUTC(-2),
    timestampFinish: addDaysUTC(2),
    botsCount: 4,
  },
  {
    ip: '192.168.0.12',
    port: '6062',
    version: '1.2.1',
    status: 'active',
    timestampStart: addDaysUTC(-1),
    timestampFinish: addDaysUTC(1),
    botsCount: 2,
  },
  {
    ip: '192.168.0.13',
    port: '6063',
    version: '2.0.0',
    status: 'active',
    timestampStart: addDaysUTC(-3),
    timestampFinish: addDaysUTC(0),
    botsCount: 5,
  },
  {
    ip: '192.168.0.14',
    port: '6064',
    version: '2.1.4',
    status: 'active',
    timestampStart: addDaysUTC(-5),
    timestampFinish: addDaysUTC(-2),
    botsCount: 6,
  },
  {
    ip: '192.168.0.15',
    port: '6065',
    version: '3.0.0',
    status: 'active',
    timestampStart: addDaysUTC(-4),
    timestampFinish: addDaysUTC(4),
    botsCount: 9,
  },
];

export const serverStabs_3 = {
  ip: '192.168.0.10',
  port: '6060',
  version: '',
  status: 'error',
  timestampStart: addDaysUTC(-10),
  timestampFinish: addDaysUTC(1),
  botsCount: 0,
};


export const serverColDefs: ColDef[] = [
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

export const serverDefaultColDef: ColDef = {
  sortable: false,
  cellStyle: { textAlign: 'center'},
  headerClass: 'align-center',
  suppressMovable: true,
};
