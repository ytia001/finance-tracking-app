import { Component, inject } from '@angular/core';
import { AbstractModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EntryModalControlService } from './entry-modal-control-service/entry-modal-control.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectOption } from '../../../models/MaterialModels';
import { CategoryConfigurations } from '../../../core/constants/Category';

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
  ],
  providers: [],
  templateUrl: './entry-modal.component.html',
  styleUrl: './entry-modal.component.scss',
})
export class EntryModalComponent extends AbstractModalDialogComponent {
  private matdialogRef = inject(MatDialogRef<EntryModalComponent, string | null>);
  private entryModalControlService = inject(EntryModalControlService);

  entryFormGroup: FormGroup = this.entryModalControlService.toFormGroup();

  get categoryOptions(): MatSelectOption[] {
    return Object.entries(CategoryConfigurations).map(([value, config]) => ({
      value,
      label: config.label,
    }));
  }

  override closeDialog(): void {
    this.matdialogRef.close(null);
  }

  override saveDialog(): void {
    this.matdialogRef.close(this.entryModalControlService.toRequestPayload(this.entryFormGroup));
  }
}
