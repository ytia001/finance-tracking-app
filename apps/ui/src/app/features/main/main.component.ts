import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderComponent } from './header/header.component';
import { MainActions } from '../../core/store/actions/main.actions';
import { AuthActions } from '../../core/store/actions/auth.actions';
import { selectIsAuthenticated, selectAuthUser } from '../../core/store/selectors/auth.selector';
import { ModalService } from '../../core/services/modal.service';
import { LoginModalComponent } from '../auth/login/login-modal.component';
import { UntilDestroy } from '@ngneat/until-destroy';

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
  private modalService = inject(ModalService);

  isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  user = this.store.selectSignal(selectAuthUser);

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
    this.modalService.openModal(LoginModalComponent);
  }
}