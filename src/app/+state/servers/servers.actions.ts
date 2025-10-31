import { createAction, props } from '@ngrx/store';

export const setActiveServer = createAction(
  '[Servers] setActiveServer',
  props<{ ip: string }>()
);

export const setActiveTab = createAction(
  '[Servers] setActiveTab',
  props<{ tab: string }>()
);

export const toggleSidebar = createAction('[Servers] toggleSidebar');

