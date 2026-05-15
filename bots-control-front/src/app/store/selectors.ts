import type { RootState } from './store';

export const selectActiveTab = (state: RootState) => state.view.activeTab;

export const selectServerList = (state: RootState) => state.servers.serverList;
export const selectActiveServer = (state: RootState) => state.servers.activeServer;

export const selectServerDataState = (state: RootState) => state.servers.serverData;
export const selectBotTypesState = (state: RootState) => state.servers.botTypes;
export const selectJobTypesState = (state: RootState) => state.servers.jobTypes;
export const selectBotControlListState = (state: RootState) => state.servers.botControlList;
export const selectRulesListState = (state: RootState) => state.servers.rulesList;

export const selectActiveBotInfoState = (state: RootState) => state.servers.activeBotInfo;
export const selectActiveBotParamsState = (state: RootState) => state.servers.activeBotParams;
export const selectActiveBotErrorsState = (state: RootState) => state.servers.activeBotErrors;
export const selectActiveBotArbitrageState = (state: RootState) =>
  state.servers.activeBotArbitrage;
export const selectBotControlActionState = (state: RootState) => state.servers.botControlAction;
