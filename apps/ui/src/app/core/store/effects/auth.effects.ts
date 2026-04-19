import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs';
import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { JwtTokenService } from '../../services/jwt-token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { ToastMessages } from '../../constants/Toast';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private jwtService = inject(JwtTokenService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              token: response.accessToken,
              user: response.user,
              successMessage: ToastMessages.AUTH_MESSAGES.LOGIN_SUCCESS,
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              AuthActions.loginFailure({
                error,
                failureMessage: ToastMessages.AUTH_MESSAGES.LOGIN_FAILURE,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, user }) => {
          this.jwtService.setToken(token);
          this.jwtService.setUser(user);
        }),
      ),
    { dispatch: false },
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ data }) =>
        this.authService.register(data).pipe(
          map((response) =>
            AuthActions.registerSuccess({
              id: response.id,
              email: response.email,
              successMessage: ToastMessages.AUTH_MESSAGES.REGISTER_SUCCESS,
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              AuthActions.registerFailure({
                error,
                failureMessage: ToastMessages.AUTH_MESSAGES.REGISTER_FAILURE,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.jwtService.clearToken();
      }),
      map(() =>
        AuthActions.logoutSuccess({
          successMessage: ToastMessages.AUTH_MESSAGES.LOGOUT_SUCCESS,
        }),
      ),
    ),
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      map(() => {
        const token = this.jwtService.getToken();
        const user = this.jwtService.getUser();
        if (token && user) {
          return AuthActions.restoreAuth({ token, user });
        }
        return AuthActions.logout();
      }),
    ),
  );
}
