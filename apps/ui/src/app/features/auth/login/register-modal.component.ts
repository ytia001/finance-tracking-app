import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../core/store/actions/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../core/store/selectors/auth.selector';
import { TuiTextfield, TuiLoader, TuiIcon } from '@taiga-ui/core';
import { AbstractModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';
import { RegisterCredentials } from '../../../models/auth';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TuiTextfield, TuiLoader, TuiIcon],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss',
})
export class RegisterModalComponent extends AbstractModalDialogComponent {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  loading = this.store.selectSignal(selectAuthLoading);
  error = this.store.selectSignal(selectAuthError);

  override closeDialog(): void {
    // Required by AbstractModalDialogComponent
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
    // TODO: Implement login modal switch
  }
}
