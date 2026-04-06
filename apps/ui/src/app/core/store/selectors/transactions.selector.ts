import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TRANSACTION_FEATURE_KEY, TransactionState } from '../reducers/transactions.reducer';
import { DataEntry } from '../../../models/DataEntry';
import { Category, CategoryConfigurations } from '../../constants/Category';
import { DayGroup, MonthTab, TransactionEntry } from '../../../models/transaction';
import { DateTimeUtil } from '../../utils/date-id.util';

// Interface used internally to keep track of accumulated data for each month to build MonthTabs
interface MonthAccumulator {
  income: number;
  spend: number;

  // sort by date for entries in the same month, latest → oldest
  dayOrder: string[];

  // Map of dateId → entries for that day, for entries in the same month
  dayMap: Map<string, TransactionEntry[]>;
}

export const selectTransactionState =
  createFeatureSelector<TransactionState>(TRANSACTION_FEATURE_KEY);

export const selectLoading = createSelector(selectTransactionState, (state) => state.loading);

export const selectMonthTabs = createSelector(selectTransactionState, (state) =>
  buildMonthTabs(state.entries),
);

export const buildMonthTabs = (entries: DataEntry[]): MonthTab[] => {
  if (!entries?.length) return [];

  // Sort All entries latest → oldest up front
  // Sorted Entries: 1. Latest month 2. Latest day (for same month)
  const sorted = [...entries].sort((a, b) => b.date - a.date);

  const monthOrder: string[] = [];
  const monthMap = new Map<string, MonthAccumulator>();

  sorted.forEach((entry) => {
    // Retrieve the required information from the entry
    const dateObj = new Date(entry.date);
    const amount = Number(entry.amount);
    const isIncome = entry.category === Category.INCOME;

    // Retrieve the monthId and dateId as key for monthMap and dayMap respectively
    const monthId: string = DateTimeUtil.toMonthId(dateObj);
    const dateId: string = DateTimeUtil.toDateId(dateObj);

    if (!monthMap.has(monthId)) {
      monthMap.set(monthId, { income: 0, spend: 0, dayOrder: [], dayMap: new Map() });
      monthOrder.push(monthId);
    }

    const month = monthMap.get(monthId)!;
    if (isIncome) {
      month.income += amount;
    } else {
      month.spend += amount;
    }

    if (!month.dayMap.has(dateId)) {
      month.dayMap.set(dateId, []);
      month.dayOrder.push(dateId);
    }

    month.dayMap.get(dateId)!.push({
      id: entry.id,
      category: entry.category,
      categoryLabel: CategoryConfigurations[entry.category]?.label ?? entry.category,
      categoryIcon: CategoryConfigurations[entry.category]?.icon ?? 'category',
      amount,
      date: dateObj,
      isIncome,
    } as TransactionEntry);
  });

  // reverse monthOrder to ensure earliest month is first
  return monthOrder.reverse().map((monthId) => {
    const { income, spend, dayOrder, dayMap } = monthMap.get(monthId)!;
    const [year, month] = monthId.split('-').map(Number);
    const label = new Date(year, month - 1, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    const dayGroups: DayGroup[] = dayOrder.map((dateId) => ({
      dateId,
      entries: dayMap.get(dateId)!,
    }));

    return { monthId, label, income, spend, netBalance: income - spend, dayGroups };
  });
};
