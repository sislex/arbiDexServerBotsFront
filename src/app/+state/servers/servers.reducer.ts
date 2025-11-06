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

export interface IGateItem {
  ip: string;
  name: string;
}

export interface ILastActionResult {
  ok: boolean;
  amountOut: string;
}

export interface IBotControl {
  id: string;
  running: boolean;
  createdAt: string;
  actionCount: number;
  errorCount: number;
  lastActionTimeStart: string;
  lastActionTimeFinish: string;
  lastLatency: number;
  lastActionResult: ILastActionResult;
}

export interface IActiveElementData {
  serverData: IServerData;
  botTypesList: ITypesList[];
  actionTypesList: ITypesList[];
  gateList: IGateItem[];
  botControlList: IBotControl[];
}

export interface ServersState {
  featureName: string;
  config: IConfig;
  serverListResponse: IServerData[];
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
        ip: '192.169.0.3',
        port: '6060',
        name: 'UNREAL_SERVER',
      },
      {
        ip: '45.135.182.251',
        port: '1001',
        name: 'FIRST_REAL_SERVER',
      },
    ],
  },
  serverListResponse: [],
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
    botControlList: [],
  },
};

export const serversReducer = createReducer(
  initialState,
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
  on(ServersActions.setBotControlList, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      botControlList: response
    }
  })),
  // on(ServersActions.setActiveServer, (state, {ip, port}) => ({
  //   ...state,
  //   activeElementData: {
  //     ...state.activeElementData,
  //     serverData: {
  //       ...state.activeElementData.serverData,
  //       ip: ip,
  //       port: port,
  //     }
  //   }
  // })),
);

