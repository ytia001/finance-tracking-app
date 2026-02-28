import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects';
import { filter, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ToastEffects {
  private actions$ = inject(Actions);
  private toastr = inject(ToastrService);

  showSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        filter((action) => !!action.successMessage),
        tap(({ successMessage }) => this.toastr.success(successMessage)),
      ),
    { dispatch: false },
  );

  showFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        filter((action) => !!action.failureMessage),
        tap(({ failureMessage }) => this.toastr.error(failureMessage)),
      ),
    { dispatch: false },
  );
}
