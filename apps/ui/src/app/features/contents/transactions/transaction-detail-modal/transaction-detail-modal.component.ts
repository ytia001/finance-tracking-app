import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TransactionEntry } from '../../../../models/transaction.models';

@Component({
  selector: 'app-transaction-detail-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './transaction-detail-modal.component.html',
  styleUrl: './transaction-detail-modal.component.scss',
})
export class TransactionDetailModalComponent {
  readonly entry = inject<TransactionEntry>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<TransactionDetailModalComponent>);

  isIncomeClass(entry: TransactionEntry): string {
    return entry.isIncome ? 'text-success' : 'text-danger';
  }

  close(): void {
    this.dialogRef.close();
  }
}
