import { configureStore } from '@reduxjs/toolkit';
import { serversReducer } from './slices/servers-slice';
import { viewReducer } from './slices/view-slice';

export const store = configureStore({
  reducer: {
    servers: serversReducer,
    view: viewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
