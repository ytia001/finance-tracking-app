import { createReducer } from '@ngrx/store';

export const APP_FEATURE_KEY = 'app';

export interface AppState {
  count: number;
}

export const initialState: AppState = {
  count: 0,
};

export const appReducer = createReducer(initialState);
