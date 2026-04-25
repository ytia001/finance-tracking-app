import {
  selectAuthToken,
  selectAuthUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from './auth.selector';
import { AuthState } from '../reducers/auth.reducer';

describe('auth selectors', () => {
  const testState: AuthState = {
    token: 'test-token-123',
    user: { id: 1, email: 'test@test.com', firstName: 'Test', lastName: 'User', roles: ['user'] },
    isAuthenticated: true,
    loading: false,
    error: null,
  };

  describe('selectAuthToken', () => {
    it('should return the token', () => {
      expect(selectAuthToken.projector(testState)).toBe('test-token-123');
    });

    it('should return null when no token', () => {
      const state: AuthState = { ...testState, token: null };
      expect(selectAuthToken.projector(state)).toBeNull();
    });
  });

  describe('selectAuthUser', () => {
    it('should return the user', () => {
      expect(selectAuthUser.projector(testState)).toEqual(testState.user);
    });
  });

  describe('selectIsAuthenticated', () => {
    it('should return true when authenticated', () => {
      expect(selectIsAuthenticated.projector(testState)).toBeTrue();
    });

    it('should return false when not authenticated', () => {
      const state: AuthState = { ...testState, isAuthenticated: false };
      expect(selectIsAuthenticated.projector(state)).toBeFalse();
    });
  });

  describe('selectAuthLoading', () => {
    it('should return loading state', () => {
      const state: AuthState = { ...testState, loading: true };
      expect(selectAuthLoading.projector(state)).toBeTrue();
    });
  });

  describe('selectAuthError', () => {
    it('should return error message', () => {
      const state: AuthState = { ...testState, error: 'Some error' };
      expect(selectAuthError.projector(state)).toBe('Some error');
    });
  });
});
