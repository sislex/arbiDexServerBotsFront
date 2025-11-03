import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SERVERS_FEATURE_KEY, ServersState} from './servers.reducer';

export const selectFeature = createFeatureSelector<ServersState>(SERVERS_FEATURE_KEY);

export const getFeatureName = createSelector(
  selectFeature,
  (state: ServersState) => state.featureName
);
export const getIsSidebarOpen = createSelector(
  selectFeature,
  (state: ServersState) => state.environmentData.isSidebarOpen
);
export const getTabList = createSelector(
  selectFeature,
  (state: ServersState) => state.environmentData.tabList
);
export const getServerList = createSelector(
  selectFeature,
  (state: ServersState) => state.environmentData.serverList
);
export const getActiveServer = createSelector(
  selectFeature,
  (state: ServersState) => state.environmentData.ip
);
export const getActiveTab = createSelector(
  selectFeature,
  (state: ServersState) => state.environmentData.activeTab
);
export const getBotTypesList = createSelector(
  selectFeature,
  (state: ServersState) => state.botTypesList
);
export const getActionTypesList = createSelector(
  selectFeature,
  (state: ServersState) => state.actionTypesList
);
