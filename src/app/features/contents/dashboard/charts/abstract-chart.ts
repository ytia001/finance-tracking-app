import { ChartData, ChartType } from 'chart.js';
import { DataEntry } from '../../../../models/DataEntry';

export abstract class AbstractChartComponent<T extends ChartType> {
  protected dataSet: ChartData<T> = { labels: [], datasets: [] };

  // Transform raw DataEntry array into chart-ready data.
  abstract parseData(entries: DataEntry[]): ChartData<T>;

  public setData(entries: DataEntry[]): void {
    this.dataSet = entries?.length ? this.parseData(entries) : { labels: [], datasets: [] };
  }
}
