import { selectDashboardEntries, selectLoading } from './dashboard.selector';
import { TestHelpers } from '../../../test-helpers';
import { Category } from '../../constants/Category';
import { DashboardState } from '../reducers/dashboard.reducer';
import { TransactionState } from '../reducers/transactions.reducer';

describe('dashboard selectors', () => {
  describe('selectLoading', () => {
    it('should return true when state.loading is true', () => {
      const state: DashboardState = { loading: true };
      expect(selectLoading.projector(state)).toBeTrue();
    });

    it('should return false when state.loading is false', () => {
      const state: DashboardState = { loading: false };
      expect(selectLoading.projector(state)).toBeFalse();
    });
  });

  describe('selectDashboardEntries', () => {
    it('should return the entries array from transaction state', () => {
      const entries = [
        TestHelpers.createDataEntry({ id: 1, category: Category.INCOME, amount: '500' }),
        TestHelpers.createDataEntry({ id: 2, category: Category.FOOD_AND_BEVERAGE, amount: '80' }),
      ];
      const state: TransactionState = { loading: false, entries };
      expect(selectDashboardEntries.projector(state)).toEqual(entries);
    });

    it('should return an empty array when entries is empty', () => {
      const state: TransactionState = { loading: false, entries: [] };
      expect(selectDashboardEntries.projector(state)).toEqual([]);
    });
  });
});
