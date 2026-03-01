import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DASHBOARD_FEATURE_KEY, DashboardState } from '../reducers/dashboard.reducer';
import { TRANSACTION_FEATURE_KEY, TransactionState } from '../reducers/transactions.reducer';

export const selectDashboardState = createFeatureSelector<DashboardState>(DASHBOARD_FEATURE_KEY);
export const selectTransactionStateForDashboard =
  createFeatureSelector<TransactionState>(TRANSACTION_FEATURE_KEY);

export const selectLoading = createSelector(selectDashboardState, (state) => state.loading);

export const selectDashboardEntries = createSelector(
  selectTransactionStateForDashboard,
  (state) => state.entries ?? [],
);
