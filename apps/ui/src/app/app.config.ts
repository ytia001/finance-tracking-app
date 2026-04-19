import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatNativeDateModule } from '@angular/material/core';
import { MainEffects } from './core/store/effects/main.effects';
import { ToastEffects } from './core/store/effects/toast.effects';
import { AuthEffects } from './core/store/effects/auth.effects';
import { provideToastr } from 'ngx-toastr';
import { toastrConfig } from './core/constants/Toast';
import { appReducers } from './core/store/app/app.reducer';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { apiPrefixInterceptor } from './core/interceptors/api-prefix.interceptor';
import { JwtTokenService } from './core/services/jwt-token.service';
import { AuthActions } from './core/store/actions/auth.actions';
import { Store } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiPrefixInterceptor, authInterceptor])),
    provideStore(appReducers),
    provideEffects([MainEffects, ToastEffects, AuthEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(MatNativeDateModule),
    provideToastr(toastrConfig),
    provideAppInitializer(() => {
      const store = inject(Store);
      const jwtService = inject(JwtTokenService);
      if (jwtService.hasToken()) {
        const user = jwtService.getUser();
        const token = jwtService.getToken();
        if (token && user) {
          store.dispatch(AuthActions.restoreAuth({ token, user }));
        }
      }
      return Promise.resolve();
    }),
  ],
};
