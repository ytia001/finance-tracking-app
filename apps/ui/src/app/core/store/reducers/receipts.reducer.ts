import { createReducer, on } from '@ngrx/store';
import { MainActions } from '../actions/main.actions';
import { MainResourceActions } from '../actions/resources/main.actions';
import { ReceiptsActions } from '../actions/resources/receipts.actions';

export const RECEIPTS_FEATURE_KEY = 'receipts';

export interface ReceiptsState {
  isUploading: boolean;
  jobId: string | null;
  error: string | null;
}

export const initialReceiptsState: ReceiptsState = {
  isUploading: false,
  jobId: null,
  error: null,
};

export const receiptsReducer = createReducer(
  initialReceiptsState,
  on(MainActions.uploadReceipt, (state) => ({
    ...state,
    isUploading: true,
    jobId: null,
    error: null,
  })),
  on(ReceiptsActions.uploadReceiptForProcessingSuccess, (state, { jobId }) => ({
    ...state,
    jobId,
  })),
  on(ReceiptsActions.uploadReceiptForProcessingFailure, (state, { error }) => ({
    ...state,
    isUploading: false,
    error: error.message || 'Upload failed',
  })),
  on(ReceiptsActions.pollReceiptFailedStatus, (state, { error }) => ({
    ...state,
    isUploading: false,
    error,
  })),
  on(ReceiptsActions.pollReceiptStatusFailure, (state, { failureMessage }) => ({
    ...state,
    isUploading: false,
    error: failureMessage,
  })),
  on(MainResourceActions.saveDataEntrySuccess, (state) => ({
    ...state,
    isUploading: false,
  })),
  on(MainResourceActions.saveDataEntryFailure, (state, { error }) => ({
    ...state,
    isUploading: false,
    error: error.message || 'Failed to create entry',
  })),
  on(MainActions.resetReceiptState, () => initialReceiptsState),
);
