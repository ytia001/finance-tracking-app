import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../core/store/actions/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../core/store/selectors/auth.selector';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';
import { ModalService } from '../../../core/services/modal.service';
import { LoginModalComponent } from './login-modal.component';
import { RegisterCredentials } from '../../../models/auth';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss',
})
export class RegisterModalComponent extends AbstractModalDialogComponent {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);
  private matDialogRef = inject(MatDialogRef<RegisterModalComponent>);
  private modalService = inject(ModalService);

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  loading = this.store.selectSignal(selectAuthLoading);
  error = this.store.selectSignal(selectAuthError);

  override closeDialog(): void {
    this.matDialogRef.close(null);
  }

  override saveDialog(): void {
    if (this.registerForm.invalid) return;
    const data = this.formatRegisterData();
    this.store.dispatch(AuthActions.register({ data }));
  }

  private formatRegisterData(): RegisterCredentials {
    const { email, password, firstName, lastName } = this.registerForm.value;
    return {
      email: email!.trim().toLowerCase(),
      password: password!,
      firstName: firstName!.trim(),
      lastName: lastName!.trim(),
    };
  }

  onSubmit(): void {
    this.saveDialog();
  }

  onSwitchToLogin(): void {
    this.modalService.closeModal('login');
    this.modalService.openModal(LoginModalComponent);
  }
}
