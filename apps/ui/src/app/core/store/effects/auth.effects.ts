import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';
import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../../models/auth';
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
                failureMessage: error.error?.message || ToastMessages.AUTH_MESSAGES.LOGIN_FAILURE,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
