import { Injectable, inject, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalConstants } from '../constants/Modal';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private dialog = inject(MatDialog);
  private currentDialogRef: MatDialogRef<unknown> | null = null;

  openModal<T>(component: Type<T>, config = ModalConstants.AUTH_MODAL_CONFIG): MatDialogRef<unknown> {
    this.closeCurrentDialog();
    const dialogRef = this.dialog.open(component, config);
    this.currentDialogRef = dialogRef;
    return dialogRef;
  }

  closeModal<T>(result?: T): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close(result);
      this.currentDialogRef = null;
    }
  }

  private closeCurrentDialog(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = null;
    }
  }
}