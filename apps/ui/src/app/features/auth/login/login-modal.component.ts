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
import { RegisterModalComponent } from './register-modal.component';

@Component({
  selector: 'app-login-modal',
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
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent extends AbstractModalDialogComponent {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);
  private matDialogRef = inject(MatDialogRef<LoginModalComponent>);
  private modalService = inject(ModalService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  loading = this.store.selectSignal(selectAuthLoading);
  error = this.store.selectSignal(selectAuthError);

  override closeDialog(): void {
    this.matDialogRef.close(null);
  }

  override saveDialog(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.store.dispatch(
      AuthActions.login({ email: email!.trim().toLowerCase(), password: password! }),
    );
  }

  onSubmit(): void {
    this.saveDialog();
  }

  onSwitchToRegister(): void {
    this.modalService.closeModal('register');
    this.modalService.openModal(RegisterModalComponent);
  }
}
