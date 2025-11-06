import { createAction, props } from '@ngrx/store';

export const toggleSidebar = createAction('[View] toggleSidebar');

export const setActiveTab = createAction(
  '[View] setActiveTab',
  props<{ tab: string }>()
);
