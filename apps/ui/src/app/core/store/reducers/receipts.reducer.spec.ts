import { receiptsReducer, initialReceiptsState, ReceiptsState } from './receipts.reducer';
import { MainActions } from '../actions/main.actions';
import { MainResourceActions } from '../actions/resources/main.actions';
import { ReceiptsActions } from '../actions/resources/receipts.actions';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { TestHelpers } from '../../../test-helpers';

describe('ReceiptsReducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = { type: 'UNKNOWN' } as Action;
      const state = receiptsReducer(undefined, action);
      expect(state).toEqual(initialReceiptsState);
    });
  });

  describe('uploadReceipt action', () => {
    it('should set isUploading to true and clear jobId and error', () => {
      const prevState: ReceiptsState = {
        ...initialReceiptsState,
        jobId: 'old-job',
        error: 'old error',
      };
      const state = receiptsReducer(
        prevState,
        MainActions.uploadReceipt({ file: new File([], 'test.jpg') }),
      );
      expect(state.isUploading).toBeTrue();
      expect(state.jobId).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('uploadReceiptForProcessingSuccess action', () => {
    it('should set the jobId', () => {
      const state = receiptsReducer(
        initialReceiptsState,
        ReceiptsActions.uploadReceiptForProcessingSuccess({ jobId: 'job-123' }),
      );
      expect(state.jobId).toBe('job-123');
    });
  });

  describe('uploadReceiptForProcessingFailure action', () => {
    it('should set isUploading to false and set error message', () => {
      const error = { message: 'Upload failed' } as HttpErrorResponse;
      const state = receiptsReducer(
        { ...initialReceiptsState, isUploading: true },
        ReceiptsActions.uploadReceiptForProcessingFailure({ error }),
      );
      expect(state.isUploading).toBeFalse();
      expect(state.error).toBe('Upload failed');
    });

    it('should use default message when error.message is missing', () => {
      const error = {} as HttpErrorResponse;
      const state = receiptsReducer(
        { ...initialReceiptsState, isUploading: true },
        ReceiptsActions.uploadReceiptForProcessingFailure({ error }),
      );
      expect(state.error).toBe('Upload failed');
    });
  });

  describe('pollReceiptFailedStatus action', () => {
    it('should set isUploading to false and store error string', () => {
      const state = receiptsReducer(
        { ...initialReceiptsState, isUploading: true },
        ReceiptsActions.pollReceiptFailedStatus({ error: 'Processing failed' }),
      );
      expect(state.isUploading).toBeFalse();
      expect(state.error).toBe('Processing failed');
    });
  });

  describe('pollReceiptStatusFailure action', () => {
    it('should set isUploading to false and store failure message', () => {
      const state = receiptsReducer(
        { ...initialReceiptsState, isUploading: true },
        ReceiptsActions.pollReceiptStatusFailure({ failureMessage: 'Status check failed' }),
      );
      expect(state.isUploading).toBeFalse();
      expect(state.error).toBe('Status check failed');
    });
  });

  describe('saveDataEntrySuccess action', () => {
    it('should set isUploading to false', () => {
      const entry = TestHelpers.createDataEntry();
      const state = receiptsReducer(
        { ...initialReceiptsState, isUploading: true },
        MainResourceActions.saveDataEntrySuccess({ data: entry, successMessage: 'Saved!' }),
      );
      expect(state.isUploading).toBeFalse();
    });
  });

  describe('saveDataEntryFailure action', () => {
    it('should set isUploading to false and store error', () => {
      const error = { message: 'Save failed' } as HttpErrorResponse;
      const state = receiptsReducer(
        { ...initialReceiptsState, isUploading: true },
        MainResourceActions.saveDataEntryFailure({ error, failureMessage: 'Save error' }),
      );
      expect(state.isUploading).toBeFalse();
      expect(state.error).toBe('Save failed');
    });

    it('should use default message when error.message is missing', () => {
      const error = {} as HttpErrorResponse;
      const state = receiptsReducer(
        { ...initialReceiptsState, isUploading: true },
        MainResourceActions.saveDataEntryFailure({ error, failureMessage: 'Save error' }),
      );
      expect(state.error).toBe('Failed to create entry');
    });
  });

  describe('resetReceiptState action', () => {
    it('should reset to initial state', () => {
      const prevState: ReceiptsState = {
        isUploading: true,
        jobId: 'job-123',
        error: 'some error',
      };
      const state = receiptsReducer(prevState, MainActions.resetReceiptState());
      expect(state).toEqual(initialReceiptsState);
    });
  });
});
