import {createReducer, on} from '@ngrx/store';
import * as ServersActions from './servers.actions';

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
export interface IEnvironmentData {
  isSidebarOpen: boolean;
}

export interface ServersState {
  featureName: string;
  serverListApi: string[];
  serverListData: IServerData[];
  environmentData: IEnvironmentData;
}

export interface ServersPartialState {
  readonly [SERVERS_FEATURE_KEY]: ServersState;
}

export const initialState: ServersState = {
  featureName: 'servers',
  serverListApi: [],
  serverListData: [],
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

