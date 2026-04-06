import { TestBed } from '@angular/core/testing';
import { EntryModalControlService } from './entry-modal-control.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../../core/constants/Category';

describe('EntryModalControlService', () => {
  let service: EntryModalControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [EntryModalControlService],
    });
    service = TestBed.inject(EntryModalControlService);
  });

  describe('toFormGroup', () => {
    it('should create a form group with default values', () => {
      const form = service.toFormGroup();

      expect(form.controls.category.value).toBe(Category.INCOME);
      expect(form.controls.amount.value).toBe(0);
      expect(form.controls.date.value).toBeInstanceOf(Date);
    });

    it('should have invalid status initially due to amount validator (min 0.01)', () => {
      const form = service.toFormGroup();
      expect(form.valid).toBeFalse();
      expect(form.controls.amount.errors?.['min']).toBeTruthy();
    });

    it('should be valid when correct values are provided', () => {
      const form = service.toFormGroup();
      form.patchValue({
        amount: 50.5,
        category: Category.GROCERIES,
      });
      expect(form.valid).toBeTrue();
    });
  });

  describe('toRequestPayload', () => {
    it('should map form values correctly to a DataEntryRequest object', () => {
      const form = service.toFormGroup();
      const testDate = new Date(2026, 0, 2); // Jan 2, 2026

      form.patchValue({
        category: Category.FOOD_AND_BEVERAGE,
        amount: 25.0,
        date: testDate,
      });

      const payload = service.toRequestPayload(form);

      expect(payload.category).toBe(Category.FOOD_AND_BEVERAGE);
      expect(payload.amount).toBe(25.0);
      expect(payload.date).toEqual(testDate);
    });
  });
});
