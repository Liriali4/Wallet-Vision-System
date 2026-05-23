import { Component, Input, OnInit, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-[var(--wv-bg)]">
      <!-- Mobile sidebar overlay -->
      <div 
        *ngIf="sidebarOpen && isMobile" 
        class="fixed inset-0 z-40 bg-black/50 lg:hidden"
        (click)="closeSidebar()"
      ></div>
      
      <!-- Sidebar -->
      <app-sidebar 
        [collapsed]="sidebarCollapsed" 
        [isOpen]="sidebarOpen"
        [isMobile]="isMobile"
        (close)="closeSidebar()"
      ></app-sidebar>
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <app-navbar
          [user]="user"
          [pageTitle]="translatedPageTitle"
          [isMobile]="isMobile"
          (toggleSidebar)="toggleSidebar()"
        ></app-navbar>
        <main class="flex-1 overflow-y-auto">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `
})
export class AppShellComponent implements OnInit, OnChanges {
  @Input() pageTitle = '';
  
  sidebarCollapsed = false;
  sidebarOpen = false;
  isMobile = false;
  user: any = null;
  translatedPageTitle = '';

  constructor(private authService: AuthService, private i18n: I18nService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.user = u);
    this.i18n.language$.subscribe(() => this.updatePageTitle());
    this.updatePageTitle();
    this.checkScreenSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageTitle']) this.updatePageTitle();
  }

  private updatePageTitle(): void {
    const isPt = this.i18n.getLanguage() === 'pt';
    const map: Record<string, string> = {
      'Dashboard': 'dashboard',
      'Transações': 'transactions',
      'TransaÃ§Ãµes': 'transactions',
      'Transactions': 'transactions',
      'Categorias': 'categories',
      'Categories': 'categories',
      'Metas': 'goals',
      'Goals': 'goals',
      'Admin': 'admin',
      'Perfil': 'profile',
      'Profile': 'profile'
    };
    const key = map[this.pageTitle];
    if (!key) {
      this.translatedPageTitle = this.pageTitle;
      return;
    }
    if (key === 'admin') {
      this.translatedPageTitle = isPt ? 'Administração' : 'Admin';
      return;
    }
    if (key === 'profile') {
      this.translatedPageTitle = isPt ? 'Perfil' : 'Profile';
      return;
    }
    this.translatedPageTitle = this.i18n.t(key);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1024;
    
    // Auto-collapse sidebar on mobile
    if (this.isMobile) {
      this.sidebarCollapsed = true;
      this.sidebarOpen = false;
    } else {
      // On desktop, close mobile sidebar
      this.sidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.sidebarOpen = !this.sidebarOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}

