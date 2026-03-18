import {createFeatureSelector, createSelector} from '@ngrx/store';
import {GRAPHS_FEATURE_KEY, GraphsState,} from './graphs.reducer';

export const selectFeature = createFeatureSelector<GraphsState>(GRAPHS_FEATURE_KEY);
export const getQuotesCostData = createSelector(
  selectFeature,
  (state: GraphsState) => state.quotesCostData.response
);
