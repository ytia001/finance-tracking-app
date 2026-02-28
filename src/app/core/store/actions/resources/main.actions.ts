import { createActionGroup, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { DataEntry } from '../../../../models/DataEntry';
import { DataEntryRequest } from '../../../../features/main/entry-modal/entry-modal-control-service/entry-modal-control.service';

export const MainResourceActions = createActionGroup({
  source: 'Main [API]',
  events: {
    'Save data entry': props<{ data: DataEntryRequest }>(),
    'Save data entry success': props<{ data: DataEntry; successMessage: string }>(),
    'Save data entry failure': props<{ error: HttpErrorResponse; failureMessage: string }>(),
  },
});
