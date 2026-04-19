import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
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
