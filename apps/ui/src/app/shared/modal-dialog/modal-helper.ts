import { FormControl } from '@angular/forms';

export type AsFormGroup<T> = {
  [k in keyof T]: FormControl<T[k]>;
};
