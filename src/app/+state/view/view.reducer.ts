import {createReducer, on} from '@ngrx/store';
import * as ViewActions from './view.actions';

export const VIEW_FEATURE_KEY = 'view';

export interface ViewState {
  isSidebarOpen: boolean;
  activeTab: string;
  tabList: string[];
}

export interface ViewPartialState {
  readonly [VIEW_FEATURE_KEY]: ViewState;
}

export const initialState: ViewState = {
  isSidebarOpen: true,
  activeTab: 'bots',
  tabList: ['bots', 'gates', 'server data'],
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
);
