import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryModalComponent, ViewMode } from './entry-modal.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DataEntryRequest } from './entry-modal-control-service/entry-modal-control.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Category } from '../../../core/constants/Category';

import { MainActions } from '../../../core/store/actions/main.actions';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialReceiptsState } from '../../../core/store/reducers/receipts.reducer';
import {
  selectIsFileUploading,
  selectReceiptError,
} from '../../../core/store/selectors/receipts.selectors';

describe('EntryModalComponent', () => {
  let component: EntryModalComponent;
  let fixture: ComponentFixture<EntryModalComponent>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<EntryModalComponent>>;
  let store: MockStore;

  beforeEach(async () => {
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [EntryModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        provideMockStore({
          initialState: {
            receipts: initialReceiptsState,
          },
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(EntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in select view mode', () => {
    expect(component.viewMode).toBe(ViewMode.MainMenu);
  });

  it('should switch to manual view when selectManual is called', () => {
    component.selectManual();
    expect(component.viewMode).toBe(ViewMode.ManualForm);
  });

  it('should switch to upload_progress view and dispatch uploadReceipt on file selection', () => {
    spyOn(store, 'dispatch');
    const mockFile = new File(['mock content'], 'receipt.jpg', { type: 'image/jpeg' });
    const event = {
      target: {
        files: [mockFile],
      },
    } as unknown as Event;

    component.onFileSelected(event);

    expect(component.viewMode).toBe(ViewMode.UploadingFile);
    expect(store.dispatch).toHaveBeenCalledWith(MainActions.uploadReceipt({ file: mockFile }));
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

  describe('Upload progress view', () => {
    beforeEach(() => {
      fixture.destroy();
      fixture = TestBed.createComponent(EntryModalComponent);
      component = fixture.componentInstance;
      component.viewMode = ViewMode.UploadingFile;
      fixture.detectChanges();
    });

    it('should show spinner and processing text when uploading', () => {
      store.overrideSelector(selectIsFileUploading, true);
      store.refreshState();
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('mat-spinner');
      const text = fixture.nativeElement.querySelector('.progress-text');
      const icon = fixture.nativeElement.querySelector('mat-icon');

      expect(spinner).toBeTruthy();
      expect(text.textContent).toContain('Processing receipt...');
      expect(icon).toBeFalsy();
    });

    it('should show error icon and message when error is present', () => {
      store.overrideSelector(selectIsFileUploading, false);
      store.overrideSelector(selectReceiptError, 'Upload failed');
      store.refreshState();
      fixture.detectChanges();

      const text = fixture.nativeElement.querySelector('.progress-text');
      const spinner = fixture.nativeElement.querySelector('mat-spinner');
      const button = fixture.nativeElement.querySelector('button');

      expect(text.textContent).toContain('Upload failed');
      expect(spinner).toBeFalsy();
      expect(button).toBeTruthy();
      expect(button.textContent).toContain('Back to Main Menu');
    });

    it('should go back to main menu when back action is triggered', () => {
      spyOn(store, 'dispatch');
      component.goBackToMainMenu();

      expect(component.viewMode).toBe(ViewMode.MainMenu);
      expect(store.dispatch).toHaveBeenCalledWith(MainActions.resetReceiptState());
    });
  });
});
