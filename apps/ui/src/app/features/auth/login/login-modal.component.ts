import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../core/store/actions/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../core/store/selectors/auth.selector';
import { TuiTextfield, TuiLoader, TuiIcon } from '@taiga-ui/core';
import { AbstractModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TuiTextfield, TuiLoader, TuiIcon],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent extends AbstractModalDialogComponent {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  loading = this.store.selectSignal(selectAuthLoading);
  error = this.store.selectSignal(selectAuthError);

  override closeDialog(): void {
    // Required by AbstractModalDialogComponent
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
    // TODO: Implement register modal switch
  }
}
