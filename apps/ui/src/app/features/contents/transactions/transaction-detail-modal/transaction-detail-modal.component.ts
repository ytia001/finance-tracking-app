import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TransactionEntry } from '../../../../models/transaction';

@Component({
  selector: 'app-transaction-detail-modal',
  standalone: true,
  imports: [CommonModule, TuiButton, TuiIcon],
  templateUrl: './transaction-detail-modal.component.html',
  styleUrl: './transaction-detail-modal.component.scss',
})
export class TransactionDetailModalComponent {
  @Input() entry!: TransactionEntry;
  @Input() closeFn: (() => void) | null = null;

  close(): void {
    if (this.closeFn) {
      this.closeFn();
    }
  }

  isIncomeClass(entry: TransactionEntry): string {
    return entry.isIncome ? 'text-success' : 'text-danger';
  }
}
