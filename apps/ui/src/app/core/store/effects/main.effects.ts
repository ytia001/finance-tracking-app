import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MainActions } from '../actions/main.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { TuiDialogService } from '@taiga-ui/core';
import { MainResourceActions } from '../actions/resources/main.actions';
import { MainService } from '../../services/main.services';
import { EntryModalComponent } from '../../../features/main/entry-modal/entry-modal.component';
import { DataEntryRequest } from '../../../features/main/entry-modal/entry-modal-control-service/entry-modal-control.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastMessages } from '../../constants/Toast';

@Injectable()
export class MainEffects {
  private actions$ = inject(Actions);
  private dialogService = inject(TuiDialogService);
  private service = inject(MainService);

  openAddDataEntryModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.openAddDataEntryModal),
      switchMap(() => {
        const dialog = this.dialogService.open(EntryModalComponent);

        return dialog.pipe(
          map((result: unknown) => {
            if (!result) {
              throw new Error('No result');
            }
            return MainResourceActions.saveDataEntry({ data: result as DataEntryRequest });
          }),
          catchError((error) => of(MainActions.error({ error }))),
        );
      }),
    );
  });

  saveDataEntry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainResourceActions.saveDataEntry),
      switchMap(({ data }) =>
        this.service.create(data).pipe(
          map((response) =>
            MainResourceActions.saveDataEntrySuccess({
              data: response,
              successMessage: ToastMessages.DATA_ENTRY_TOAST_MESSAGES.SAVE_SUCCESS,
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              MainResourceActions.saveDataEntryFailure({
                error,
                failureMessage: ToastMessages.DATA_ENTRY_TOAST_MESSAGES.SAVE_FAILURE,
              }),
            ),
          ),
        ),
      ),
    );
  });

  loadDataEntries$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainResourceActions.loadDataEntries),
      switchMap(() =>
        this.service.getAll().pipe(
          map((data) => MainResourceActions.loadDataEntriesSuccess({ data })),
          catchError((error: HttpErrorResponse) =>
            of(MainResourceActions.loadDataEntriesFailure({ error })),
          ),
        ),
      ),
    );
  });
}
