import { MatDialogConfig } from '@angular/material/dialog';

export class ModalConstants {
  static readonly MODAL_WIDTH_PERCENTAGE = '45%';
  static readonly MODAL_HEIGHT_PERCENTAGE = '65%';
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
