import { createAction, props } from '@ngrx/store';

export const toggleSidebar = createAction('[View] toggleSidebar');

export const setActiveTab = createAction(
  '[View] setActiveTab',
  props<{ tab: string }>()
);

export const setServersData = createAction('[DbConfig] setServersData');
export const setServersDataSuccess = createAction(
  '[DbConfig] setServersDataSuccess',
  props<{ response: any }>()
);
export const setServersDataFailure = createAction(
  '[DbConfig] setServersDataFailure',
  props<{ error: string }>()
);

