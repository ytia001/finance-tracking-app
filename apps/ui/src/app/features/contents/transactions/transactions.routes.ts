import { Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { provideState } from '@ngrx/store';
import {
  TRANSACTION_FEATURE_KEY,
  transactionReducer,
} from '../../../core/store/reducers/transactions.reducer';

export const transactionRoutes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    providers: [provideState(TRANSACTION_FEATURE_KEY, transactionReducer)],
  },
];
