import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidebarItemComponent } from '../../shared/sidebar/sidebar-item/sidebar-item.component';
import { MainActions } from '../../core/store/actions/main.actions';
import { AuthActions } from '../../core/store/actions/auth.actions';
import { selectIsAuthenticated, selectAuthUser } from '../../core/store/selectors/auth.selector';
import { ModalService } from '../../core/services/modal.service';
import { LoginModalComponent } from '../auth/login/login-modal.component';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TooltipMessage } from '../../core/constants/Tooltip';
import { SIDEBAR_NAV_ITEMS } from '../../core/constants/Navigation';

@UntilDestroy({ arrayName: 'subscriptions' })
@Component({
  selector: 'app-main',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SidebarItemComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  @ViewChild('sidenav') sideNavComp!: MatSidenav;

  private store = inject(Store);
  private modalService = inject(ModalService);

  isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  user = this.store.selectSignal(selectAuthUser);

  toolTip = TooltipMessage.SIDEBAR;
  navItems = SIDEBAR_NAV_ITEMS;

  get addButtonDisabled(): boolean {
    return !this.isAuthenticated();
  }

  handleLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  handleAddFinanceClicked(): void {
    this.store.dispatch(MainActions.openAddDataEntryModal());
  }

  handleSignInClicked(): void {
    this.modalService.openModal(LoginModalComponent);
  }
}
