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
export const getApiList = createSelector(
  selectFeature,
  (state: ServersState) => state.config.apiList
);
export const getDataActiveBot = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.response
);


// export const selectBotData = createSelector(
//   selectFeature,
//   (state: ServersState) => state.activeElementData.botControlList
// );

//вопрос: как же сохранять ошибки для этого бота?
//и как их получать?
