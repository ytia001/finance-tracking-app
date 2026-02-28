import { Category } from '../core/constants/Category';

export interface TransactionEntry {
  id: number;
  category: Category;
  categoryLabel: string;
  categoryIcon: string;
  amount: number;
  date: Date;
  isIncome: boolean;
}

export interface DayGroup {
  /** ISO date string e.g. "2026-02-28" */
  dateId: string;
  /** Entries sorted latest → oldest */
  entries: TransactionEntry[];
}

export interface MonthTab {
  /** e.g. "2026-02" */
  monthId: string;
  /** e.g. "February 2026" */
  label: string;
  income: number;
  spend: number;
  /** income - spend */
  netBalance: number;
  /** Day groups sorted latest → oldest */
  dayGroups: DayGroup[];
}
