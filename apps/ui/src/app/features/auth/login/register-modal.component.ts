import { Component, EventEmitter, effect, inject, Output } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { RegisterCredentials } from '../../../models/auth';
import { AuthActions } from '../../../core/store/actions/auth.actions';
import {
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from '../../../core/store/selectors/auth.selector';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';

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

  @Output() switchToLogin = new EventEmitter<void>();

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  private isAuthenticated$ = this.store.select(selectIsAuthenticated);

  loading = this.store.selectSignal(selectAuthLoading);
  error = this.store.selectSignal(selectAuthError);
  isAuthenticated = toSignal(this.isAuthenticated$, { initialValue: false });

  constructor() {
    super();
    effect(() => {
      if (this.isAuthenticated()) {
        this.matDialogRef.close(true);
      }
    });
  }

  override closeDialog(): void {
    this.matDialogRef.close(null);
  }

  override saveDialog(): void {
    if (this.registerForm.invalid) return;

    const { email, password, firstName, lastName } = this.registerForm.value;
    const data: RegisterCredentials = {
      email: email!.trim().toLowerCase(),
      password: password!,
      firstName: firstName!.trim(),
      lastName: lastName!.trim(),
    };
    this.store.dispatch(AuthActions.register({ data }));
  }

  onSubmit(): void {
    this.saveDialog();
  }

  onSwitchToLogin(): void {
    this.switchToLogin.emit();
    this.closeDialog();
  }
}
