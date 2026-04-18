import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { Store } from '@ngrx/store';
import { MainActions } from '../../core/store/actions/main.actions';
import { AuthActions } from '../../core/store/actions/auth.actions';
import { selectIsAuthenticated } from '../../core/store/selectors/auth.selector';
import { LoginModalComponent } from '../auth/login/login-modal.component';
import { ModalConstants } from '../../core/constants/Modal';

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
      this.dialog.open(LoginModalComponent, {
        width: ModalConstants.LOGIN_MODAL_WIDTH_PERCENTAGE,
        maxWidth: ModalConstants.LOGIN_MODAL_MAX_WIDTH,
        disableClose: true,
      });
    }
  }
}
