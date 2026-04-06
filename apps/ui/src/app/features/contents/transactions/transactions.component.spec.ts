import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsComponent } from './transactions.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { selectMonthTabs } from '../../../core/store/selectors/transactions.selector';
import { MonthTab } from '../../../models/transaction';
import { TestHelpers } from '../../../test-helpers';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;
  let store: MockStore;
  let mockSelectMonthTabs: MemoizedSelector<object, MonthTab[]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockSelectMonthTabs = store.overrideSelector(selectMonthTabs, []);

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose monthTabs$ from the store', (done) => {
    const tabs = [TestHelpers.createMonthTab({ monthId: '2026-01', label: 'January 2026' })];
    mockSelectMonthTabs.setResult(tabs);
    store.refreshState();

    component.monthTabs$.subscribe((result) => {
      expect(result).toEqual(tabs);
      done();
    });
  });

  describe('netBalanceClass', () => {
    it('should return text-success when netBalance is positive', () => {
      expect(component.netBalanceClass(TestHelpers.createMonthTab({ netBalance: 200 }))).toBe(
        'text-success',
      );
    });

    it('should return text-success when netBalance is exactly zero', () => {
      expect(component.netBalanceClass(TestHelpers.createMonthTab({ netBalance: 0 }))).toBe(
        'text-success',
      );
    });

    it('should return text-danger when netBalance is negative', () => {
      expect(component.netBalanceClass(TestHelpers.createMonthTab({ netBalance: -1 }))).toBe(
        'text-danger',
      );
    });
  });
});
