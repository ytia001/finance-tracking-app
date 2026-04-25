import { Component, inject } from '@angular/core';
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
  imports: [RouterModule, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  private store = inject(Store);
  private modalService = inject(ModalService);

  sideNavOpen = true;
  isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  user = this.store.selectSignal(selectAuthUser);

  toggleSideNav(): void {
    this.sideNavOpen = !this.sideNavOpen;
  }

  handleLogoutClicked(): void {
    this.store.dispatch(AuthActions.logout());
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
