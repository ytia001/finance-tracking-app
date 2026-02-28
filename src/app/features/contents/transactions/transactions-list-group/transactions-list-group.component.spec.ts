import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Category } from '../../../../core/constants/Category';
import { TransactionsListGroupComponent } from './transactions-list-group.component';
import { TestHelpers } from '../../../../test-helpers';

describe('TransactionsListGroupComponent', () => {
  let component: TransactionsListGroupComponent;
  let fixture: ComponentFixture<TransactionsListGroupComponent>;

  const mockDayGroup = TestHelpers.createDayGroup({
    entries: [
      TestHelpers.createTransactionEntry(),
      TestHelpers.createTransactionEntry({ id: 2, category: Category.INCOME, isIncome: true }),
    ],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsListGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsListGroupComponent);
    component = fixture.componentInstance;
    component.dayGroup = mockDayGroup;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onEntryClick', () => {
    it('should emit entryClicked with the given entry', () => {
      const emitSpy = spyOn(component.entryClicked, 'emit');
      const entry = TestHelpers.createTransactionEntry();

      component.onEntryClick(entry);

      expect(emitSpy).toHaveBeenCalledOnceWith(entry);
    });

    it('should emit the exact entry object passed', () => {
      const incomeEntry = TestHelpers.createTransactionEntry({
        id: 2,
        category: Category.INCOME,
        isIncome: true,
        amount: 1000,
      });
      const emitSpy = spyOn(component.entryClicked, 'emit');

      component.onEntryClick(incomeEntry);

      expect(emitSpy).toHaveBeenCalledWith(incomeEntry);
    });

    it('should emit once per call', () => {
      const emitSpy = spyOn(component.entryClicked, 'emit');

      component.onEntryClick(TestHelpers.createTransactionEntry());
      component.onEntryClick(TestHelpers.createTransactionEntry({ id: 2 }));

      expect(emitSpy).toHaveBeenCalledTimes(2);
    });
  });
});
