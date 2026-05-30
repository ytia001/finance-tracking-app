import {
  selectIsFileUploading,
  selectJobId,
  selectReceiptError,
} from './receipts.selectors';
import { ReceiptsState } from '../reducers/receipts.reducer';

describe('receipts selectors', () => {
  const testState: ReceiptsState = {
    isUploading: true,
    jobId: 'job-123',
    error: 'some error',
  };

  describe('selectIsFileUploading', () => {
    it('should return the uploading status', () => {
      expect(selectIsFileUploading.projector(testState)).toBeTrue();
    });

    it('should return false when not uploading', () => {
      const state: ReceiptsState = { ...testState, isUploading: false };
      expect(selectIsFileUploading.projector(state)).toBeFalse();
    });
  });

  describe('selectJobId', () => {
    it('should return the job id', () => {
      expect(selectJobId.projector(testState)).toBe('job-123');
    });

    it('should return null when no job id', () => {
      const state: ReceiptsState = { ...testState, jobId: null };
      expect(selectJobId.projector(state)).toBeNull();
    });
  });

  describe('selectReceiptError', () => {
    it('should return the error', () => {
      expect(selectReceiptError.projector(testState)).toBe('some error');
    });

    it('should return null when no error', () => {
      const state: ReceiptsState = { ...testState, error: null };
      expect(selectReceiptError.projector(state)).toBeNull();
    });
  });
});
