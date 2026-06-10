import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './BarChart.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { TestHelpers } from '../../../../../test-helpers';
import { Category } from '../../../../../core/constants/Category';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
      providers: [provideCharts(withDefaultRegisterables())],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('parseData', () => {
    it('should produce two datasets: Income and Expenses', () => {
      const entries = [
        TestHelpers.createDataEntry({
          category: Category.INCOME,
          amount: '500',
          date: new Date('2026-01-01').getTime(),
        }),
        TestHelpers.createDataEntry({
          category: Category.TRANSPORT,
          amount: '50',
          date: new Date('2026-01-15').getTime(),
        }),
      ];
      const result = component.parseData(entries);
      expect(result.datasets.length).toBe(2);
      expect(result.datasets[0].label).toBe('Income');
      expect(result.datasets[1].label).toBe('Expenses');
    });

    it('should sort month labels chronologically', () => {
      const entries = [
        TestHelpers.createDataEntry({
          category: Category.INCOME,
          amount: '100',
          date: new Date('2026-03-01').getTime(),
        }),
        TestHelpers.createDataEntry({
          category: Category.INCOME,
          amount: '100',
          date: new Date('2026-01-01').getTime(),
        }),
      ];
      const result = component.parseData(entries);
      expect(result.labels).toEqual(['2026-01', '2026-03']);
    });

    it('should sum expenses correctly per month', () => {
      const entries = [
        TestHelpers.createDataEntry({
          category: Category.FOOD_AND_BEVERAGE,
          amount: '30',
          date: new Date('2026-02-01').getTime(),
        }),
        TestHelpers.createDataEntry({
          category: Category.TRANSPORT,
          amount: '20',
          date: new Date('2026-02-15').getTime(),
        }),
      ];
      const result = component.parseData(entries);
      const expenseDataset = result.datasets.find((data) => data.label === 'Expenses')!;
      expect(expenseDataset.data[0]).toBe(50);
    });

    it('should return empty datasets when entries array is empty', () => {
      component.setData([]);
      expect(component['dataSet'].datasets).toEqual([]);
    });
  });
});
