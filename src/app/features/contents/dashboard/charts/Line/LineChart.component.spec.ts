import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChartComponent } from './LineChart.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { TestHelpers } from '../../../../../test-helpers';
import { Category } from '../../../../../core/constants/Category';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
      providers: [provideCharts(withDefaultRegisterables())],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('parseData', () => {
    it('should produce two datasets: Income and Expenses', () => {
      const entries = [
        TestHelpers.makeEntry({
          category: Category.INCOME,
          amount: '300',
          date: new Date('2026-01-15').getTime(),
        }),
        TestHelpers.makeEntry({
          category: Category.FOOD_AND_BEVERAGE,
          amount: '100',
          date: new Date('2026-01-20').getTime(),
        }),
      ];
      const result = component.parseData(entries);
      expect(result.datasets.length).toBe(2);
      expect(result.datasets[0].label).toBe('Income');
      expect(result.datasets[1].label).toBe('Expenses');
    });

    it('should sort labels chronologically oldest to newest', () => {
      const entries = [
        TestHelpers.makeEntry({
          category: Category.INCOME,
          amount: '100',
          date: new Date('2026-03-01').getTime(),
        }),
        TestHelpers.makeEntry({
          category: Category.INCOME,
          amount: '200',
          date: new Date('2026-01-01').getTime(),
        }),
        TestHelpers.makeEntry({
          category: Category.INCOME,
          amount: '150',
          date: new Date('2026-02-01').getTime(),
        }),
      ];
      const result = component.parseData(entries);
      expect(result.labels).toEqual(['2026-01', '2026-02', '2026-03']);
    });

    it('should fill 0 for months that have no income', () => {
      const entries = [
        TestHelpers.makeEntry({
          category: Category.FOOD_AND_BEVERAGE,
          amount: '80',
          date: new Date('2026-01-01').getTime(),
        }),
      ];
      const result = component.parseData(entries);
      const incomeDataset = result.datasets.find((d) => d.label === 'Income')!;
      expect(incomeDataset.data[0]).toBe(0);
    });

    it('should aggregate multiple entries within the same month', () => {
      const entries = [
        TestHelpers.makeEntry({
          category: Category.INCOME,
          amount: '200',
          date: new Date('2026-02-05').getTime(),
        }),
        TestHelpers.makeEntry({
          category: Category.INCOME,
          amount: '300',
          date: new Date('2026-02-20').getTime(),
        }),
      ];
      const result = component.parseData(entries);
      const incomeDataset = result.datasets.find((d) => d.label === 'Income')!;
      expect(incomeDataset.data[0]).toBe(500);
    });
  });
});
