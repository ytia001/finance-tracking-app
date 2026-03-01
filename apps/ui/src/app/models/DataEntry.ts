import { Category } from '../core/constants/Category';

export interface DataEntry {
  id: number;
  amount: string;
  date: number;
  category: Category;
}
