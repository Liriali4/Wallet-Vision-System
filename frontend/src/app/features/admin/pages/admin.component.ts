import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppShellComponent } from '../../../shared/components/app-shell.component';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppShellComponent],
  template: `
    <app-shell pageTitle="Admin">
      <div class="p-6 max-w-6xl mx-auto space-y-6 animate-fade-up">

        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">{{ t('Painel Administrativo', 'Admin Panel') }}</h1>
            <p class="text-sm text-[#334155] mt-0.5">{{ t('VisÃ£o geral da plataforma', 'Platform overview') }}</p>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-[rgba(22,163,74,0.12)] border border-[rgba(22,163,74,0.25)] text-xs font-medium text-[#15803D]">
            Admin
          </span>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div *ngFor="let stat of stats" class="card-white p-4">
            <p class="text-xs font-medium text-[#334155] uppercase tracking-wide mb-2">{{ stat.label }}</p>
            <ng-container *ngIf="!loading; else statSkeleton">
              <p class="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">{{ stat.value }}</p>
              <p class="text-xs mt-1" [class]="stat.trend > 0 ? 'text-[#16A34A] dark:text-[#22C55E]' : 'text-[#15803D] dark:text-[#22C55E]'">
                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% este mÃªs
              </p>
            </ng-container>
            <ng-template #statSkeleton>
              <div class="skeleton h-7 rounded w-20 mb-1"></div>
              <div class="skeleton h-3 rounded w-16"></div>
            </ng-template>
          </div>
        </div>

        <!-- Users table -->
        <div class="card-white overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-[#DCFCE7] dark:border-[#14532D]">
            <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">UsuÃ¡rios</h2>
            <span class="text-xs text-[#334155]">{{ users.length }} registrados</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>UsuÃ¡rio</th>
                <th>E-mail</th>
                <th>FunÃ§Ã£o</th>
                <th>Status</th>
                <th>Ãšltimo login</th>
                <th>Cadastro</th>
                <th>AÃ§Ãµes</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="!loading; else loadingRows">
                <tr *ngIf="users.length === 0">
                  <td colspan="7" class="text-center py-8 text-[#334155]">Nenhum usuÃ¡rio encontrado</td>
                </tr>
                <tr *ngFor="let u of users">
                  <td>
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-[#DCFCE7] dark:bg-[#166534] flex items-center justify-center text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                        {{ u.full_name?.charAt(0)?.toUpperCase() }}
                      </div>
                      <span class="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{{ u.full_name }}</span>
                    </div>
                  </td>
                  <td class="text-[#334155] dark:text-[#94A3B8]">{{ u.email }}</td>
                  <td>
                    <select [(ngModel)]="u.role" (change)="changeRole(u)" class="text-xs px-2.5 py-1.5 rounded bg-[#F0FDF4] dark:bg-[#2A251F] border border-[#86EFAC] dark:border-[#14532D] text-[#0F172A] dark:text-[#F8FAFC] cursor-pointer hover:border-[#D4BFBA] dark:hover:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent">
                      <option value="user">UsuÃ¡rio</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span [class]="u.is_active ? 'badge-positive' : 'badge-negative'">{{ u.is_active ? 'Ativo' : 'Inativo' }}</span>
                  </td>
                  <td class="text-[#334155] dark:text-[#94A3B8]">{{ u.last_login ? (u.last_login | date:'dd/MM/yyyy HH:mm') : 'Nunca' }}</td>
                  <td class="text-[#334155] dark:text-[#94A3B8]">{{ u.created_at | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <div class="flex gap-2">
                      <button (click)="toggleStatus(u)" [disabled]="isSelf(u)" class="px-2 py-1 text-xs rounded bg-[rgba(51,65,85,0.12)] text-[#334155] hover:bg-[rgba(51,65,85,0.2)] transition-colors disabled:opacity-40">
                        {{ u.is_active ? 'Suspender' : 'Ativar' }}
                      </button>
                      <button (click)="confirmDelete(u)" [disabled]="isSelf(u)" class="px-2 py-1 text-xs rounded bg-[rgba(249,115,22,0.12)] text-[#F97316] dark:text-[#FFA64D] hover:bg-[rgba(249,115,22,0.2)] transition-colors disabled:opacity-40">
                        Apagar
                      </button>
                    </div>
                  </td>
                </tr>
              </ng-container>
              <ng-template #loadingRows>
                <tr *ngFor="let i of [1,2,3,4,5]">
                  <td><div class="flex items-center gap-2"><div class="skeleton w-7 h-7 rounded-full"></div><div class="skeleton h-3 rounded w-24"></div></div></td>
                  <td><div class="skeleton h-3 rounded w-32"></div></td>
                  <td><div class="skeleton h-6 rounded w-24"></div></td>
                  <td><div class="skeleton h-5 rounded-full w-12"></div></td>
                  <td><div class="skeleton h-3 rounded w-20"></div></td>
                  <td><div class="skeleton h-3 rounded w-20"></div></td>
                  <td><div class="skeleton h-6 rounded w-16"></div></td>
                </tr>
              </ng-template>
            </tbody>
          </table>
        </div>

      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white dark:bg-[#2A251F] rounded-lg shadow-lg max-w-sm w-full mx-4 animate-scale-in">
          <div class="p-6 border-b border-[#DCFCE7] dark:border-[#14532D]">
            <h3 class="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Confirmar exclusÃ£o</h3>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-[#334155] dark:text-[#94A3B8]">
              Tem certeza que deseja apagar o usuÃ¡rio <strong>{{ userToDelete?.full_name }}</strong> ({{ userToDelete?.email }})?
            </p>
            <p class="text-sm text-[#15803D]">Esta aÃ§Ã£o Ã© irreversÃ­vel e removerÃ¡ todas as transaÃ§Ãµes associadas.</p>
          </div>
          <div class="flex gap-3 p-6 border-t border-[#DCFCE7] dark:border-[#14532D]">
            <button (click)="cancelDelete()" class="flex-1 px-4 py-2 rounded-lg bg-[#F0FDF4] dark:bg-[#14532D] text-[#0F172A] dark:text-[#F8FAFC] font-medium hover:bg-[#DCFCE7] dark:hover:bg-[#166534] transition-colors">
              Cancelar
            </button>
            <button (click)="confirmDeleteAction()" class="flex-1 px-4 py-2 rounded-lg bg-[#F97316] text-white font-medium hover:bg-[#FB923C] transition-colors">
              Apagar
            </button>
          </div>
        </div>
      </div>

      <!-- Role Change Confirmation Modal -->
      <div *ngIf="showRoleConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white dark:bg-[#2A251F] rounded-lg shadow-lg max-w-sm w-full mx-4 animate-scale-in">
          <div class="p-6 border-b border-[#DCFCE7] dark:border-[#14532D]">
            <h3 class="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Alterar funÃ§Ã£o</h3>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-[#334155] dark:text-[#94A3B8]">
              Alterar funÃ§Ã£o de <strong>{{ userToChangeRole?.full_name }}</strong> para <strong>{{ newRole === 'admin' ? 'Admin' : 'UsuÃ¡rio' }}</strong>?
            </p>
            <p class="text-sm text-[#334155] dark:text-[#94A3B8]">
              {{ newRole === 'admin' ? 'Esse usuÃ¡rio terÃ¡ acesso ao painel administrativo.' : 'Esse usuÃ¡rio perderÃ¡ acesso ao painel administrativo.' }}
            </p>
          </div>
          <div class="flex gap-3 p-6 border-t border-[#DCFCE7] dark:border-[#14532D]">
            <button (click)="cancelRoleChange()" class="flex-1 px-4 py-2 rounded-lg bg-[#F0FDF4] dark:bg-[#14532D] text-[#0F172A] dark:text-[#F8FAFC] font-medium hover:bg-[#DCFCE7] dark:hover:bg-[#166534] transition-colors">
              Cancelar
            </button>
            <button (click)="confirmRoleChange()" class="flex-1 px-4 py-2 rounded-lg bg-[#16A34A] text-white font-medium hover:bg-[#22C55E] transition-colors">
              Confirmar
            </button>
          </div>
        </div>
      </div>

    </app-shell>
  `
})
export class AdminComponent implements OnInit {
  currentLang = 'pt';
  loading = true;
  users: any[] = [];
  showDeleteConfirm = false;
  showRoleConfirm = false;
  userToDelete: any = null;
  userToChangeRole: any = null;
  newRole: string = '';
  originalRole: string = '';

