import { createAction, props } from '@ngrx/store';

export const getGraphs = createAction('[Graphs] getGraphs');
export const setQuotesCostData = createAction('[Graphs] setQuotesCostData');
export const setQuotesCostDataSuccess = createAction(
  '[Graphs] setQuotesCostDataSuccess',
  props<{ response: any }>()
);
export const setQuotesCostDataFailure = createAction(
  '[Graphs] setQuotesCostDataFailure',
  props<{ error: any }>()
);
export const setCurrentQuotesCostData = createAction(
  '[Graphs] setCurrentQuotesCostData',
  props<{ data: any }>()
);
