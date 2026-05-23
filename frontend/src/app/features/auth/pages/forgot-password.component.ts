import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F7FFF9] flex items-center justify-center p-6">
      <div class="w-full max-w-md rounded-2xl border border-[#DCFCE7] bg-white p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-[#0F172A]">Recuperar senha</h1>
        <p class="text-sm text-[#334155] mt-2">Informe seu e-mail para receber o link de redefinicao.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4 mt-6">
          <div>
            <label class="label">E-mail</label>
            <input type="email" formControlName="email" class="input-field" placeholder="seu@email.com" />
          </div>
          <div *ngIf="message" class="text-sm text-[#0F172A] bg-[#DCFCE7]/50 border border-[#BBF7D0] rounded-lg px-3 py-2">{{ message }}</div>
          <div *ngIf="resetLink" class="text-sm text-[#0F172A] bg-[#DCFCE7]/40 border border-[#BBF7D0] rounded-lg px-3 py-2">
            Ambiente de desenvolvimento: <a [href]="resetLink" class="underline font-medium break-all">{{ resetLink }}</a>
          </div>
          <div *ngIf="error" class="text-sm text-[#15803D] bg-[rgba(22,163,74,0.10)] border border-[rgba(22,163,74,0.25)] rounded-lg px-3 py-2">{{ error }}</div>
          <button type="submit" class="btn-primary w-full py-2.5" [disabled]="form.invalid || loading">{{ loading ? 'Enviando...' : 'Enviar link' }}</button>
        </form>

        <a routerLink="/auth/login" class="text-sm text-[#334155] hover:text-[#0F172A] mt-5 inline-block">Voltar para login</a>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  message = '';
  error = '';
  resetLink = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.message = '';
    this.resetLink = '';

    this.authService.requestPasswordReset(this.form.value.email).subscribe({
      next: (data) => {
        this.loading = false;
        this.message = 'Se o e-mail existir, voce recebera as instrucoes em instantes.';
        if (data?.reset_url) {
          this.resetLink = data.reset_url;
        }
      },
      error: (e: Error) => {
        this.loading = false;
        this.error = e.message;
      }
    });
  }
}

