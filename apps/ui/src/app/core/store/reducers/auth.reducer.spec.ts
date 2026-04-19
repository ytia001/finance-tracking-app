import { authReducer, initialState, AuthState } from './auth.reducer';
import { AuthActions } from '../actions/auth.actions';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { TestHelpers } from '../../../test-helpers';

describe('AuthReducer', () => {
  const testUser = TestHelpers.makeUserProfile();

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = { type: 'UNKNOWN' } as Action;
      const state = authReducer(undefined, action);
      expect(state).toBe(initialState);
    });
  });

  describe('login action', () => {
    it('should set loading to true and clear error', () => {
      const state = authReducer(
        initialState,
        AuthActions.login({
          email: 'test@test.com',
          password: 'password123',
        }),
      );
      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });
  });

  describe('loginSuccess action', () => {
    it('should set token, user, and isAuthenticated', () => {
      const state = authReducer(
        initialState,
        AuthActions.loginSuccess({
          token: 'abc123',
          user: testUser,
          successMessage: 'Login successful',
        }),
      );
      expect(state.token).toBe('abc123');
      expect(state.user).toEqual(testUser);
      expect(state.isAuthenticated).toBeTrue();
      expect(state.loading).toBeFalse();
      expect(state.error).toBeNull();
    });
  });

  describe('loginFailure action', () => {
    it('should clear token and user, set error', () => {
      const prevState: AuthState = {
        ...initialState,
        token: 'abc123',
        user: testUser,
        isAuthenticated: true,
      };
      const error = { message: 'Invalid credentials' } as HttpErrorResponse;
      const state = authReducer(
        prevState,
        AuthActions.loginFailure({
          error,
          failureMessage: 'Login failed',
        }),
      );
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBeFalse();
      expect(state.loading).toBeFalse();
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('logout action', () => {
    it('should reset to initial state', () => {
      const prevState: AuthState = {
        ...initialState,
        token: 'abc123',
        user: testUser,
        isAuthenticated: true,
      };
      const state = authReducer(prevState, AuthActions.logout());
      expect(state).toEqual(initialState);
    });
  });
});
