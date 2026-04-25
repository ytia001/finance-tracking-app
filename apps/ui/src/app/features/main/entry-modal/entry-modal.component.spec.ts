import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryModalComponent } from './entry-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../core/constants/Category';

describe('EntryModalComponent', () => {
  let component: EntryModalComponent;
  let fixture: ComponentFixture<EntryModalComponent>;
  let closeFnSpy: jasmine.Spy;

  beforeEach(async () => {
    closeFnSpy = jasmine.createSpy('closeFn');

    await TestBed.configureTestingModule({
      imports: [EntryModalComponent, ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryModalComponent);
    component = fixture.componentInstance;
    component.closeFn = closeFnSpy;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call closeFn with null when closeDialog is called', () => {
    component.closeDialog();
    expect(closeFnSpy).toHaveBeenCalledWith(null);
  });

  it('should have a valid form when required fields are filled', () => {
    component.entryFormGroup.patchValue({
      category: Category.INCOME,
      amount: 100,
      date: new Date('2024-01-01'),
    });
    expect(component.entryFormGroup.valid).toBeTrue();
  });
});
