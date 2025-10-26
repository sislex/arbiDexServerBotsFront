import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SERVERS_FEATURE_KEY, ServersState} from './servers.reducer';

export const selectFeature = createFeatureSelector<ServersState>(SERVERS_FEATURE_KEY);

export const getFeatureName = createSelector(
  selectFeature,
  (state: ServersState) => state.featureName
);
export const getIsSidebarOpen = createSelector(
  selectFeature,
  (state: ServersState) => state.environmentData.isSidebarOpen
);
