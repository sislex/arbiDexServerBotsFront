import {createReducer, on} from '@ngrx/store';
import * as ServersActions from './servers.actions';

export const SERVERS_FEATURE_KEY = 'servers';

export interface IBotData {
  id: string;
  name: string;
  type: any;
  description: string;
  gate: any;
  maxTimeRequest: number;
  timeRequest: number;
  status: string;
  sendData: boolean;
  isStarted: boolean;

  botJSON: string,
  actionJSON: string,
  actionTypeSelect: string,
  botTypeSelect: string,
}

export interface IServerAuthData {
  login: string;
  password: string;
}

export interface IEnvironmentData {
  isSidebarOpen: boolean;
  activeTab: string;
  ip: string;
  tabList: string[];
}

export interface IServerDataResponse { //то что приходит с докера = сервера
  version: string;
  startDate: Date;
  // timestamp: Date; //выносим в машинный интерфейс.
  botsList: IBotData[];
}

export interface IServerData { //то что отображаем
  ip: string;
  port: string;
  version: string;
  status: string;
  timestampFinish: number;
  timestampStart: number;
  botsCount: number;
}

export interface IServer {
  ip: string;
  port?: string;
  name: string;
}

export interface IConfig {
  serverList: IServer[];
}

export interface ITypesList {
  id: string;
  label: string;
  type: string;
  description: string;
}

export interface GateItem {
  ip: string;
  name: string;
}

export interface IActiveElementData {
  serverData: IServerData;
  botTypesList: ITypesList[];
  actionTypesList: ITypesList[];
  gateList: GateItem[];
}

export interface ServersState {
  featureName: string;
  config: IConfig;
  serverListResponse: IServerData[];
  environmentData: IEnvironmentData;
  activeBotData: IBotData[];
  activeElementData: IActiveElementData;
}

export interface ServersPartialState {
  readonly [SERVERS_FEATURE_KEY]: ServersState;
}

export const initialState: ServersState = {
  featureName: 'server manager', //Временно до внедрения в основное приложение.
  config: {
    serverList: [
      {
        ip: '192.169.0.0',
        port: '6060',
        name: 'test_Server_1',
      },
      {
        ip: '192.169.0.1',
        port: '6060',
        name: 'test_Server_2',
      },
      {
        ip: '192.169.0.3',
        port: '6060',
        name: 'test_Server_3',
      },
      {
        ip: '45.135.182.251',
        port: '1001',
        name: 'FIRST_REAL_SERVER',
      },
    ],
  },
  serverListResponse: [],
  environmentData: {
    isSidebarOpen: true,
    activeTab: 'bots',
    ip: '192.169.0.1',
    tabList: ['bots', 'gates', 'server data',],
  },
  activeBotData: [],
  activeElementData: {
    serverData: {
      ip: '',
      port: '',
      version: '',
      status: 'active',
      timestampFinish: 0,
      timestampStart: 0,
      botsCount: 0
    },
    botTypesList: [],
    actionTypesList: [],
    gateList: [],
  },
};

export const serversReducer = createReducer(
  initialState,
  on(ServersActions.toggleSidebar, (state) => ({
    ...state,
    environmentData: {
      ...state.environmentData,
      isSidebarOpen: !state.environmentData.isSidebarOpen
    }
  })),
  on(ServersActions.setActiveServer, (state, {ip}) => ({
    ...state,
    environmentData: {
      ...state.environmentData,
      ip: ip
    }
  })),
  on(ServersActions.setActiveTab, (state, {tab}) => ({
    ...state,
    environmentData: {
      ...state.environmentData,
      activeTab: tab
    }
  })),
  on(ServersActions.setActiveServerData, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      serverData: response
    }
  })),
  on(ServersActions.setBotTypesList, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      botTypesList: response
    }
  })),
  on(ServersActions.setActionTypesList, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      actionTypesList: response
    }
  })),
  on(ServersActions.setGateList, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      gateList: response
    }
  })),
);

