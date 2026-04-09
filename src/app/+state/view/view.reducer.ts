import {createReducer, on} from '@ngrx/store';
import * as ViewActions from './view.actions';
import {IServersAPI} from '../../models/view';
import {emptyAsyncResponse} from './stabs';

export const VIEW_FEATURE_KEY = 'view';

export interface ViewState {
  isSidebarOpen: boolean;
  activeTab: string;
  tabList: string[];
  servers: IServersAPI;
}

export interface ViewPartialState {
  readonly [VIEW_FEATURE_KEY]: ViewState;
}

export const initialState: ViewState = {
  isSidebarOpen: true,
  activeTab: '',
  tabList: ['bots', 'rules',
    // 'gates',
    'server data'],
  servers: emptyAsyncResponse([]),
};

export const viewReducer = createReducer(
  initialState,
  on(ViewActions.toggleSidebar, (state) => ({
    ...state,
    isSidebarOpen: !state.isSidebarOpen
  })),
  on(ViewActions.setActiveTab, (state, {tab}) => ({
    ...state,
    activeTab: tab
  })),

  on(ViewActions.setServersData, (state) => ({
    ...state,
    servers: {
      ...state.servers,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(ViewActions.setServersDataSuccess, (state, {response}) => ({
    ...state,
    servers: {
      ...state.servers,
      loadingTime: Date.now() - state.servers.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(ViewActions.setServersDataFailure, (state, {error}) => ({
    ...state,
    servers: {
      ...state.servers,
      loadingTime: Date.now() - state.servers.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),
);
