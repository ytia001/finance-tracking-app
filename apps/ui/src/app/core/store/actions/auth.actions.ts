import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { LoginCredentials, UserProfile } from '../../../models/auth';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<LoginCredentials>(),
    'Login success': props<{ token: string; user: UserProfile }>(),
    'Login failure': props<{ error: HttpErrorResponse; failureMessage: string }>(),
    Logout: emptyProps(),
  },
});
