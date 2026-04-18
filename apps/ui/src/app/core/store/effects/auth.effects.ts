import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';
import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { ToastMessages } from '../../constants/Toast';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              token: response.accessToken,
              user: response.user,
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

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ data }) =>
        this.authService.register(data).pipe(
          map((response) =>
            AuthActions.registerSuccess({
              id: response.id,
              email: response.email,
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
}
