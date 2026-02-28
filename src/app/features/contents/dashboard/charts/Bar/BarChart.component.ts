import { Component, Input, OnChanges } from '@angular/core';
import { AbstractChartComponent } from '../abstract-chart';
import { Category } from '../../../../../core/constants/Category';
import { DataEntry } from '../../../../../models/DataEntry';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DateTimeUtil } from '../../../../../core/utils/date-id.util';

@Component({
  selector: 'app-bar-chart',
  imports: [BaseChartDirective],
  templateUrl: './BarChart.component.html',
  styleUrl: './BarChart.component.scss',
})
export class BarChartComponent extends AbstractChartComponent<'bar'> implements OnChanges {
  @Input() entries: DataEntry[] = [];

  readonly chartType = 'bar' as const;

  ngOnChanges(): void {
    this.setData(this.entries);
  }

  /**
   * Monthly grouped bar chart showing income and expenses side-by-side.
   * Labels are sorted chronologically oldest → newest.
   */
  override parseData(entries: DataEntry[]): ChartData<'bar'> {
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
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: '#4CAF50',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Expenses',
          data: expenseByMonths,
          backgroundColor: 'rgba(244, 67, 54, 0.7)',
          borderColor: '#F44336',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }

  get chartOptions(): ChartOptions<'bar'> {
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
