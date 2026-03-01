import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const MainActions = createActionGroup({
  source: 'Main',
  events: {
    'Open add data entry modal': emptyProps(),

    error: props<{ error: HttpErrorResponse }>(),
  },
});
