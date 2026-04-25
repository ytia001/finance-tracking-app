import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectMonthTabs } from '../../../core/store/selectors/transactions.selector';
import { MonthTab, TransactionEntry } from '../../../models/transaction';
import { createDialogConfig } from '../../../core/constants/Modal';
import { TransactionDetailModalComponent } from './transaction-detail-modal/transaction-detail-modal.component';
import { TransactionsListGroupComponent } from './transactions-list-group/transactions-list-group.component';
import { MainResourceActions } from '../../../core/store/actions/resources/main.actions';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-transactions',
  imports: [AsyncPipe, CurrencyPipe, NgClass, TransactionsListGroupComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  private store = inject(Store);
  private modalService = inject(ModalService);

  monthTabs$: Observable<MonthTab[]> = this.store.select(selectMonthTabs);
  activeTab: string | null = null;

  ngOnInit(): void {
    this.store.dispatch(MainResourceActions.loadDataEntries());
  }

  netBalanceClass(tab: MonthTab): string {
    return tab.netBalance >= 0 ? 'text-success' : 'text-danger';
  }

  openDetail(entry: TransactionEntry): void {
    const dialogRef = this.modalService.openModal(
      TransactionDetailModalComponent,
      createDialogConfig({ width: '65%' }),
      { entry },
    );

    dialogRef.subscribe();
  }
}
