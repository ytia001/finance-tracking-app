import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { DashboardComponent } from './dashboard.component';
import {
  DASHBOARD_FEATURE_KEY,
  dashboardReducer,
} from '../../../core/store/reducers/dashboard.reducer';
import {
  TRANSACTION_FEATURE_KEY,
  transactionReducer,
} from '../../../core/store/reducers/transactions.reducer';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    providers: [
      provideState(DASHBOARD_FEATURE_KEY, dashboardReducer),
      provideState(TRANSACTION_FEATURE_KEY, transactionReducer),
    ],
  },
];
