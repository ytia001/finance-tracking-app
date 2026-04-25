export class ModalConstants {
  static readonly MODAL_WIDTH_PERCENTAGE = '45%';
  static readonly MODAL_HEIGHT_PERCENTAGE = '65%';
  static readonly LOGIN_MODAL_WIDTH_PERCENTAGE = '90%';
  static readonly LOGIN_MODAL_MAX_WIDTH = '800px';

  static readonly AUTH_MODAL_CONFIG = {
    width: ModalConstants.LOGIN_MODAL_WIDTH_PERCENTAGE,
    maxWidth: ModalConstants.LOGIN_MODAL_MAX_WIDTH,
    maxHeight: '90vh',
    dismissible: true,
  };
}

export interface DialogConfig {
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  dismissible?: boolean;
  label?: string;
}

export function createDialogConfig(custom: DialogConfig = {}): DialogConfig {
  return {
    width: ModalConstants.MODAL_WIDTH_PERCENTAGE,
    maxHeight: ModalConstants.MODAL_HEIGHT_PERCENTAGE,
    dismissible: false,
    label: '',
    ...custom,
  };
}
