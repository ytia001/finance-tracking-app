import { MatDialogConfig } from '@angular/material/dialog';

export class ModalConstants {
  static readonly MODAL_WIDTH_PERCENTAGE = '45%';
  static readonly MODAL_HEIGHT_PERCENTAGE = '65%';
  static readonly LOGIN_MODAL_WIDTH_PERCENTAGE = '90%';
  static readonly LOGIN_MODAL_MAX_WIDTH = '800px';

  static readonly AUTH_MODAL_CONFIG = {
    width: ModalConstants.LOGIN_MODAL_WIDTH_PERCENTAGE,
    maxWidth: ModalConstants.LOGIN_MODAL_MAX_WIDTH,
    maxHeight: '90vh',
    disableClose: true,
    panelClass: 'auth-modal-panel',
  };
}

export function retrieveMatModalConfiguration<T>(
  data: T,
  customConfigs: Partial<MatDialogConfig<T>> = {},
): MatDialogConfig<T> {
  return {
    width: ModalConstants.MODAL_WIDTH_PERCENTAGE,
    height: ModalConstants.MODAL_HEIGHT_PERCENTAGE,
    disableClose: false,
    autoFocus: true,
    data: data,
    ...customConfigs,
  };
}
