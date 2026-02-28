// imports

import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Category } from '../../../../core/constants/Category';
import { inject, Injectable } from '@angular/core';
import { AsFormGroup } from '../../../../shared/modal-dialog/modal-helper';

export interface DataEntryRequest {
  category: Category;
  amount: number;
  date: Date;
}

interface DataEntryForm {
  category: Category;
  amount: number;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class EntryModalControlService {
  private formBuilder: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  toFormGroup(): FormGroup<AsFormGroup<DataEntryForm>> {
    return this.formBuilder.group({
      category: [Category.INCOME, [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date(), [Validators.required]],
    });
  }

  toRequestPayload(formGroup: FormGroup): DataEntryRequest {
    console.log('FormGroup value:', formGroup.value); // Debug log to check form values
    return formGroup.value as DataEntryRequest;
  }
}
