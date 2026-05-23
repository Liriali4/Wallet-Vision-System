import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F7FFF9] flex items-center justify-center p-6">
      <div class="w-full max-w-md rounded-2xl border border-[#DCFCE7] bg-white p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-[#0F172A]">Nova senha</h1>
        <p class="text-sm text-[#334155] mt-2">Defina sua nova senha para acessar sua conta.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4 mt-6">
          <div>
            <label class="label">Nova senha</label>
            <input type="password" formControlName="password" class="input-field" placeholder="MÃ­nimo 8 caracteres" />
          </div>
          <div>
            <label class="label">Confirmar senha</label>
            <input type="password" formControlName="confirmPassword" class="input-field" placeholder="Repita a senha" />
          </div>
          <div *ngIf="error" class="text-sm text-[#15803D] bg-[rgba(22,163,74,0.10)] border border-[rgba(22,163,74,0.25)] rounded-lg px-3 py-2">{{ error }}</div>
          <button type="submit" class="btn-primary w-full py-2.5" [disabled]="form.invalid || loading">{{ loading ? 'Salvando...' : 'Redefinir senha' }}</button>
        </form>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
  form: FormGroup;
  token = '';
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  submit(): void {
    if (this.form.invalid) return;
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.error = 'As senhas nÃ£o coincidem.';
      return;
    }
    if (!this.token) {
      this.error = 'Token invÃ¡lido.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.authService.resetPassword(this.token, this.form.value.password).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: (e: Error) => {
        this.loading = false;
        this.error = e.message;
      }
    });
  }
}

