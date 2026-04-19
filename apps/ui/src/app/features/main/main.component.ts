import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderComponent } from './header/header.component';
import { MainActions } from '../../core/store/actions/main.actions';
import { AuthActions } from '../../core/store/actions/auth.actions';
import { selectIsAuthenticated, selectAuthUser } from '../../core/store/selectors/auth.selector';
import { LoginModalComponent } from '../auth/login/login-modal.component';
import { RegisterModalComponent } from '../auth/login/register-modal.component';
import { ModalConstants } from '../../core/constants/Modal';
import { Subscription } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

type AuthModalDialog = LoginModalComponent | RegisterModalComponent;

@UntilDestroy({ arrayName: 'subscriptions' })
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
  user = this.store.selectSignal(selectAuthUser);
  private currentDialogRef: MatDialogRef<AuthModalDialog> | null = null;
  private subscriptions: Subscription[] = [];

  handleLogoutClicked(): void {
    this.store.dispatch(AuthActions.logout());
  }

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
    const dialogRef = this.dialog.open(LoginModalComponent, ModalConstants.AUTH_MODAL_CONFIG);

    this.currentDialogRef = dialogRef;

    const switchSub = dialogRef.componentInstance.switchToRegister.subscribe(() => {
      this.openRegisterModal();
    });
    this.subscriptions.push(switchSub);

    const closeSub = dialogRef.afterClosed().subscribe((result) => {
      if (result === 'register') {
        this.openRegisterModal();
      }
    });
    this.subscriptions.push(closeSub);
  }

  openRegisterModal(): void {
    this.closeCurrentDialog();
    const dialogRef = this.dialog.open(RegisterModalComponent, ModalConstants.AUTH_MODAL_CONFIG);

    this.currentDialogRef = dialogRef;

    const switchSub = dialogRef.componentInstance.switchToLogin.subscribe(() => {
      this.openLoginModal();
    });
    this.subscriptions.push(switchSub);

    const closeSub2 = dialogRef.afterClosed().subscribe((result) => {
      if (result === 'login') {
        this.openLoginModal();
      }
    });
    this.subscriptions.push(closeSub2);
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
