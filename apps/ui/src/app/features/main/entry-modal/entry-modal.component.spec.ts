import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryModalComponent } from './entry-modal.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DataEntryRequest } from './entry-modal-control-service/entry-modal-control.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Category } from '../../../core/constants/Category';

describe('EntryModalComponent', () => {
  let component: EntryModalComponent;
  let fixture: ComponentFixture<EntryModalComponent>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<EntryModalComponent>>;

  beforeEach(async () => {
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [EntryModalComponent],
      providers: [{ provide: MatDialogRef, useValue: matDialogRefSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialogRef.close() when closeDialog is called', () => {
    component.closeDialog();
    expect(matDialogRefSpy.close).toHaveBeenCalledWith(null);
  });

  it('should call dialogRef.close() with data when saveDialog is called', () => {
    component.entryFormGroup = new FormGroup({
      category: new FormControl(Category.INCOME),
      amount: new FormControl(100),
      date: new FormControl(new Date('2024-01-01')),
    });

    fixture.detectChanges();

    component.saveDialog();

    expect(matDialogRefSpy.close).toHaveBeenCalledWith({
      category: Category.INCOME,
      amount: 100,
      date: new Date('2024-01-01'),
    } as DataEntryRequest);
  });
});
