import { createActionGroup, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { TabscannerParsedData } from '../../../../models/Receipt';

export const ReceiptsActions = createActionGroup({
  source: 'Receipts [API]',
  events: {
    'Upload receipt for processing success': props<{ jobId: string }>(),
    'Upload receipt for processing failure': props<{ error: HttpErrorResponse }>(),
    'Poll receipt status': props<{ jobId: string }>(),
    'Poll receipt completed status': props<{ parsedData: TabscannerParsedData }>(),
    'Poll receipt failed status': props<{ error: string }>(),
    'Poll receipt status failure': props<{ failureMessage: string }>(),
  },
});
