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
  AUTH_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful! Welcome back!',
    LOGIN_FAILURE: 'Login failed. Please try again.',
    REGISTER_SUCCESS: 'Account created! Please sign in.',
    REGISTER_FAILURE: 'Registration failed. Please try again.',
    LOGOUT_SUCCESS: 'You have been logged out.',
  },
};
