import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SERVERS_FEATURE_KEY, ServersState} from './servers.reducer';

export const selectFeature = createFeatureSelector<ServersState>(SERVERS_FEATURE_KEY);

export const getFeatureName = createSelector(
  selectFeature,
  (state: ServersState) => state.featureName
);
export const getServerList = createSelector(
  selectFeature,
  (state: ServersState) => state.config.serverList
);
export const getActiveServerIp = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.serverData.ip
);
export const getActiveServerPort = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.serverData.port
);
export const getActiveServerIpPort = createSelector(
  getActiveServerIp,
  getActiveServerPort,
  (ip, port) => `${ip}:${port}`
);
export const getBotsControlList = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.botControlList
);
export const getBotTypesList = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.botTypesList
);
export const getActionTypesList = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.actionTypesList
);
export const getServerData = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData?.serverData ? [state.activeElementData.serverData] : []
);
