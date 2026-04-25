import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { DayGroup, TransactionEntry } from '../../../../models/transaction';

@Component({
  selector: 'app-transactions-list-group',
  imports: [CommonModule, TuiIcon],
  templateUrl: './transactions-list-group.component.html',
  styleUrl: './transactions-list-group.component.scss',
})
export class TransactionsListGroupComponent {
  @Input() dayGroup!: DayGroup;
  @Output() entryClicked = new EventEmitter<TransactionEntry>();

  onEntryClick(entry: TransactionEntry): void {
    this.entryClicked.emit(entry);
  }

  isIncomeClass(entry: TransactionEntry): string {
    return entry.isIncome ? 'text-success' : 'text-danger';
  }
}
