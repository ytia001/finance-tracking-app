import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectMonthTabs } from '../../../core/store/selectors/transactions.selector';
import { MonthTab, TransactionEntry } from '../../../models/transaction.models';
import { retrieveMatModalConfiguration } from '../../../core/constants/Modal';
import { TransactionDetailModalComponent } from './transaction-detail-modal/transaction-detail-modal.component';
import { TransactionsListGroupComponent } from './transactions-list-group/transactions-list-group.component';
import { MainResourceActions } from '../../../core/store/actions/resources/main.actions';

@Component({
  selector: 'app-transactions',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    NgClass,
    MatTabsModule,
    MatDialogModule,
    TransactionsListGroupComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  monthTabs$: Observable<MonthTab[]> = this.store.select(selectMonthTabs);

  ngOnInit(): void {
    // Load all entries from the backend when this route activates
    this.store.dispatch(MainResourceActions.loadDataEntries());
  }

  netBalanceClass(tab: MonthTab): string {
    return tab.netBalance >= 0 ? 'text-success' : 'text-danger';
  }

  openDetail(entry: TransactionEntry): void {
    this.dialog.open(
      TransactionDetailModalComponent,
      retrieveMatModalConfiguration(entry, { width: '65%', height: '45%' }),
    );
  }
}
