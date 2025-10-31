import {createReducer, on} from '@ngrx/store';
import * as ViewActions from './view.actions';

export const VIEW_FEATURE_KEY = 'view';

export interface ViewState {
}

export interface ViewPartialState {
  readonly [VIEW_FEATURE_KEY]: ViewState;
}

export const initialState: ViewState = {
};

export const viewReducer = createReducer(
  initialState,
);

