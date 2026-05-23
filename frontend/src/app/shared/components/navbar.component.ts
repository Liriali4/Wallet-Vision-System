import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';

interface User { id: number; email: string; full_name: string; role: string; }

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-14 flex items-center justify-between px-4 sm:px-5 border-b bg-[var(--wv-surface)] flex-shrink-0 z-20" [class]="getBorderClass()">
      <!-- Left -->
      <div class="flex items-center gap-2 sm:gap-3">
        <button
          (click)="toggleSidebar.emit()"
          class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--wv-hover)] transition"
          aria-label="Toggle sidebar"
        >
          <svg class="w-4 h-4 text-[var(--wv-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span class="text-sm font-medium text-[var(--wv-text-secondary)] hidden sm:block">
          {{ pageTitle }}
        </span>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-1 sm:gap-2">
        <!-- Language toggle -->
        <button
          (click)="i18nService.toggleLanguage()"
          class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--wv-hover)] transition text-xs font-semibold text-[var(--wv-text-secondary)]"
          [title]="currentLang === 'pt' ? 'Switch to English' : 'Mudar para Português'"
          aria-label="Toggle language"
        >
          {{ currentLang === 'pt' ? 'EN' : 'PT' }}
        </button>

        <!-- Theme toggle -->
        <button
          (click)="themeService.toggleTheme()"
          class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--wv-hover)] transition"
          aria-label="Toggle theme"
        >
          <svg *ngIf="!isDark" class="w-4 h-4 text-[var(--wv-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
          <svg *ngIf="isDark" class="w-4 h-4 text-[var(--wv-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </button>

        <!-- User menu -->
        <div class="relative">
          <button
            (click)="showMenu = !showMenu"
            class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--wv-hover)] transition"
          >
            <div class="w-6 h-6 rounded-full bg-[var(--wv-accent-primary)] flex items-center justify-center text-[10px] font-semibold text-white">
              {{ user?.full_name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <span class="text-sm font-medium text-[var(--wv-text-primary)] hidden sm:block max-w-[120px] truncate">
              {{ user?.full_name || 'Usuário' }}
            </span>
            <svg class="w-3.5 h-3.5 text-[var(--wv-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <div
            *ngIf="showMenu"
            class="absolute right-0 top-full mt-1 w-44 bg-[var(--wv-surface)] border border-[var(--wv-border-light)] rounded-lg shadow-lg py-1 z-50 animate-fade-in"
          >
            <div class="px-3 py-2 border-b border-[var(--wv-border-light)]">
              <p class="text-xs font-medium text-[var(--wv-text-primary)] truncate">{{ user?.full_name }}</p>
              <p class="text-xs text-[var(--wv-text-secondary)] truncate">{{ user?.email }}</p>
            </div>
            <a
              routerLink="/profile"
              (click)="showMenu = false"
              class="block px-3 py-2 text-sm text-[var(--wv-text-primary)] hover:bg-[var(--wv-hover)] transition"
            >
              {{ t('Perfil e conta', 'Profile and account') }}
            </a>
            <button
              (click)="logout(); showMenu = false"
              class="w-full text-left px-3 py-2 text-sm text-[var(--wv-danger)] hover:bg-[var(--wv-danger-bg)] transition"
            >
              {{ i18nService.t('logout') }}
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit {
  @Input() user: User | null = null;
  @Input() pageTitle = '';
  @Input() isMobile = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  isDark = false;
  showMenu = false;
  currentLang = 'pt';

  constructor(
    public themeService: ThemeService,
    public i18nService: I18nService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe(d => this.isDark = d);
    this.i18nService.language$.subscribe(lang => this.currentLang = lang);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) this.showMenu = false;
  }

  getBorderClass(): string {
    return 'border-[var(--wv-border-light)]';
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

  t(pt: string, en: string): string {
    return this.currentLang === 'pt' ? pt : en;
  }
}
