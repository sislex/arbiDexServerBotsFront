import type { AsyncState } from './types';

export function createAsyncState<T>(data: T): AsyncState<T> {
  return {
    data,
    isLoading: false,
    isLoaded: false,
    error: null,
  };
}
