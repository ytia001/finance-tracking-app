import { Injectable, inject, Type } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { ModalConstants, DialogConfig } from '../constants/Modal';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private dialogService = inject(TuiDialogService);

  openModal<T>(
    component: Type<T> | PolymorpheusComponent<T>,
    config: DialogConfig = ModalConstants.AUTH_MODAL_CONFIG,
    data?: object,
  ): Observable<unknown> {
    return this.dialogService.open(component, {
      ...config,
      label: config.label || '',
      data,
    });
  }

  closeModal(): void {
    // TODO: Implement modal close via TuiDialogService
  }
}
