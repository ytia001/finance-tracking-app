import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DayGroup, TransactionEntry } from '../../../../models/transaction';

@Component({
  selector: 'app-transactions-list-group',
  imports: [CommonModule, MatIconModule, MatDividerModule],
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
