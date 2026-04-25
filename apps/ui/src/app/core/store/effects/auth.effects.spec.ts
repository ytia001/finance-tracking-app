import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthEffects } from './auth.effects';
import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials, RegisterCredentials } from '../../../models/auth';
import { JwtTokenService } from '../../services/jwt-token.service';
import { ModalService } from '../../services/modal.service';
import { ToastMessages } from '../../constants/Toast';

describe('AuthEffects', () => {
  let actions$: Observable<Action>;
  let effects: AuthEffects;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let jwtServiceSpy: jasmine.SpyObj<JwtTokenService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    jwtServiceSpy = jasmine.createSpyObj('JwtTokenService', [
      'setToken',
      'setUser',
      'clearToken',
      'getToken',
      'getUser',
      'hasToken',
    ]);
    modalServiceSpy = jasmine.createSpyObj('ModalService', ['closeModal']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: JwtTokenService, useValue: jwtServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  describe('login$', () => {
    it('should dispatch loginSuccess on successful login', (done) => {
      const loginPayload: LoginCredentials = { email: 'test@test.com', password: 'password123' };
      const response = {
        accessToken: 'abc123',
        user: {
          id: 1,
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'User',
          roles: ['user'],
        },
      };
      authServiceSpy.login.and.returnValue(of(response));

      actions$ = of(AuthActions.login(loginPayload));

      effects.login$.subscribe((action) => {
        expect(action).toEqual(
          AuthActions.loginSuccess({
            token: 'abc123',
            user: response.user,
            successMessage: ToastMessages.AUTH_MESSAGES.LOGIN_SUCCESS,
          }),
        );
        done();
      });
    });

    it('should dispatch loginFailure on HTTP error', (done) => {
      const loginPayload = { email: 'test@test.com', password: 'wrong' };
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Invalid credentials' },
        status: 401,
      });
      authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

      actions$ = of(AuthActions.login(loginPayload));

      effects.login$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.loginFailure.type);
        done();
      });
    });
  });

  describe('loginSuccess$', () => {
    it('should store token and user in JwtTokenService', (done) => {
      const token = 'abc123';
      const user = {
        id: 1,
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        roles: ['user'],
      };

      actions$ = of(
        AuthActions.loginSuccess({
          token,
          user,
          successMessage: ToastMessages.AUTH_MESSAGES.LOGIN_SUCCESS,
        }),
      );

      effects.loginSuccess$.subscribe(() => {
        expect(jwtServiceSpy.setToken).toHaveBeenCalledWith(token);
        expect(jwtServiceSpy.setUser).toHaveBeenCalledWith(user);
        done();
      });
    });
  });

  describe('register$', () => {
    it('should dispatch registerSuccess on successful registration', (done) => {
      const registerData: RegisterCredentials = {
        email: 'new@test.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };
      const response = { id: 2, email: 'new@test.com' };
      authServiceSpy.register.and.returnValue(of(response));

      actions$ = of(AuthActions.register({ data: registerData }));

      effects.register$.subscribe((action) => {
        expect(action).toEqual(
          AuthActions.registerSuccess({
            id: 2,
            email: 'new@test.com',
            successMessage: ToastMessages.AUTH_MESSAGES.REGISTER_SUCCESS,
          }),
        );
        done();
      });
    });

    it('should dispatch registerFailure on HTTP error', (done) => {
      const registerData: RegisterCredentials = {
        email: 'existing@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Email already exists' },
        status: 409,
      });
      authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

      actions$ = of(AuthActions.register({ data: registerData }));

      effects.register$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.registerFailure.type);
        done();
      });
    });
  });

  describe('registerSuccess$', () => {
    it('should close modal on successful registration', (done) => {
      actions$ = of(
        AuthActions.registerSuccess({
          id: 2,
          email: 'new@test.com',
          successMessage: ToastMessages.AUTH_MESSAGES.REGISTER_SUCCESS,
        }),
      );

      effects.registerSuccess$.subscribe(() => {
        expect(modalServiceSpy.closeModal).toHaveBeenCalledWith(true);
        done();
      });
    });
  });

  describe('logout$', () => {
    it('should clear token in JwtTokenService and dispatch logoutSuccess', (done) => {
      actions$ = of(AuthActions.logout());

      effects.logout$.subscribe((action) => {
        expect(jwtServiceSpy.clearToken).toHaveBeenCalled();
        expect(action).toEqual(
          AuthActions.logoutSuccess({ successMessage: ToastMessages.AUTH_MESSAGES.LOGOUT_SUCCESS }),
        );
        done();
      });
    });
  });

  describe('checkAuth$', () => {
    it('should dispatch restoreAuth when token and user exist', () => {
      jwtServiceSpy.hasToken.and.returnValue(true);
      jwtServiceSpy.getToken.and.returnValue('abc123');
      jwtServiceSpy.getUser.and.returnValue({
        id: 1,
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        roles: ['user'],
      });

      actions$ = of(AuthActions.checkAuth());

      effects.checkAuth$.subscribe((action) => {
        expect(action).toEqual(
          AuthActions.restoreAuth({
            token: 'abc123',
            user: {
              id: 1,
              email: 'test@test.com',
              firstName: 'Test',
              lastName: 'User',
              roles: ['user'],
            },
          }),
        );
      });
    });

    it('should dispatch logout when no token exists', () => {
      jwtServiceSpy.hasToken.and.returnValue(false);

      actions$ = of(AuthActions.checkAuth());

      effects.checkAuth$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.logout.type);
      });
    });
  });
});
