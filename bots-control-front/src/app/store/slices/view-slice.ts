import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_ACTIVE_TAB } from '../constants';

interface ViewState {
  activeTab: string;
}

const initialState: ViewState = {
  activeTab: DEFAULT_ACTIVE_TAB,
};

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = viewSlice.actions;
export const viewReducer = viewSlice.reducer;
