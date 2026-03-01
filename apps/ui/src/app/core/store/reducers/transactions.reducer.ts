import { createReducer, on } from '@ngrx/store';
import { MainResourceActions } from '../actions/resources/main.actions';
import { DataEntry } from '../../../models/DataEntry';

export const TRANSACTION_FEATURE_KEY = 'transaction';

export interface TransactionState {
  loading: boolean;
  entries: DataEntry[];
}

export const initialState: TransactionState = {
  loading: false,
  entries: [],
};

export const transactionReducer = createReducer(
  initialState,

  on(MainResourceActions.loadDataEntries, (state) => ({
    ...state,
    loading: true,
  })),

  on(MainResourceActions.loadDataEntriesSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    entries: data,
  })),

  on(MainResourceActions.loadDataEntriesFailure, (state) => ({
    ...state,
    loading: false,
  })),

  on(MainResourceActions.saveDataEntrySuccess, (state, { data }) => ({
    ...state,
    entries: [...state.entries, data],
  })),
);
