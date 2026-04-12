import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthEffects } from './auth.effects';
import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { ToastMessages } from '../../constants/Toast';
import { LoginCredentials } from '../../../models/auth';

describe('AuthEffects', () => {
  let actions$: Observable<Action>;
  let effects: AuthEffects;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  describe('login$', () => {
    it('should dispatch loginSuccess on successful login', (done) => {
      const loginPayload: LoginCredentials = { email: 'test@test.com', password: 'password123' };
      const response = {
        accessToken: 'abc123',
        user: { userId: 1, email: 'test@test.com', roles: ['user'] },
      };
      authServiceSpy.login.and.returnValue(of(response));

      actions$ = of(AuthActions.login(loginPayload));

      effects.login$.subscribe((action) => {
        expect(action).toEqual(
          AuthActions.loginSuccess({
            token: 'abc123',
            user: response.user,
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
});
