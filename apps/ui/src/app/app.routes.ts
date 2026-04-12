import { Routes } from '@angular/router';
import { MainComponent } from './features/main/main.component';
import { BreakdownComponent } from './features/contents/breakdown/breakdown.component';
import { ConfigurationComponent } from './features/contents/configuration/configuration.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      //Lazy feature store
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/contents/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('./features/contents/transactions/transactions.routes').then(
            (m) => m.transactionRoutes,
          ),
      },

      // TODO: determine if lazy feature store better or normal convention
      { path: 'breakdown', component: BreakdownComponent },
      { path: 'configuration', component: ConfigurationComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
