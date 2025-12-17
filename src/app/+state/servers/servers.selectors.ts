import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SERVERS_FEATURE_KEY, ServersState} from './servers.reducer';

export const selectFeature = createFeatureSelector<ServersState>(SERVERS_FEATURE_KEY);

export const getFeatureName = createSelector(
  selectFeature,
  (state: ServersState) => state.featureName
);
export const getApiList = createSelector(
  selectFeature,
  (state: ServersState) => state.config.apiList.response
);
export const getActionParams = createSelector(
  selectFeature,
  (state: ServersState) => []
);
export const getDataActiveBot = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot
);
export const getDataActiveBotArbitrage = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botArbitrageList.response
);


export const getInfoActiveBot = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botInfo.response
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
export const getJobTypesList = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.jobTypesList.response
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
export const getJobTypesListIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.jobTypesList.isLoading
);
export const getAllServerDataIsLoading = createSelector(
  getServerDataIsLoading,
  getBotTypesListIsLoading,
  getJobTypesListIsLoading,
  (serverLoading, botTypesLoading, jobTypesLoading) =>
    serverLoading || botTypesLoading || jobTypesLoading
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
export const getJobTypesListIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.jobTypesList.isLoaded
);
export const getAllServerDataIsLoaded = createSelector(
  getServerDataIsLoaded,
  getBotTypesListIsLoaded,
  getJobTypesListIsLoaded,
  (serverLoaded, botTypesLoaded, jobTypesLoaded) =>
    serverLoaded && botTypesLoaded && jobTypesLoaded
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
export const getLoadJobTypesError = createSelector(
  selectFeature,
  (state: ServersState) =>  !!state.activeElementData.jobTypesList.error
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

export const getBotResultListIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botResultList.isLoading
);

export const getBotArbitrageListIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botArbitrageList.isLoading
);

export const getBotErrorListIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botErrorList.isLoading
);

export const getActiveBotIsLoading = createSelector(
  getBotResultListIsLoading,
  getBotArbitrageListIsLoading,
  getBotErrorListIsLoading,
  (botResultLoading,botArbitrageLoading, botErrorLoading) =>
    botResultLoading || botArbitrageLoading || botErrorLoading
);

// ---------- isLoaded селекторы для page-info ----------
export const getBotResultListIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botResultList.isLoaded
);
export const getBotArbitrageListListIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botArbitrageList.isLoaded
);
export const getBotErrorListIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.activeBot.botErrorList.isLoaded
);
export const getActiveBotIsLoaded = createSelector(
  getBotResultListIsLoaded,
  getBotArbitrageListListIsLoaded,
  getBotErrorListIsLoaded,
  (botResultLoaded, botArbitrageLoaded, botErrorLoaded) =>
    botResultLoaded && botArbitrageLoaded && botErrorLoaded
);

// ---------- селекторы для rules ----------
export const getRuleListIsLoaded = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.ruleList.isLoaded
);
export const getRuleListIsLoading = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.ruleList.isLoading
);
export const getRuleListError = createSelector(
  selectFeature,
  (state: ServersState) => !!state.activeElementData.ruleList.error
);
export const getRuleList = createSelector(
  selectFeature,
  (state: ServersState) => state.activeElementData.ruleList.response
);
