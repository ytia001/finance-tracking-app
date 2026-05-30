import { Component, inject } from '@angular/core';
import { AbstractModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  DataEntryRequest,
  EntryModalControlService,
} from './entry-modal-control-service/entry-modal-control.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectOption } from '../../../models/MaterialModels';
import { CategoryConfigurations } from '../../../core/constants/Category';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MainActions } from '../../../core/store/actions/main.actions';
import {
  selectIsFileUploading,
  selectReceiptError,
} from '../../../core/store/selectors/receipts.selectors';

export enum ViewMode {
  MainMenu = 'MainMenu',
  ManualForm = 'ManualForm',
  UploadingFile = 'UploadingFile',
}

@Component({
  selector: 'app-entry-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  providers: [],
  templateUrl: './entry-modal.component.html',
  styleUrl: './entry-modal.component.scss',
})
export class EntryModalComponent extends AbstractModalDialogComponent {
  ViewMode = ViewMode;

  private dialogRef = inject(MatDialogRef<EntryModalComponent, DataEntryRequest | null>);
  private entryModalControlService = inject(EntryModalControlService);
  private store = inject(Store);

  viewMode: ViewMode = ViewMode.MainMenu;

  entryFormGroup: FormGroup = this.entryModalControlService.toFormGroup();
  isUploading$ = this.store.select(selectIsFileUploading);
  error$ = this.store.select(selectReceiptError);

  get categoryOptions(): MatSelectOption[] {
    return Object.entries(CategoryConfigurations).map(([value, config]) => ({
      value,
      label: config.label,
    }));
  }

  selectManual(): void {
    this.viewMode = ViewMode.ManualForm;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.viewMode = ViewMode.UploadingFile;
      this.store.dispatch(MainActions.uploadReceipt({ file }));
    }
  }

  goBackToMainMenu(): void {
    this.viewMode = ViewMode.MainMenu;
    this.store.dispatch(MainActions.resetReceiptState());
  }

  override closeDialog(): void {
    this.dialogRef.close(null);
  }

  override saveDialog(): void {
    this.dialogRef.close(this.entryModalControlService.toRequestPayload(this.entryFormGroup));
  }
}
