import { createReducer, on, Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';
import { UserProfile } from '../../../models/auth';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authReducerInternal = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: error.message,
  })),
  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message,
  })),
  on(AuthActions.logout, () => initialState),
  on(AuthActions.restoreAuth, (state, { token, user }) => ({
    ...state,
    token,
    user,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return authReducerInternal(state, action);
}
