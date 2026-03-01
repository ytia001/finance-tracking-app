import { createReducer } from '@ngrx/store';

export const DASHBOARD_FEATURE_KEY = 'dashboard';

export interface DashboardState {
  loading: boolean;
}

export const initialState: DashboardState = {
  loading: false,
};

export const dashboardReducer = createReducer(initialState);
