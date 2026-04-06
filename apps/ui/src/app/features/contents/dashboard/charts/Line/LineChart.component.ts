import { Component, Input, OnChanges } from '@angular/core';
import { AbstractChartComponent } from '../abstract-chart';
import { Category } from '../../../../../core/constants/Category';
import { DataEntry } from '../../../../../models/DataEntry';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DateTimeUtil } from '../../../../../core/utils/date-id.util';

@Component({
  selector: 'app-line-chart',
  imports: [BaseChartDirective],
  templateUrl: './LineChart.component.html',
  styleUrl: './LineChart.component.scss',
})
export class LineChartComponent extends AbstractChartComponent<'line'> implements OnChanges {
  @Input() entries: DataEntry[] = [];

  readonly chartType = 'line' as const;

  ngOnChanges(): void {
    this.setData(this.entries);
  }

  /**
   * Builds two time-series lines (income vs expenses) grouped by month.
   * Labels are sorted chronologically oldest → newest.
   */
  override parseData(entries: DataEntry[]): ChartData<'line'> {
    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();

    entries.forEach((entry) => {
      const monthId = DateTimeUtil.toMonthId(entry.date);
      const amount = Number(entry.amount);
      if (entry.category === Category.INCOME) {
        incomeMap.set(monthId, (incomeMap.get(monthId) || 0) + amount);
      } else {
        expenseMap.set(monthId, (expenseMap.get(monthId) || 0) + amount);
      }
    });

    const allMonths = Array.from(new Set([...incomeMap.keys(), ...expenseMap.keys()])).sort();
    const incomeByMonths = allMonths.map((month) => incomeMap.get(month) ?? 0);
    const expenseByMonths = allMonths.map((month) => expenseMap.get(month) ?? 0);

    return {
      labels: allMonths,
      datasets: [
        {
          label: 'Income',
          data: incomeByMonths,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
        },
        {
          label: 'Expenses',
          data: expenseByMonths,
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
        },
      ],
    };
  }

  get chartOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      animation: { duration: 1000, easing: 'easeOutQuart' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: $${(ctx.parsed.y as number).toFixed(2)}`,
          },
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: (v) => `$${v}` } },
      },
    };
  }
}
