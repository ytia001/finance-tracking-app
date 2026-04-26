import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  tooltip: string;
  showTooltip?: boolean;
}

@Component({
  selector: 'app-sidebar-item',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterModule],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.scss',
})
export class SidebarItemComponent {
  @Input() item!: NavItem;
}
