import { Category } from '../../constants/Category';
import { DataEntry } from '../../../models/DataEntry';
import { buildMonthTabs } from './transactions.selector';
import { MonthTab } from '../../../models/transaction';
import { TestHelpers } from '../../../test-helpers';

describe('buildMonthTabs', () => {
  it('should return empty array when given no entries', () => {
    expect(buildMonthTabs([])).toEqual([]);
  });

  it('should return empty array when given null/undefined', () => {
    expect(buildMonthTabs(null as unknown as DataEntry[])).toEqual([]);
  });

  it('should produce one MonthTab for a single entry', () => {
    const entry = TestHelpers.makeEntry({
      id: 1,
      category: Category.GROCERIES,
      amount: '50',
      date: new Date('2026-01-15').getTime(),
    });
    const tabs: MonthTab[] = buildMonthTabs([entry]);

    expect(tabs.length).toBe(1);
    expect(tabs[0].monthId).toBe('2026-01');
    expect(tabs[0].spend).toBe(50);
    expect(tabs[0].income).toBe(0);
    expect(tabs[0].netBalance).toBe(-50);
    expect(tabs[0].dayGroups.length).toBe(1);
    expect(tabs[0].dayGroups[0].dateId).toBe('2026-01-15');
    expect(tabs[0].dayGroups[0].entries.length).toBe(1);
  });

  it('should classify INCOME category entries as income, not spend', () => {
    const entry = TestHelpers.makeEntry({
      id: 1,
      category: Category.INCOME,
      amount: '1000',
      date: new Date('2026-02-01').getTime(),
    });
    const [tab] = buildMonthTabs([entry]);

    expect(tab.income).toBe(1000);
    expect(tab.spend).toBe(0);
    expect(tab.netBalance).toBe(1000);
    expect(tab.dayGroups[0].entries[0].isIncome).toBeTrue();
  });

  it('should group entries in the same month into one tab', () => {
    const entries = [
      TestHelpers.makeEntry({
        id: 1,
        category: Category.GROCERIES,
        amount: '30',
        date: new Date('2026-03-05').getTime(),
      }),
      TestHelpers.makeEntry({
        id: 2,
        category: Category.FOOD_AND_BEVERAGE,
        amount: '20',
        date: new Date('2026-03-10').getTime(),
      }),
    ];
    const tabs = buildMonthTabs(entries);

    expect(tabs.length).toBe(1);
    expect(tabs[0].spend).toBe(50);
    expect(tabs[0].dayGroups.length).toBe(2);
  });

  it('should group entries on the same day into one DayGroup', () => {
    const entries = [
      TestHelpers.makeEntry({
        id: 1,
        category: Category.GROCERIES,
        amount: '30',
        date: new Date('2026-03-10T08:00:00Z').getTime(),
      }),
      TestHelpers.makeEntry({
        id: 2,
        category: Category.FOOD_AND_BEVERAGE,
        amount: '20',
        date: new Date('2026-03-10T18:00:00Z').getTime(),
      }),
    ];
    const [tab] = buildMonthTabs(entries);
    expect(tab.dayGroups.length).toBe(1);
    expect(tab.dayGroups[0].entries.length).toBe(2);
  });

  it('should produce separate tabs for entries in different months, sorted latest first', () => {
    const entries = [
      TestHelpers.makeEntry({
        id: 1,
        category: Category.GROCERIES,
        amount: '10',
        date: new Date('2026-01-01').getTime(),
      }),
      TestHelpers.makeEntry({
        id: 2,
        category: Category.INCOME,
        amount: '500',
        date: new Date('2026-03-01').getTime(),
      }),
    ];
    const tabs = buildMonthTabs(entries);

    expect(tabs.length).toBe(2);
    expect(tabs[0].monthId).toBe('2026-01');
    expect(tabs[1].monthId).toBe('2026-03');
  });

  it('should attach correct categoryIcon to each TransactionEntry', () => {
    const entry = TestHelpers.makeEntry({
      id: 1,
      category: Category.TRANSPORT,
      amount: '15',
      date: new Date('2026-04-20').getTime(),
    });
    const [tab] = buildMonthTabs([entry]);
    expect(tab.dayGroups[0].entries[0].categoryIcon).toBe('commute');
  });
});
