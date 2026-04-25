import { Component, inject, Input } from '@angular/core';
import { AbstractModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EntryModalControlService } from './entry-modal-control-service/entry-modal-control.service';
import { TuiTextfield } from '@taiga-ui/core';
import { CategoryConfigurations, Category } from '../../../core/constants/Category';

@Component({
  selector: 'app-entry-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, TuiTextfield],
  templateUrl: './entry-modal.component.html',
  styleUrl: './entry-modal.component.scss',
})
export class EntryModalComponent extends AbstractModalDialogComponent {
  private entryModalControlService = inject(EntryModalControlService);

  @Input() closeFn: ((result: unknown) => void) | null = null;

  entryFormGroup: FormGroup = this.entryModalControlService.toFormGroup();

  categoryOptions = Object.keys(CategoryConfigurations);

  getCategoryLabel(value: string): string {
    return CategoryConfigurations[value as Category]?.label || value;
  }

  override closeDialog(): void {
    if (this.closeFn) {
      this.closeFn(null);
    }
  }

  override saveDialog(): void {
    if (this.entryFormGroup.invalid) return;
    if (this.closeFn) {
      this.closeFn(this.entryModalControlService.toRequestPayload(this.entryFormGroup));
    }
  }
}
