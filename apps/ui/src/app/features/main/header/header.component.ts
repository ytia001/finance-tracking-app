import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() isAuthenticated = false;

  @Output() sideNavClicked = new EventEmitter();

  @Output() addFinanceClicked = new EventEmitter();

  @Output() signInClicked = new EventEmitter();

  toggleSideNav(): void {
    this.sideNavClicked.emit();
  }

  clickAddFinanceButton(): void {
    this.addFinanceClicked.emit();
  }

  clickSignInButton(): void {
    this.signInClicked.emit();
  }
}
