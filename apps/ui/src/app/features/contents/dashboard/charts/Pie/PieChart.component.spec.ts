import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartComponent } from './PieChart.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { TestHelpers } from '../../../../../test-helpers';
import { Category, CategoryConfigurations } from '../../../../../core/constants/Category';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent],
      providers: [provideCharts(withDefaultRegisterables())],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('parseData', () => {
    it('should return empty dataset when no entries provided', () => {
      component.setData([]);
      expect(component['dataSet'].datasets[0]).toBeUndefined();
    });

    it('should exclude income entries from pie chart', () => {
      const entries = [
        TestHelpers.makeEntry({ category: Category.INCOME, amount: '500' }),
        TestHelpers.makeEntry({ category: Category.FOOD_AND_BEVERAGE, amount: '100' }),
      ];
      const result = component.parseData(entries);
      const labels = result.labels as string[];
      expect(labels).not.toContain(CategoryConfigurations[Category.INCOME].label);
      expect(labels).toContain(CategoryConfigurations[Category.FOOD_AND_BEVERAGE].label);
    });

    it('should group entries by category and sum amounts', () => {
      const entries = [
        TestHelpers.makeEntry({ category: Category.FOOD_AND_BEVERAGE, amount: '40' }),
        TestHelpers.makeEntry({ category: Category.FOOD_AND_BEVERAGE, amount: '60' }),
        TestHelpers.makeEntry({ category: Category.TRANSPORT, amount: '20' }),
      ];
      const result = component.parseData(entries);
      const fnbIndex = (result.labels as string[]).indexOf(
        CategoryConfigurations[Category.FOOD_AND_BEVERAGE].label,
      );
      expect(result.datasets[0].data[fnbIndex]).toBe(100);
    });

    it('should use human-readable category labels from CategoryConfigurations', () => {
      const entries = [TestHelpers.makeEntry({ category: Category.GROCERIES, amount: '50' })];
      const result = component.parseData(entries);
      expect(result.labels).toContain(CategoryConfigurations[Category.GROCERIES].label);
    });

    it('should return empty dataset when all entries are income', () => {
      const entries = [TestHelpers.makeEntry({ category: Category.INCOME, amount: '1000' })];
      const result = component.parseData(entries);
      expect(result.datasets[0].data.length).toBe(0);
    });
  });
});
