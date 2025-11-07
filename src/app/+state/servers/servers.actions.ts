import { createAction, props } from '@ngrx/store';

export const setServerList = createAction('[Servers] setServerList');
export const clearActiveElementData = createAction('[Servers] clearActiveElementData');

export const setActiveServer = createAction(
  '[Servers] setActiveServer',
  props<{ ip: string, port: string }>()
);

export const setActiveServerData = createAction(
  '[Servers] setActiveServerData',
  props<{ response: any }>()
);

export const setBotTypesList = createAction(
  '[Servers] setBotTypesList',
  props<{ response: any }>()
);

export const setActionTypesList = createAction(
  '[Servers] setActionTypesList',
  props<{ response: any }>()
);

export const setGateList = createAction(
  '[Servers] setGateList',
  props<{ response: any }>()
);

export const setBotControlList = createAction(
  '[Servers] setBotControlList',
  props<{ response: any }>()
);

export const setIsStartedBot = createAction(
  '[Servers] setIsStartedBot',
  props<{ isStarted: boolean, id: string }>()
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

