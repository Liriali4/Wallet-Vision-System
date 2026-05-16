import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { AppShellComponent } from '../../../shared/components/app-shell.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, AppShellComponent],
  template: `
    <app-shell pageTitle="Admin">
      <div class="p-6 max-w-6xl mx-auto space-y-6 animate-fade-up">

        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-[#3D312A] dark:text-[#F0E6DF] tracking-tight">Painel Administrativo</h1>
            <p class="text-sm text-[#8C7365] mt-0.5">Visão geral da plataforma</p>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-[rgba(217,138,116,0.12)] border border-[rgba(217,138,116,0.25)] text-xs font-medium text-[#B85C3E]">
            Admin
          </span>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div *ngFor="let stat of stats" class="card-white p-4">
            <p class="text-xs font-medium text-[#8C7365] uppercase tracking-wide mb-2">{{ stat.label }}</p>
            <ng-container *ngIf="!loading; else statSkeleton">
              <p class="text-2xl font-bold text-[#3D312A] dark:text-[#F0E6DF] tracking-tight">{{ stat.value }}</p>
              <p class="text-xs mt-1" [class]="stat.trend > 0 ? 'text-[#5C7A52]' : 'text-[#B85C3E]'">
                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% este mês
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
          <div class="flex items-center justify-between px-5 py-4 border-b border-[#EAD5C9] dark:border-[#3D312A]">
            <h2 class="text-sm font-semibold text-[#3D312A] dark:text-[#F0E6DF]">Usuários</h2>
            <span class="text-xs text-[#8C7365]">{{ users.length }} registrados</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>E-mail</th>
                <th>Função</th>
                <th>Status</th>
                <th>Cadastro</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="!loading; else loadingRows">
                <tr *ngIf="users.length === 0">
                  <td colspan="5" class="text-center py-8 text-[#8C7365]">Nenhum usuário encontrado</td>
                </tr>
                <tr *ngFor="let u of users">
                  <td>
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-[#EAD5C9] dark:bg-[#3D312A] flex items-center justify-center text-xs font-semibold text-[#3D312A] dark:text-[#F0E6DF]">
                        {{ u.full_name?.charAt(0)?.toUpperCase() }}
                      </div>
                      <span class="font-medium text-[#3D312A] dark:text-[#F0E6DF]">{{ u.full_name }}</span>
                    </div>
                  </td>
                  <td class="text-[#8C7365]">{{ u.email }}</td>
                  <td>
                    <span class="text-xs px-2 py-0.5 rounded-full"
                      [class]="u.role === 'admin' ? 'bg-[rgba(217,138,116,0.12)] text-[#B85C3E]' : 'bg-[#EAD5C9] text-[#8C7365]'">
                      {{ u.role === 'admin' ? 'Admin' : 'Usuário' }}
                    </span>
                  </td>
                  <td>
                    <span class="badge-positive">Ativo</span>
                  </td>
                  <td class="text-[#8C7365]">{{ u.created_at | date:'dd/MM/yyyy' }}</td>
                </tr>
              </ng-container>
              <ng-template #loadingRows>
                <tr *ngFor="let i of [1,2,3,4,5]">
                  <td><div class="flex items-center gap-2"><div class="skeleton w-7 h-7 rounded-full"></div><div class="skeleton h-3 rounded w-24"></div></div></td>
                  <td><div class="skeleton h-3 rounded w-32"></div></td>
                  <td><div class="skeleton h-5 rounded-full w-14"></div></td>
                  <td><div class="skeleton h-5 rounded-full w-12"></div></td>
                  <td><div class="skeleton h-3 rounded w-20"></div></td>
                </tr>
              </ng-template>
            </tbody>
          </table>
        </div>

      </div>
    </app-shell>
  `
})
export class AdminComponent implements OnInit {
  loading = true;
  users: any[] = [];

  stats = [
    { label: 'Total usuários', value: '—', trend: 12 },
    { label: 'Ativos hoje', value: '—', trend: 5 },
    { label: 'Transações', value: '—', trend: 8 },
    { label: 'Receita', value: '—', trend: -2 },
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getUsers().subscribe({
      next: (u: any) => {
        this.users = u?.data || u || [];
        this.stats[0].value = String(this.users.length);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
