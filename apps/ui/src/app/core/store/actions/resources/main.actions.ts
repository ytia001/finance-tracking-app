import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { DataEntry } from '../../../../models/DataEntry';
import { DataEntryRequest } from '../../../../features/main/entry-modal/entry-modal-control-service/entry-modal-control.service';

export const MainResourceActions = createActionGroup({
  source: 'Main [API]',
  events: {
    'Load data entries': emptyProps(),
    'Load data entries success': props<{ data: DataEntry[] }>(),
    'Load data entries failure': props<{ error: HttpErrorResponse }>(),
    'Save data entry': props<{ data: DataEntryRequest }>(),
    'Save data entry success': props<{ data: DataEntry; successMessage: string }>(),
    'Save data entry failure': props<{ error: HttpErrorResponse; failureMessage: string }>(),
  },
});
