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
  serverList: IServer[];
}

// export interface IBotData {
//Статусы для каждого бота:
//действующий
//остановлен по предназначению (Остановлен или закончил или остановили принудительно)
//остановлен из-за ошибки
//статус ожидает ответ от сервера
//статус пауза
//Статус выполнения
// сколько всего ошибок с момента запуска и какие они были
// поиск ошибки от и до заданных
// path: 'server/:ip/tab/:tabId',
//actions для бота
//пауза/продолжить
//остановка/запуск
//перезапуск
//изменение настроек бота
//получить настройки бота
// }

export interface IServerDataResponse { //то что приходит с докера = сервера
  version: string;
  startDate: Date;
  // status: boolean;
  // timestamp: Date; //выносим в машинный интерфейс.
  botsList: IBotData[];
  // bots: IBotData[];
}

export interface IServerData { //то что отображаем
  version: string;
  status: boolean;
  timestamp: Date;
  bots: IBotData[];
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
  label: string;
  type: string;
  description: string;
}

export interface ServersState {
  featureName: string;
  config: IConfig;
  serverListResponse: IServerData[];
  environmentData: IEnvironmentData;
  botTypesList: ITypesList[];
  actionTypesList: ITypesList[];
  activeBotData: IBotData[];
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
        port: '8080',
        name: 'testServer',
      },
    ],
  },
  serverListResponse: [],
  environmentData: {
    isSidebarOpen: true,
    activeTab: 'bots',
    ip: '192.169.0.1',
    tabList: ['bots', 'gates', 'server data',],
    serverList: [{name: 'serv1', ip: '192.169.0.0'}, {name: 'serv2', ip: '192.169.0.1'}]
  },
  botTypesList: [],
  actionTypesList: [],
  activeBotData: [],
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
);

