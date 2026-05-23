import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';

interface NavItem {
  label: string;
  labelEn: string;
  route: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside
      class="flex flex-col h-screen sticky top-0 border-r transition-all duration-300 z-50"
      [class]="getSidebarClasses()"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 h-14 border-b flex-shrink-0" [class]="getHeaderBorderClass()">
        <div class="w-7 h-7 rounded-lg bg-[var(--wv-accent-primary)] flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
          </svg>
        </div>
        <span *ngIf="!collapsed" class="text-sm font-semibold text-[var(--wv-text-primary)] tracking-tight">
          Wallet Vision
        </span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <ng-container *ngFor="let item of navItems">
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: !!item.exact }"
            class="sidebar-link"
            [class]="getLinkClasses()"
            [title]="collapsed ? t(item.label, item.labelEn) : ''"
          >
            <span class="flex-shrink-0 w-5 h-5" [innerHTML]="item.icon"></span>
            <span *ngIf="!collapsed" class="truncate">{{ t(item.label, item.labelEn) }}</span>
          </a>
        </ng-container>
      </nav>

      <!-- Footer -->
      <div class="border-t p-2 flex-shrink-0" [class]="getHeaderBorderClass()">
        <button
          (click)="logout()"
          class="sidebar-link w-full text-[var(--wv-danger)] hover:!text-[var(--wv-danger)] hover:!bg-[var(--wv-danger-bg)]"
          [class]="getLinkClasses()"
          [title]="collapsed ? t('Sair', 'Logout') : ''"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span *ngIf="!collapsed">{{ t('Sair', 'Logout') }}</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Input() isOpen = false;
  @Input() isMobile = false;
  @Output() close = new EventEmitter<void>();

  navItems: NavItem[] = [
    {
      label: 'Dashboard', labelEn: 'Dashboard', route: '/dashboard', exact: true,
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>`
    },
    {
      label: 'Transações', labelEn: 'Transactions', route: '/transactions',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>`
    },
    {
      label: 'Categorias', labelEn: 'Categories', route: '/categories',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>`
    },
    {
      label: 'Metas', labelEn: 'Goals', route: '/goals',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>`
    },
  ];

  constructor(private authService: AuthService, public i18n: I18nService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'admin') {
      this.navItems.push({
        label: 'Admin', labelEn: 'Admin', route: '/admin',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>`
      });
    }
  }

  getSidebarClasses(): string {
    const base = 'bg-[var(--wv-surface)] border-[var(--wv-border-light)]';
    
    if (this.isMobile) {
      return this.isOpen 
        ? `${base} w-[220px] translate-x-0 shadow-xl`
        : `${base} w-[220px] -translate-x-full absolute`;
    }
    
    return this.collapsed
      ? `${base} w-[60px]`
      : `${base} w-[220px]`;
  }

  getHeaderBorderClass(): string {
    return 'border-[var(--wv-border-light)]';
  }

  getLinkClasses(): string {
    return '';
  }

  closeSidebar(): void {
    this.close.emit();
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

  t(pt: string, en: string): string {
    return this.i18n.getLanguage() === 'pt' ? pt : en;
  }
}
