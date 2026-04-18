import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderComponent } from './header/header.component';
import { MainActions } from '../../core/store/actions/main.actions';
import { AuthActions } from '../../core/store/actions/auth.actions';
import { selectIsAuthenticated } from '../../core/store/selectors/auth.selector';
import { LoginModalComponent } from '../auth/login/login-modal.component';
import { RegisterModalComponent } from '../auth/login/register-modal.component';
import { ModalConstants } from '../../core/constants/Modal';

type AuthModalDialog = LoginModalComponent | RegisterModalComponent;

@Component({
  selector: 'app-main',
  imports: [RouterModule, MatSidenavModule, MatButtonModule, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  @ViewChild('sidenav') sideNavComp!: MatSidenav;

  private store = inject(Store);
  private dialog = inject(MatDialog);

  isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  private currentDialogRef: MatDialogRef<AuthModalDialog> | null = null;

  toggleSideNav(): void {
    this.sideNavComp.toggle();
  }

  handleAddFinanceClicked(): void {
    const authenticated = this.isAuthenticated();
    if (authenticated) {
      this.store.dispatch(MainActions.openAddDataEntryModal());
    }
  }

  handleSignInClicked(): void {
    const authenticated = this.isAuthenticated();
    if (authenticated) {
      this.store.dispatch(AuthActions.logout());
    } else {
      this.openLoginModal();
    }
  }

  openLoginModal(): void {
    this.closeCurrentDialog();
    const dialogRef = this.dialog.open(
      LoginModalComponent,
      ModalConstants.AUTH_MODAL_CONFIG,
    );

    this.currentDialogRef = dialogRef;

    dialogRef.componentInstance.switchToRegister.subscribe(() => {
      this.openRegisterModal();
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'register') {
        this.openRegisterModal();
      }
    });
  }

  openRegisterModal(): void {
    this.closeCurrentDialog();
    const dialogRef = this.dialog.open(
      RegisterModalComponent,
      ModalConstants.AUTH_MODAL_CONFIG,
    );

    this.currentDialogRef = dialogRef;

    dialogRef.componentInstance.switchToLogin.subscribe(() => {
      this.openLoginModal();
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'login') {
        this.openLoginModal();
      }
    });
  }

  switchToRegisterModal(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close('register');
    }
  }

  switchToLoginModal(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close('login');
    }
  }

  private closeCurrentDialog(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = null;
    }
  }
}
