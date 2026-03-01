import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { Store } from '@ngrx/store';
import { MainActions } from '../../core/store/actions/main.actions';

@Component({
  selector: 'app-main',
  imports: [RouterModule, MatSidenavModule, MatButtonModule, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  @ViewChild('sidenav') sideNavComp!: MatSidenav;

  private store = inject(Store);

  toggleSideNav(): void {
    this.sideNavComp.toggle();
  }

  handleAddFinanceClicked(): void {
    this.store.dispatch(MainActions.openAddDataEntryModal());
  }
}
