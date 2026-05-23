import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppShellComponent } from '../../../shared/components/app-shell.component';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, AppShellComponent],
  template: `
    <app-shell pageTitle="Perfil">
      <div class="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 animate-fade-up">
        <div class="card-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-[#0F172A] dark:bg-[#166534] text-[#F7FFF9] dark:text-[#F8FAFC] flex items-center justify-center text-2xl font-bold">
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">{{ user?.full_name || 'Usuario' }}</h1>
            <p class="text-sm text-[#334155] truncate">{{ user?.email }}</p>
          </div>
          <span class="px-2.5 py-1 rounded-full border border-[#DCFCE7] dark:border-[#14532D] text-xs font-medium text-[#334155]">
            {{ user?.role === 'admin' ? t('Administrador', 'Administrator') : t('Usuario', 'User') }}
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section class="lg:col-span-2 card-white p-5 space-y-4">
            <div>
              <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{{ t('Dados da conta', 'Account data') }}</h2>
              <p class="text-xs text-[#334155] mt-1">{{ t('Informacoes basicas usadas no perfil e nos registros.', 'Basic information used in profile and records.') }}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label">{{ t('Nome', 'Name') }}</label>
                <input [(ngModel)]="profile.full_name" class="input-field text-sm" />
              </div>
              <div>
                <label class="label">{{ t('Email', 'Email') }}</label>
                <input [(ngModel)]="profile.email" class="input-field text-sm" disabled />
              </div>
              <div>
                <label class="label">{{ t('Telefone', 'Phone') }}</label>
                <input [(ngModel)]="profile.phone" class="input-field text-sm" [placeholder]="t('Opcional', 'Optional')" />
              </div>
              <div>
                <label class="label">{{ t('Moeda', 'Currency') }}</label>
                <select [(ngModel)]="profile.currency" class="input-field text-sm">
                  <option value="BRL">BRL - Real</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - Dollar</option>
                </select>
              </div>
            </div>
            <button (click)="saveLocalProfile()" class="btn-primary text-sm">Salvar preferencias locais</button>
          </section>

          <aside class="card-white p-5 space-y-5">
            <div>
              <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Preferencias</h2>
              <p class="text-xs text-[#334155] mt-1">Tema e idioma sao aplicados imediatamente.</p>
            </div>
            <div class="space-y-3">
              <button (click)="themeService.toggleTheme()" class="w-full btn-secondary text-sm justify-between">
                <span>{{ t('Tema', 'Theme') }}</span>
                <span>{{ isDark ? t('Escuro', 'Dark') : t('Claro', 'Light') }}</span>
              </button>
              <button (click)="i18nService.toggleLanguage()" class="w-full btn-secondary text-sm justify-between">
                <span>{{ t('Idioma', 'Language') }}</span>
                <span>{{ currentLang === 'pt' ? 'PT' : 'EN' }}</span>
              </button>
            </div>
          </aside>
        </div>

        <section class="card-white p-5 space-y-4">
          <div>
            <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{{ t('Seguranca', 'Security') }}</h2>
            <p class="text-xs text-[#334155] mt-1">{{ t('Area reservada para troca de senha quando o endpoint estiver disponivel.', 'Reserved area for password change when endpoint is available.') }}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="password" class="input-field text-sm" [placeholder]="t('Senha atual', 'Current password')" disabled />
            <input type="password" class="input-field text-sm" [placeholder]="t('Nova senha', 'New password')" disabled />
            <input type="password" class="input-field text-sm" [placeholder]="t('Confirmar senha', 'Confirm password')" disabled />
          </div>
        </section>
      </div>
    </app-shell>
  `
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isDark = false;
  currentLang = 'pt';
  profile = { full_name: '', email: '', phone: '', currency: 'BRL' };

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
    public i18nService: I18nService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    const saved = JSON.parse(localStorage.getItem('profile_preferences') || '{}');
    this.profile = {
      full_name: this.user?.full_name || '',
      email: this.user?.email || '',
      phone: saved.phone || '',
      currency: saved.currency || 'BRL'
    };
    this.themeService.darkMode$.subscribe(dark => this.isDark = dark);
    this.i18nService.language$.subscribe(lang => this.currentLang = lang);
  }

  get initials(): string {
    return (this.user?.full_name || 'U').split(' ').slice(0, 2).map((p: string) => p.charAt(0).toUpperCase()).join('');
  }

  saveLocalProfile(): void {
    localStorage.setItem('profile_preferences', JSON.stringify({
      phone: this.profile.phone,
      currency: this.profile.currency
    }));
  }

  t(pt: string, en: string): string {
    return this.currentLang === 'pt' ? pt : en;
  }
}

