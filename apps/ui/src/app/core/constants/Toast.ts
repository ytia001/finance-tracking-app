import { GlobalConfig } from 'ngx-toastr';

export const toastrConfig: Partial<GlobalConfig> = {
  positionClass: 'toast-top-right',
  timeOut: 3000,
  closeButton: true,
  progressBar: true,
  preventDuplicates: true,
};

export const ToastMessages = {
  DATA_ENTRY_TOAST_MESSAGES: {
    SAVE_SUCCESS: 'Entry saved successfully!',
    SAVE_FAILURE: 'Failed to save entry. Please try again.',
  },
};
