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
}

export interface IServerAuthData {
  login: string;
  password: string;
}

export interface IEnvironmentData {
  isSidebarOpen: boolean;
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

export interface IServerData {
  version: string;
  status: boolean;
  timestamp: Date;
  bots: IBotData[];
}

export interface IServer {
  ip: string;
  port: string;
  name: string;
}

export interface IConfig {
  serverList: IServer[];
}

export interface ServersState {
  featureName: string;
  config: IConfig;
  serverListResponse: IServerData[];
  environmentData: IEnvironmentData;
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
  }
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
);

