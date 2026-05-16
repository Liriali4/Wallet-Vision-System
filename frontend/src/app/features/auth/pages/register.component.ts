import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F5EBE6] flex">
      <!-- Left panel -->
      <div class="hidden lg:flex lg:w-1/2 bg-[#3D312A] flex-col justify-between p-12">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-[#F5EBE6]/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-[#F5EBE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
            </svg>
          </div>
          <span class="font-semibold text-sm text-[#F5EBE6] tracking-tight">Wallet Vision</span>
        </div>
        <div>
          <h2 class="text-3xl font-bold text-[#F5EBE6] leading-tight mb-4">Comece a controlar suas finanças hoje</h2>
          <ul class="space-y-3">
            <li *ngFor="let b of benefits" class="flex items-center gap-3 text-sm text-[#EAD5C9]">
              <svg class="w-4 h-4 text-[#A3B19B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {{ b }}
            </li>
          </ul>
        </div>
        <p class="text-xs text-[#8C7365]">Sem cartão de crédito. Cancele quando quiser.</p>
      </div>

      <!-- Right panel -->
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="w-full max-w-sm">
          <div class="mb-8">
            <a routerLink="/" class="flex items-center gap-2 mb-8 lg:hidden">
              <div class="w-6 h-6 rounded-md bg-[#3D312A] flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-[#F5EBE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
                </svg>
              </div>
              <span class="font-semibold text-sm text-[#3D312A]">Wallet Vision</span>
            </a>
            <h1 class="text-2xl font-bold text-[#3D312A] tracking-tight">Criar conta</h1>
            <p class="text-sm text-[#8C7365] mt-1">Gratuito para sempre. Sem cartão de crédito.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            <div>
              <label class="label">Nome completo</label>
              <input type="text" formControlName="fullName" placeholder="João Silva" class="input-field"
                [class.border-[#D98A74]]="form.get('fullName')?.invalid && form.get('fullName')?.touched" />
              <p *ngIf="form.get('fullName')?.invalid && form.get('fullName')?.touched" class="text-xs text-[#D98A74] mt-1">Nome obrigatório (mín. 3 caracteres)</p>
            </div>

            <div>
              <label class="label">E-mail</label>
              <input type="email" formControlName="email" placeholder="seu&#64;email.com" class="input-field"
                [class.border-[#D98A74]]="form.get('email')?.invalid && form.get('email')?.touched" />
              <p *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="text-xs text-[#D98A74] mt-1">E-mail inválido</p>
            </div>

            <div>
              <label class="label">Senha</label>
              <div class="relative">
                <input [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="Mínimo 8 caracteres" class="input-field pr-10"
                  [class.border-[#D98A74]]="form.get('password')?.invalid && form.get('password')?.touched" />
                <button type="button" (click)="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7365] hover:text-[#3D312A] transition">
                  <svg *ngIf="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg *ngIf="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
              <p *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="text-xs text-[#D98A74] mt-1">Mínimo 8 caracteres</p>
            </div>

            <div>
              <label class="label">Confirmar senha</label>
              <input [type]="showPassword ? 'text' : 'password'" formControlName="confirmPassword" placeholder="Repita a senha" class="input-field"
                [class.border-[#D98A74]]="form.get('confirmPassword')?.touched && form.hasError('mismatch')" />
              <p *ngIf="form.get('confirmPassword')?.touched && form.hasError('mismatch')" class="text-xs text-[#D98A74] mt-1">As senhas não coincidem</p>
            </div>

            <div *ngIf="error" class="px-3 py-2.5 rounded-lg bg-[rgba(217,138,116,0.10)] border border-[rgba(217,138,116,0.25)] text-sm text-[#B85C3E]">
              {{ error }}
            </div>

            <button type="submit" [disabled]="form.invalid || loading" class="btn-primary w-full py-2.5 text-sm mt-2">
              <svg *ngIf="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading ? 'Criando conta...' : 'Criar conta' }}
            </button>
          </form>

          <p class="text-center text-sm text-[#8C7365] mt-6">
            Já tem conta?
            <a routerLink="/auth/login" class="text-[#3D312A] font-medium hover:underline">Entrar</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  benefits = [
    'Dashboard completo com visão geral',
    'Categorias e metas personalizadas',
    'Relatórios e gráficos detalhados',
    'Modo escuro elegante',
    'Dados seguros e privados',
  ];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password, fullName } = this.form.value;
    this.authService.register(email, password, fullName).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e: any) => { this.loading = false; this.error = e.message || 'Erro ao criar conta'; }
    });
  }
}
