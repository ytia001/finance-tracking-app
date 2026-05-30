import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MainActions } from '../actions/main.actions';
import { MainResourceActions } from '../actions/resources/main.actions';
import { ReceiptsActions } from '../actions/resources/receipts.actions';
import { ReceiptsService } from '../../services/receipts.service';
import { MainService } from '../../services/main.services';
import { catchError, first, map, of, repeat, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { JobStatus, TabscannerParsedData } from '../../../models/Receipt';
import { Category } from '../../constants/Category';
import { DataEntryRequest } from '../../../features/main/entry-modal/entry-modal-control-service/entry-modal-control.service';

@Injectable()
export class ReceiptsEffects {
  private actions$ = inject(Actions);
  private receiptsService = inject(ReceiptsService);
  private mainService = inject(MainService);

  uploadReceiptForProcessing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MainActions.uploadReceipt),
      switchMap(({ file }) =>
        this.receiptsService.uploadReceiptForProcessing(file).pipe(
          map((response) =>
            ReceiptsActions.uploadReceiptForProcessingSuccess({ jobId: response.jobId }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(ReceiptsActions.uploadReceiptForProcessingFailure({ error })),
          ),
        ),
      ),
    ),
  );

  uploadReceiptForProcessingSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceiptsActions.uploadReceiptForProcessingSuccess),
      map(({ jobId }) => ReceiptsActions.pollReceiptStatus({ jobId })),
    ),
  );

  pollReceiptStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceiptsActions.pollReceiptStatus),
      switchMap(({ jobId }) =>
        this.receiptsService.getStatus(jobId).pipe(
          repeat({ delay: 3000 }),
          first(
            (response) =>
              response.status === JobStatus.COMPLETED || response.status === JobStatus.FAILED,
          ),
          map((response) => {
            if (response.status === JobStatus.COMPLETED) {
              return ReceiptsActions.pollReceiptCompletedStatus({
                parsedData: response.data || {},
              });
            } else {
              return ReceiptsActions.pollReceiptFailedStatus({
                error: response.error || 'OCR processing failed',
              });
            }
          }),
          catchError((error) => {
            const errorMsg = error.message || 'Error occurred while scanning receipt';
            return of(ReceiptsActions.pollReceiptStatusFailure({ failureMessage: errorMsg }));
          }),
        ),
      ),
    ),
  );

  createEntryFromReceipt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceiptsActions.pollReceiptCompletedStatus),
      switchMap(({ parsedData }) => {
        const entryRequest = this.buildEntryRequest(parsedData);
        return this.mainService.create(entryRequest).pipe(
          map((data) =>
            MainResourceActions.saveDataEntrySuccess({
              data,
              successMessage: 'Receipt uploaded and new entry created',
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              MainResourceActions.saveDataEntryFailure({
                error,
                failureMessage: 'Failed to create entry from receipt',
              }),
            ),
          ),
        );
      }),
    ),
  );

  private buildEntryRequest(parsedData: TabscannerParsedData): DataEntryRequest {
    return {
      amount:
        typeof parsedData.total === 'string'
          ? parseFloat(parsedData.total)
          : (parsedData.total ?? 0),
      date: parsedData.date ? new Date(parsedData.date) : new Date(),
      category: Category.OTHERS,
    };
  }
}
