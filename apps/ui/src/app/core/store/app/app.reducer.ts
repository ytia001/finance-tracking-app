import { ActionReducerMap } from '@ngrx/store';
import { AUTH_FEATURE_KEY, authReducer, AuthState } from '../reducers/auth.reducer';
import { RECEIPTS_FEATURE_KEY, receiptsReducer, ReceiptsState } from '../reducers/receipts.reducer';

/**
 * Root application store — collects all global reducers.
 * These are registered once at app bootstrap via provideStore().
 * Feature-level reducers (dashboard, transactions) are loaded per-route via provideState().
 */
export interface AppState {
  [AUTH_FEATURE_KEY]: AuthState;
  [RECEIPTS_FEATURE_KEY]: ReceiptsState;
}

export const appReducers: ActionReducerMap<AppState> = {
  [AUTH_FEATURE_KEY]: authReducer,
  [RECEIPTS_FEATURE_KEY]: receiptsReducer,
};
