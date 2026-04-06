import { Category } from './core/constants/Category';
import { DataEntry } from './models/DataEntry';
import { DataEntryRequest } from './features/main/entry-modal/entry-modal-control-service/entry-modal-control.service';
import { DayGroup, MonthTab, TransactionEntry } from './models/transaction';

export class TestHelpers {
  static createDateEntryRequest(props?: Partial<DataEntryRequest>): DataEntryRequest {
    return {
      category: Category.INCOME,
      amount: 100,
      date: new Date(),
      ...props,
    };
  }

  static makeEntry(props: Partial<DataEntry> = {}): DataEntry {
    return {
      id: 1,
      category: Category.OTHERS,
      amount: '0',
      date: new Date('2026-01-01').getTime(),
      ...props,
    };
  }

  static createMonthTab(props: Partial<MonthTab> = {}): MonthTab {
    return {
      monthId: '2026-02',
      label: 'February 2026',
      income: 0,
      spend: 0,
      netBalance: 0,
      dayGroups: [],
      ...props,
    };
  }

  static createTransactionEntry(props: Partial<TransactionEntry> = {}): TransactionEntry {
    return {
      id: 1,
      category: Category.GROCERIES,
      categoryLabel: 'Groceries',
      categoryIcon: 'shopping_cart',
      amount: 50,
      date: new Date('2026-01-15'),
      isIncome: false,
      ...props,
    };
  }

  static createDayGroup(props: Partial<DayGroup> = {}): DayGroup {
    return {
      dateId: '2026-01-15',
      entries: [],
      ...props,
    };
  }
}
