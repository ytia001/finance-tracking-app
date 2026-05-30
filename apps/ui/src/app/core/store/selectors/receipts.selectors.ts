import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RECEIPTS_FEATURE_KEY, ReceiptsState } from '../reducers/receipts.reducer';

export const selectReceiptsState = createFeatureSelector<ReceiptsState>(RECEIPTS_FEATURE_KEY);

export const selectIsFileUploading = createSelector(
  selectReceiptsState,
  (state: ReceiptsState) => state.isUploading,
);

export const selectJobId = createSelector(
  selectReceiptsState,
  (state: ReceiptsState) => state.jobId,
);

export const selectReceiptError = createSelector(
  selectReceiptsState,
  (state: ReceiptsState) => state.error,
);
