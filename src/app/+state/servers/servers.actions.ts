import { createAction, props } from '@ngrx/store';
import {IServerData, ITypesList} from '../../models/servers';

export const setServerList = createAction('[Servers] setServerList');
export const clearActiveElementData = createAction('[Servers] clearActiveElementData');

export const setActiveServer = createAction(
  '[Servers] setActiveServer',
  props<{ ip: string, port: string }>()
);

export const setActiveBot = createAction(
  '[Servers] setActiveBot',
  props<{ botId: string }>()
);

export const setActionTypesList = createAction(
  '[Servers] setActionTypesList',
  props<{ response: any }>()
);

export const setGateList = createAction(
  '[Servers] setGateList',
  props<{ response: any }>()
);

export const deletingBot = createAction(
  '[Servers] deletingBot',
  props<{ id: string }>()
);

export const updateBot = createAction(
  '[Servers] updateBot',
  props<{ isSendData: boolean, id: string }>()
);

export const loadServerList = createAction(
  '[Servers] loadServerList',
  props<{ ip: string, port: string }>()
);
export const loadServerListSuccess = createAction(
  '[Servers] loadServerListSuccess',
  props<{ response: IServerData }>()
);
export const loadServerListFailure = createAction(
  '[Servers] loadServerListFailure',
  props<{ error: string }>()
);

export const loadBotTypesList = createAction('[Servers] loadBotTypesList');
export const loadBotTypesListSuccess = createAction(
  '[Servers] loadBotTypesListSuccess',
  props<{ response: ITypesList[] }>()
);
export const loadBotTypesListFailure = createAction(
  '[Servers] loadBotTypesListFailure',
  props<{ error: string }>()
);

export const loadJobTypesList = createAction('[Servers] loadJobTypesList');
export const loadJobTypesListSuccess = createAction(
  '[Servers] loadJobTypesListSuccess',
  props<{ response: ITypesList[] }>()
);
export const loadJobTypesListFailure = createAction(
  '[Servers] loadJobTypesListFailure',
  props<{ error: string }>()
);

export const loadBotControlList = createAction('[Servers] loadBotControlList');
export const loadBotControlListSuccess = createAction(
  '[Servers] loadBotControlListSuccess',
  props<{ response: any }>()
);
export const loadBotControlListFailure = createAction(
  '[Servers] loadBotControlListFailure',
  props<{ error: string }>()
);

export const loadBotInfo = createAction(
  '[Servers] loadBotInfo',
  props<{ botId: string }>()
);
export const loadBotInfoSuccess = createAction(
  '[Servers] loadBotInfoSuccess',
  props<{ response: any }>()
);
export const loadBotInfoFailure = createAction(
  '[Servers] loadBotInfoFailure',
  props<{ error: string }>()
);

export const loadBotParams = createAction(
  '[Servers] loadBotParams',
  props<{ botId: string }>()
);
export const loadBotParamsSuccess = createAction(
  '[Servers] loadBotParamsSuccess',
  props<{ response: any }>()
);
export const loadBotParamsFailure = createAction(
  '[Servers] loadBotParamsFailure',
  props<{ error: string }>()
);

export const loadBotErrors = createAction(
  '[Servers] loadBotErrors',
  props<{ botId: string }>()
);
export const loadBotErrorsSuccess = createAction(
  '[Servers] loadBotErrorsSuccess',
  props<{ response: any }>()
);
export const loadBotErrorsFailure = createAction(
  '[Servers] loadBotErrorsFailure',
  props<{ error: string }>()
);

export const loadBotArbitrationSituations = createAction(
  '[Servers] loadBotArbitrationSituations',
  props<{ botId: string }>()
);
export const loadBotArbitrationSituationsSuccess = createAction(
  '[Servers] loadBotArbitrationSituationsSuccess',
  props<{ response: any }>()
);
export const loadBotArbitrationSituationsFailure = createAction(
  '[Servers] loadBotArbitrationSituationsFailure',
  props<{ error: string }>()
);

export const setIsStartedBot = createAction(
  '[Servers] setIsStartedBot',
  props<{ isStarted: boolean, id: string }>()
);
export const setIsStartedBotSuccess = createAction(
  '[Servers] setIsStartedBotSuccess',
  props<{ response: any }>()
);
export const setIsStartedBotFailure = createAction(
  '[Servers] setIsStartedBotFailure',
  props<{ error: string }>()
);

export const isSendData = createAction(
  '[Servers] isSendData',
  props<{ isSendData: boolean, id: string }>()
);
export const setSendDataBotSuccess = createAction(
  '[Servers] setSendDataBotSuccess',
  props<{ response: any }>()
);
export const setSendDataBotFailure = createAction(
  '[Servers] setSendDataBotFailure',
  props<{ error: string }>()
);

export const restartedBot = createAction(
  '[Servers] restartedBot',
  props<{ id: string }>()
);
export const restartBotSuccess = createAction(
  '[Servers] restartBotSuccess',
  props<{ response: any }>()
);
export const restartBotFailure = createAction(
  '[Servers] restartBotFailure',
  props<{ error: string }>()
);

export const setBotSettings = createAction(
  '[Servers] setBotSettings',
  props<{ id: string, settings: string }>()
);
export const setBotSettingsSuccess = createAction(
  '[Servers] setBotSettingsSuccess',
  props<{ response: any }>()
);
export const setBotSettingsFailure = createAction(
  '[Servers] setBotSettingsFailure',
  props<{ error: string }>()
);

export const getRulesList = createAction('[Servers] getRulesList');
export const getRulesListSuccess = createAction(
  '[Servers] getRulesListSuccess',
  props<{ response: any }>()
);
export const getRulesListFailure = createAction(
  '[Servers] getRulesListFailure',
  props<{ error: string }>()
);

export const setApiList = createAction('[Servers] setApiList');
export const setApiListSuccess = createAction(
  '[Servers] setApiListSuccess',
  props<{ response: any }>()
);
export const setApiListFailure = createAction(
  '[Servers] setApiListFailure',
  props<{ error: string }>()
);

