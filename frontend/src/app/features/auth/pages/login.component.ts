import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F7FFF9] dark:bg-[#000000] flex">
      <!-- Left panel -->
      <div class="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-between p-12 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" alt="Painel de gestao financeira" class="absolute inset-0 w-full h-full object-cover opacity-45" />
        <div class="absolute inset-0 bg-gradient-to-b from-[#0F172A]/35 to-[#0F172A]/72"></div>
        <div class="flex items-center gap-2 relative z-10">
          <div class="w-7 h-7 rounded-lg bg-[#F7FFF9]/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-[#F7FFF9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
            </svg>
          </div>
          <span class="font-semibold text-sm text-[#F7FFF9] tracking-tight">Wallet Vision</span>
        </div>
        <div class="relative z-10">
          <blockquote class="text-[#DCFCE7] text-xl font-light leading-relaxed mb-6">
            "Controle financeiro sem complicaÃ§Ã£o. Wallet Vision reÃºne todas as suas finanÃ§as em um sÃ³ lugar. Acompanhe gastos, defina metas e tome decisÃµes com clareza."
          </blockquote>
        </div>
        <div class="grid grid-cols-3 gap-4 relative z-10">
          <div class="rounded-lg bg-[#F7FFF9]/5 p-3 border border-[#F7FFF9]/10">
            <p class="text-lg font-bold text-[#F7FFF9]">12.000</p>
            <p class="text-xs text-[#334155]">UsuÃ¡rios</p>
          </div>
          <div class="rounded-lg bg-[#F7FFF9]/5 p-3 border border-[#F7FFF9]/10">
            <p class="text-lg font-bold text-[#F7FFF9]">Kz 2.000.000</p>
            <p class="text-xs text-[#334155]">Gerenciados</p>
          </div>
          <div class="rounded-lg bg-[#F7FFF9]/5 p-3 border border-[#F7FFF9]/10">
            <p class="text-lg font-bold text-[#F7FFF9]">4.9</p>
            <p class="text-xs text-[#334155]">AvaliaÃ§Ã£o</p>
          </div>
        </div>
      </div>

      <!-- Right panel -->
      <div class="flex-1 flex flex-col">
        <!-- Toggles row -->
        <div class="flex justify-end gap-1 p-3">
          <button
            (click)="i18n.toggleLanguage()"
            class="w-8 h-8 flex items-center justify-center rounded-md text-xs font-semibold text-[#334155] hover:bg-[#DCFCE7] dark:hover:bg-[#052E16] transition"
            [title]="i18n.getLanguage() === 'pt' ? 'Switch to English' : 'Mudar para PortuguÃªs'"
          >{{ i18n.getLanguage() === 'pt' ? 'EN' : 'PT' }}</button>
          <button
            (click)="theme.toggleTheme()"
            class="w-8 h-8 flex items-center justify-center rounded-md text-[#334155] hover:bg-[#DCFCE7] dark:hover:bg-[#052E16] transition"
            aria-label="Toggle theme"
          >
            <svg *ngIf="!isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
            <svg *ngIf="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          </button>
        </div>
        <div class="flex-1 flex items-center justify-center p-8">
        <div class="w-full max-w-sm">
          <div class="mb-8">
            <a routerLink="/" class="flex items-center gap-2 mb-8 lg:hidden">
              <div class="w-6 h-6 rounded-md bg-[#0F172A] flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-[#F7FFF9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
                </svg>
              </div>
              <span class="font-semibold text-sm text-[#0F172A]">Wallet Vision</span>
            </a>
            <h1 class="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Bem-vindo de volta</h1>
            <p class="text-sm text-[#334155] dark:text-[#94A3B8] mt-1">Entre na sua conta para continuar</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            <div>
              <label class="label">E-mail</label>
              <input
                type="email"
                formControlName="email"
                placeholder="seu&#64;email.com"
                class="input-field"
                [class.border-[#16A34A]]="form.get('email')?.invalid && form.get('email')?.touched"
              />
              <p *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="text-xs text-[#16A34A] mt-1">E-mail invÃ¡lido</p>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="label mb-0">Senha</label>
                <a routerLink="/auth/forgot-password" class="text-xs text-[#334155] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition">Esqueceu?</a>
              </div>
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  class="input-field pr-10"
                  [class.border-[#16A34A]]="form.get('password')?.invalid && form.get('password')?.touched"
                />
                <button type="button" (click)="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#334155] hover:text-[#0F172A] transition">
                  <svg *ngIf="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg *ngIf="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
              <p *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="text-xs text-[#16A34A] mt-1">Senha obrigatÃ³ria</p>
            </div>

            <div *ngIf="error" class="px-3 py-2.5 rounded-lg bg-[rgba(22,163,74,0.10)] border border-[rgba(22,163,74,0.25)] text-sm text-[#15803D]">
              {{ error }}
            </div>

            <button type="submit" [disabled]="form.invalid || loading" class="btn-primary w-full py-2.5 text-sm mt-2">
              <svg *ngIf="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>

          <p class="text-center text-sm text-[#334155] dark:text-[#94A3B8] mt-6">
            NÃ£o tem conta?
            <a routerLink="/auth/register" class="text-[#0F172A] dark:text-[#F8FAFC] font-medium hover:underline">Criar conta</a>
          </p>
        </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  isDark = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public theme: ThemeService,
    public i18n: I18nService
  ) {
    this.theme.darkMode$.subscribe(d => this.isDark = d);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value;
    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e: any) => { this.loading = false; this.error = e.message || 'Credenciais invÃ¡lidas'; }
    });
  }
}




