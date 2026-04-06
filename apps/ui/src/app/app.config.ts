import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatNativeDateModule } from '@angular/material/core';
import { MainEffects } from './core/store/effects/main.effects';
import { ToastEffects } from './core/store/effects/toast.effects';
import { provideToastr } from 'ngx-toastr';
import { toastrConfig } from './core/constants/Toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideEffects([MainEffects, ToastEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(MatNativeDateModule),
    provideToastr(toastrConfig),
  ],
};
