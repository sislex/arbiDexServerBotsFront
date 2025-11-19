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

export const setIsStartedBot = createAction(
  '[Servers] setIsStartedBot',
  props<{ isStarted: boolean, id: string }>()
);
export const restartedBot = createAction(
  '[Servers] restartedBot',
  props<{ id: string }>()
);

export const deletingBot = createAction(
  '[Servers] deletingBot',
  props<{ id: string }>()
);

export const isSendData = createAction(
  '[Servers] isSendData',
  props<{ isSendData: boolean, id: string }>()
);

export const updateBot = createAction(
  '[Servers] updateBot',
  props<{ isSendData: boolean, id: string }>()
);

export const loadServerList = createAction('[Servers] loadServerList');
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

export const loadActionTypesList = createAction('[Servers] loadActionTypesList');
export const loadActionTypesListSuccess = createAction(
  '[Servers] loadActionTypesListSuccess',
  props<{ response: ITypesList[] }>()
);
export const loadActionTypesListFailure = createAction(
  '[Servers] loadActionTypesListFailure',
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

export const loadBotControl = createAction('[Servers] loadBotControlList');
export const loadBotControlSuccess = createAction(
  '[Servers] loadBotControlSuccess',
  props<{ response: any }>()
);
export const loadBotControlFailure = createAction(
  '[Servers] loadBotControlFailure',
  props<{ error: string }>()
);

export const loadBotParams = createAction('[Servers] loadBotControlList');
export const loadBotParamsSuccess = createAction(
  '[Servers] loadBotParamsSuccess',
  props<{ response: any }>()
);
export const loadBotParamsFailure = createAction(
  '[Servers] loadBotParamsFailure',
  props<{ error: string }>()
);

export const loadBotErrors = createAction('[Servers] loadBotControlList');
export const loadBotErrorsSuccess = createAction(
  '[Servers] loadBotErrorsSuccess',
  props<{ response: any }>()
);
export const loadBotErrorsFailure = createAction(
  '[Servers] loadBotErrorsFailure',
  props<{ error: string }>()
);
