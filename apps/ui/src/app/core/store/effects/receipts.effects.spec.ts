import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ReceiptsEffects } from './receipts.effects';
import { MainActions } from '../actions/main.actions';
import { MainResourceActions } from '../actions/resources/main.actions';
import { ReceiptsActions } from '../actions/resources/receipts.actions';
import { ReceiptsService } from '../../services/receipts.service';
import { MainService } from '../../services/main.services';
import { JobStatus } from '../../../models/Receipt';
import { Category } from '../../constants/Category';

describe('ReceiptsEffects', () => {
  let actions$: Observable<Action>;
  let effects: ReceiptsEffects;
  let receiptsServiceSpy: jasmine.SpyObj<ReceiptsService>;
  let mainServiceSpy: jasmine.SpyObj<MainService>;

  beforeEach(() => {
    receiptsServiceSpy = jasmine.createSpyObj('ReceiptsService', [
      'uploadReceiptForProcessing',
      'getStatus',
    ]);
    mainServiceSpy = jasmine.createSpyObj('MainService', ['create']);

    TestBed.configureTestingModule({
      providers: [
        ReceiptsEffects,
        provideMockActions(() => actions$),
        { provide: ReceiptsService, useValue: receiptsServiceSpy },
        { provide: MainService, useValue: mainServiceSpy },
      ],
    });

    effects = TestBed.inject(ReceiptsEffects);
  });

  describe('uploadReceiptForProcessing$', () => {
    it('should dispatch uploadReceiptForProcessingSuccess on successful upload', (done) => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      receiptsServiceSpy.uploadReceiptForProcessing.and.returnValue(of({ jobId: 'job-123' }));

      actions$ = of(MainActions.uploadReceipt({ file: mockFile }));

      effects.uploadReceiptForProcessing$.subscribe((action) => {
        expect(action).toEqual(
          ReceiptsActions.uploadReceiptForProcessingSuccess({ jobId: 'job-123' }),
        );
        done();
      });
    });

    it('should dispatch uploadReceiptForProcessingFailure on error', (done) => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Internal Error' });
      receiptsServiceSpy.uploadReceiptForProcessing.and.returnValue(throwError(() => errorResponse));

      actions$ = of(MainActions.uploadReceipt({ file: mockFile }));

      effects.uploadReceiptForProcessing$.subscribe((action) => {
        expect(action.type).toBe(ReceiptsActions.uploadReceiptForProcessingFailure.type);
        done();
      });
    });
  });

  describe('uploadReceiptForProcessingSuccess$', () => {
    it('should map to pollReceiptStatus action', (done) => {
      actions$ = of(ReceiptsActions.uploadReceiptForProcessingSuccess({ jobId: 'job-123' }));

      effects.uploadReceiptForProcessingSuccess$.subscribe((action) => {
        expect(action).toEqual(ReceiptsActions.pollReceiptStatus({ jobId: 'job-123' }));
        done();
      });
    });
  });

  describe('pollReceiptStatus$', () => {
    it('should poll and dispatch pollReceiptCompletedStatus on COMPLETED', (done) => {
      const mockParsedData = { total: 100, date: '2026-05-24' };
      receiptsServiceSpy.getStatus.and.returnValue(
        of({
          jobId: 'job-123',
          status: JobStatus.COMPLETED,
          data: mockParsedData,
        }),
      );

      actions$ = of(ReceiptsActions.pollReceiptStatus({ jobId: 'job-123' }));

      effects.pollReceiptStatus$.subscribe((action) => {
        expect(action).toEqual(
          ReceiptsActions.pollReceiptCompletedStatus({
            parsedData: mockParsedData,
          }),
        );
        done();
      });
    });

    it('should poll and dispatch pollReceiptFailedStatus on FAILED', (done) => {
      receiptsServiceSpy.getStatus.and.returnValue(
        of({
          jobId: 'job-123',
          status: JobStatus.FAILED,
          error: 'OCR Failed',
        }),
      );

      actions$ = of(ReceiptsActions.pollReceiptStatus({ jobId: 'job-123' }));

      effects.pollReceiptStatus$.subscribe((action) => {
        expect(action).toEqual(
          ReceiptsActions.pollReceiptFailedStatus({
            error: 'OCR Failed',
          }),
        );
        done();
      });
    });
  });

  describe('createEntryFromReceipt$', () => {
    it('should create entry and dispatch saveDataEntrySuccess on COMPLETED', (done) => {
      const mockParsedData = { total: 100, date: '2026-05-24' };
      const createdEntry = {
        id: 1,
        amount: '100',
        date: new Date('2026-05-24').getTime(),
        category: Category.OTHERS,
      };
      mainServiceSpy.create.and.returnValue(of(createdEntry));

      actions$ = of(ReceiptsActions.pollReceiptCompletedStatus({ parsedData: mockParsedData }));

      effects.createEntryFromReceipt$.subscribe((action) => {
        expect(mainServiceSpy.create).toHaveBeenCalledWith({
          amount: 100,
          date: new Date('2026-05-24'),
          category: Category.OTHERS,
        });
        expect(action).toEqual(
          MainResourceActions.saveDataEntrySuccess({
            data: createdEntry,
            successMessage: 'Receipt uploaded and new entry created',
          }),
        );
        done();
      });
    });

    it('should dispatch saveDataEntryFailure on create error', (done) => {
      const mockParsedData = { total: 100, date: '2026-05-24' };
      const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
      mainServiceSpy.create.and.returnValue(throwError(() => errorResponse));

      actions$ = of(ReceiptsActions.pollReceiptCompletedStatus({ parsedData: mockParsedData }));

      effects.createEntryFromReceipt$.subscribe((action) => {
        expect(action.type).toBe(MainResourceActions.saveDataEntryFailure.type);
        done();
      });
    });
  });
});
