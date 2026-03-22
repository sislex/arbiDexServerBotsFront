import {createReducer, on} from '@ngrx/store';
import { API } from '../../models/api';
import {emptyAsyncResponse} from './configs';
import  * as GraphsActions from './graphs.actions';

export const GRAPHS_FEATURE_KEY = 'graphs';

export interface IQuotesCostDataAPI extends API {
  response: IQuotesCostData[];
}

export interface IQuotesCostData {
  id: number;
  chainId: number;
  timestamp: any;
  costBuy: string;
  costSell: string;
  token0Id: number;
  token1Id: number;
}

export interface GraphsState {
  quotesCostData: IQuotesCostDataAPI;
}

export interface ServersPartialState {
  readonly [GRAPHS_FEATURE_KEY]: GraphsState;
}

export const initialState: GraphsState = {
  quotesCostData: emptyAsyncResponse([]),
};


export const graphsReducer = createReducer(
  initialState,
  on(GraphsActions.setQuotesCostData, (state) => ({
      ...state,
      quotesCostData: {
        ...state.quotesCostData,
        startTime:  Date.now(),
        isLoading: true,
        isLoaded: false,
      }
    }
  )),
  on(GraphsActions.setQuotesCostDataSuccess, (state, {response}) => ({
      ...state,
      quotesCostData: {
        ...state.quotesCostData,
        loadingTime: Date.now() - state.quotesCostData.startTime!,
        isLoading: false,
        isLoaded: true,
        response
      }
    }
  )),
  on(GraphsActions.setQuotesCostDataFailure, (state, {error}) => ({
      ...state,
      quotesCostData: {
        ...state.quotesCostData,
        loadingTime: Date.now() - state.quotesCostData.startTime!,
        isLoading: false,
        isLoaded: true,
        error
      }
    }
  )),
  on(GraphsActions.setCurrentQuotesCostData, (state, { data }) => ({
    ...state,
    quotesCostData: {
      ...state.quotesCostData,
      startTime: Date.now(),
      isLoading: false,
      isLoaded: true,
      response: [
        ...(state.quotesCostData.response || []),
        ...data
      ]
    }
  }))

);

