import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { PieChartComponent } from './charts/Pie/PieChart.component';
import { LineChartComponent } from './charts/Line/LineChart.component';
import { BarChartComponent } from './charts/Bar/BarChart.component';
import { selectDashboardEntries } from '../../../core/store/selectors/dashboard.selector';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    MatExpansionModule,
    MatIconModule,
    PieChartComponent,
    LineChartComponent,
    BarChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly store = inject(Store);

  readonly entries$ = this.store.select(selectDashboardEntries);
}
