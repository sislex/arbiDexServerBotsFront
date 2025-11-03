import { createAction, props } from '@ngrx/store';

export const setActiveServer = createAction(
  '[Servers] setActiveServer',
  props<{ ip: string }>()
);

export const setActiveTab = createAction(
  '[Servers] setActiveTab',
  props<{ tab: string }>()
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

export const toggleSidebar = createAction('[Servers] toggleSidebar');

