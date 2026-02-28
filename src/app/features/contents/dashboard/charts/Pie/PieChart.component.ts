import { Component, Input, OnChanges } from '@angular/core';
import { AbstractChartComponent } from '../abstract-chart';
import { Category, CategoryConfigurations } from '../../../../../core/constants/Category';
import { DataEntry } from '../../../../../models/DataEntry';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import chroma from 'chroma-js';

@Component({
  selector: 'app-pie-chart',
  imports: [BaseChartDirective],
  templateUrl: './PieChart.component.html',
  styleUrl: './PieChart.component.scss',
})
export class PieChartComponent extends AbstractChartComponent<'pie'> implements OnChanges {
  @Input() entries: DataEntry[] = [];

  readonly chartType = 'pie' as const;

  ngOnChanges(): void {
    this.setData(this.entries);
  }

  // Spending breakdown by category — income entries are excluded.
  override parseData(entries: DataEntry[]): ChartData<'pie'> {
    const spendMap = new Map<Category, number>();

    entries
      .filter((entry) => entry.category !== Category.INCOME)
      .forEach((entry) => {
        const value = Number(entry.amount);
        spendMap.set(entry.category, (spendMap.get(entry.category) || 0) + value);
      });

    const categories = Array.from(spendMap.keys());
    const values = Array.from(spendMap.values());
    const labels = categories.map((cat) => CategoryConfigurations[cat]?.label ?? cat);
    const backgroundColors = chroma
      .scale(['#FF6384', '#FFCE56', '#36A2EB', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'])
      .colors(categories.length);

    return {
      labels,
      datasets: [{ data: values, backgroundColor: backgroundColors, hoverOffset: 6 }],
    };
  }

  get pieChartOptions(): ChartOptions<'pie'> {
    return {
      responsive: true,
      animation: { duration: 1000, easing: 'easeOutQuart' },
      plugins: {
        legend: { position: 'right' },
        tooltip: {
          callbacks: {
            label: (ctx) => ` $${(ctx.parsed as number).toFixed(2)}`,
          },
        },
      },
      cutout: '55%',
    };
  }
}