  stats = [
    { label: 'Total usuÃ¡rios', value: 'â€”', trend: 12 },
    { label: 'Ativos hoje', value: 'â€”', trend: 5 },
    { label: 'TransaÃ§Ãµes', value: 'â€”', trend: 8 },
    { label: 'Receita', value: 'â€”', trend: -2 },
  ];

  currentUserId: number | null = null;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.i18n.language$.subscribe(lang => this.currentLang = lang);
    this.currentUserId = this.authService.getCurrentUser()?.id || null;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.adminService.getUsers(1, 100).subscribe({
      next: (u: any) => {
        this.users = u?.data || u || [];
        this.stats[0].value = String(this.users.length);
        this.stats[1].value = String(this.users.filter(user => user.is_active).length);
        this.adminService.getStatistics().subscribe({
          next: (stats: any) => {
            const data = stats?.data || stats || {};
            this.stats[0].value = String(data.total_users ?? this.users.length);
            this.stats[1].value = String(data.active_users ?? this.users.filter(user => user.is_active).length);
            this.stats[2].value = String(data.total_transactions ?? 'â€”');
          }
        });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  changeRole(user: any): void {
    if (this.isSelf(user)) return;
    this.userToChangeRole = user;
    this.newRole = user.role;
    this.originalRole = user.role === 'admin' ? 'user' : 'admin';
    this.showRoleConfirm = true;
  }

  isSelf(user: any): boolean {
    return Number(user?.id) === Number(this.currentUserId);
  }

  toggleStatus(user: any): void {
    if (this.isSelf(user)) return;
    const request = user.is_active ? this.adminService.deactivateUser(user.id) : this.adminService.activateUser(user.id);
    request.subscribe({ next: () => this.load() });
  }

  cancelRoleChange(): void {
    if (this.userToChangeRole) {
      this.userToChangeRole.role = this.originalRole;
    }
    this.showRoleConfirm = false;
    this.userToChangeRole = null;
    this.newRole = '';
  }

  confirmRoleChange(): void {
    if (!this.userToChangeRole) return;

    this.adminService.updateUserRole(this.userToChangeRole.id, this.newRole).subscribe({
      next: () => {
        this.showRoleConfirm = false;
        this.userToChangeRole = null;
        this.load();
      },
      error: (err: any) => {
        alert('Erro ao alterar funÃ§Ã£o: ' + (err.error?.message || err.message));
        if (this.userToChangeRole) {
          this.userToChangeRole.role = this.originalRole;
        }
        this.showRoleConfirm = false;
      }
    });
  }

  confirmDelete(user: any): void {
    if (this.isSelf(user)) return;
    this.userToDelete = user;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.userToDelete = null;
  }

  confirmDeleteAction(): void {
    if (!this.userToDelete) return;

    this.adminService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.userToDelete = null;
        this.load();
      },
      error: (err: any) => {
        alert('Erro ao apagar usuÃ¡rio: ' + (err.error?.message || err.message));
        this.showDeleteConfirm = false;
      }
    });
  }

  t(pt: string, en: string): string {
    return this.currentLang === 'pt' ? pt : en;
  }
}


