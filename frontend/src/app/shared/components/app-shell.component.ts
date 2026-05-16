import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-[#F5EBE6] dark:bg-[#1C1612]">
      <app-sidebar [collapsed]="sidebarCollapsed"></app-sidebar>
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <app-navbar
          [user]="user"
          [pageTitle]="pageTitle"
          (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed"
        ></app-navbar>
        <main class="flex-1 overflow-y-auto">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `
})
export class AppShellComponent implements OnInit {
  @Input() pageTitle = '';
  sidebarCollapsed = false;
  user: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.user = u);
  }
}
