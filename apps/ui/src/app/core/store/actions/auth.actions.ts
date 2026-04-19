import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { LoginCredentials, RegisterCredentials, UserProfile } from '../../../models/auth';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<LoginCredentials>(),
    'Login success': props<{ token: string; user: UserProfile; successMessage: string }>(),
    'Login failure': props<{ error: HttpErrorResponse; failureMessage: string }>(),
    Register: props<{ data: RegisterCredentials }>(),
    'Register success': props<{ id: number; email: string; successMessage: string }>(),
    'Register failure': props<{ error: HttpErrorResponse; failureMessage: string }>(),
    Logout: emptyProps(),
    'Logout success': props<{ successMessage: string }>(),
    'Check Auth': emptyProps(),
    'Restore Auth': props<{ token: string; user: UserProfile }>(),
  },
});
