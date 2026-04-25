import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-header',
  imports: [TuiButton, TuiIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() isAuthenticated = false;
  @Input() userName: string | null = null;

  @Output() sideNavClicked = new EventEmitter();
  @Output() addFinanceClicked = new EventEmitter();
  @Output() signInClicked = new EventEmitter();
  @Output() logoutClicked = new EventEmitter();

  toggleSideNav(): void {
    this.sideNavClicked.emit();
  }

  clickAddFinanceButton(): void {
    this.addFinanceClicked.emit();
  }

  clickSignInButton(): void {
    this.signInClicked.emit();
  }

  handleLogout(): void {
    this.logoutClicked.emit();
  }

  get displayName(): string {
    if (this.userName) {
      return this.userName;
    }
    return 'User';
  }
}
