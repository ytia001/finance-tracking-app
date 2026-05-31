import { Injectable, inject, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import { ModalConstants } from '../constants/Modal';

@Injectable({ providedIn: 'root' })
export class ModalDialogService {
  private dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<unknown> | null = null;

  private defaultConfig: MatDialogConfig = {
    width: ModalConstants.MODAL_WIDTH_PERCENTAGE,
    height: ModalConstants.MODAL_HEIGHT_PERCENTAGE,
    disableClose: true,
  };

  open<T, TResult = unknown>(
    component: Type<T>,
    config?: Partial<MatDialogConfig>,
  ): Observable<TResult | undefined> {
    const ref = this.dialog.open<T, unknown, TResult>(component, {
      ...this.defaultConfig,
      ...config,
    });
    this.dialogRef = ref;
    return ref.afterClosed().pipe(
      tap(() => {
        this.dialogRef = null;
      }),
    );
  }

  close(): void {
    this.dialogRef?.close();
    this.dialogRef = null;
  }
}
