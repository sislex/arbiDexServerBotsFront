import { createReducer } from '@ngrx/store';
// import * as ServersActions from './servers.actions';

export const SERVERS_FEATURE_KEY = 'servers';

export interface IBotData {
}
export interface IGateData {
}
export interface IServerData {
  serverName: string;
  login: string;
  password: string;
  version: string;
  timeToClose: Date;
  timeAfterClose: Date;
  status: boolean;
  bots: IBotData[];
  gates: IGateData[];
}

export interface ServersState {
  featureName: string;
  serverListApi: string[];
  serverListData: IServerData[];
}

export interface ServersPartialState {
  readonly [SERVERS_FEATURE_KEY]: ServersState;
}

export const initialState: ServersState = {
  featureName: 'servers',
  serverListApi: [],
  serverListData: [],
};

export const serversReducer = createReducer(
  initialState,

);

