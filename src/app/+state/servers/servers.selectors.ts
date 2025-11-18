import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SERVERS_FEATURE_KEY, ServersState} from './servers.reducer';

export const selectFeature = createFeatureSelector<ServersState>(SERVERS_FEATURE_KEY);

export const getFeatureName = createSelector(
  selectFeature,
  (state: ServersState) => state.featureName
);
export const getApiList = createSelector(
  selectFeature,
  (state: ServersState) => state.config.apiList
);
export const getDataActiveBot = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot
);
export const getActiveBotId = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botInfo.response.id
);
export const getServerList = createSelector(
  selectFeature,
  (state: ServersState) => state.config.serverList
);
export const getActiveServerIp = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.serverData.response.ip
);
export const getActiveServerPort = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.serverData.response.port
);
export const getActiveServerIpPort = createSelector(
  getActiveServerIp,
  getActiveServerPort,
  (ip, port) => `${ip}:${port}`
);
export const getBotsControlList = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.botControlList.response
);
export const getBotTypesList = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.botTypesList.response
);
export const getActionTypesList = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.actionTypesList.response
);
export const getServerData = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData?.serverData.response ? [state.activeElementData.serverData.response] : []
);

// ---------- isLoading селекторы для tabs/server-data ----------
export const getServerDataIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.serverData.isLoading
);
export const getBotTypesListIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.botTypesList.isLoading
);
export const getActionTypesListIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.actionTypesList.isLoading
);
export const getAllServerDataIsLoading = createSelector(
  getServerDataIsLoading,
  getBotTypesListIsLoading,
  getActionTypesListIsLoading,
  (serverLoading, botTypesLoading, actionTypesLoading) =>
    serverLoading || botTypesLoading || actionTypesLoading
);

// ---------- isLoaded селекторы для tabs/server-data ----------
export const getServerDataIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.serverData.isLoaded
);
export const getBotTypesListIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.botTypesList.isLoaded
);
export const getActionTypesListIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.actionTypesList.isLoaded
);
export const getAllServerDataIsLoaded = createSelector(
  getServerDataIsLoaded,
  getBotTypesListIsLoaded,
  getActionTypesListIsLoaded,
  (serverLoaded, botTypesLoaded, actionTypesLoaded) =>
    serverLoaded && botTypesLoaded && actionTypesLoaded
);

// ---------- error селекторы для tabs/server-data ----------
export const getLoadServerDataError = createSelector(
  selectFeature,
  (state: ServersState) => !!state.activeElementData.serverData.error
);
export const getLoadBotTypesError = createSelector(
  selectFeature,
  (state: ServersState) => !!state.activeElementData.botTypesList.error
);
export const getLoadActionTypesError = createSelector(
  selectFeature,
  (state: ServersState) =>  !!state.activeElementData.actionTypesList.error
);

// ---------- isLoading, isLoading, error селекторы для tabs/bots ----------
export const getBotControlListIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.botControlList.isLoading
);
export const getBotControlListIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.botControlList.isLoaded
);
export const getBotControlListError = createSelector(
  selectFeature,
  (state: ServersState) => !!state.activeElementData.botControlList.error
);

// ---------- isLoading селекторы для page-info ----------
export const getBotInfoIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botInfo.isLoading
);

export const getBotResultListIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botResultList.isLoading
);

export const getBotErrorListIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botErrorList.isLoading
);

export const getActiveBotIsLoading = createSelector(
  getBotInfoIsLoading,
  getBotResultListIsLoading,
  getBotErrorListIsLoading,
  (botInfoLoading, botResultLoading, botErrorLoading) =>
    botInfoLoading || botResultLoading || botErrorLoading
);

// ---------- isLoaded селекторы для page-info ----------
export const getBotInfoIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botInfo.isLoaded
);

export const getBotResultListIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botResultList.isLoaded
);

export const getBotErrorListIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botErrorList.isLoaded
);

export const getActiveBotIsLoaded = createSelector(
  getBotInfoIsLoaded,
  getBotResultListIsLoaded,
  getBotErrorListIsLoaded,
  (botInfoLoaded, botResultLoaded, botErrorLoaded) =>
    botInfoLoaded && botResultLoaded && botErrorLoaded
);

