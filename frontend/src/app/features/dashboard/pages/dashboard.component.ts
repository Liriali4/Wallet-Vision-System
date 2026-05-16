import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { GoalService } from '../../../core/services/goal.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppShellComponent } from '../../../shared/components/app-shell.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AppShellComponent, CurrencyPipe],
  template: `
    <app-shell pageTitle="Dashboard">
      <div class="p-6 max-w-6xl mx-auto space-y-6 animate-fade-up">

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Balance -->
          <div class="card-white p-5">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs font-medium text-[#8C7365] uppercase tracking-wide">Saldo</p>
              <div class="w-7 h-7 rounded-md bg-[#EAD5C9] dark:bg-[#3D312A] flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-[#3D312A] dark:text-[#F0E6DF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
                </svg>
              </div>
            </div>
            <ng-container *ngIf="!loading; else skeletonTpl">
              <p class="text-2xl font-bold text-[#3D312A] dark:text-[#F0E6DF] tracking-tight">
                {{ balance.balance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
              </p>
              <p class="text-xs text-[#8C7365] mt-1">Este mês</p>
            </ng-container>
          </div>

          <!-- Income -->
          <div class="card-white p-5">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs font-medium text-[#8C7365] uppercase tracking-wide">Receitas</p>
              <div class="w-7 h-7 rounded-md bg-[rgba(163,177,155,0.15)] flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-[#5C7A52]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                </svg>
              </div>
            </div>
            <ng-container *ngIf="!loading; else skeletonTpl">
              <p class="text-2xl font-bold text-[#5C7A52] dark:text-[#A3B19B] tracking-tight">
                {{ balance.income | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
              </p>
              <p class="text-xs text-[#8C7365] mt-1">Entradas</p>
            </ng-container>
          </div>

          <!-- Expenses -->
          <div class="card-white p-5">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs font-medium text-[#8C7365] uppercase tracking-wide">Despesas</p>
              <div class="w-7 h-7 rounded-md bg-[rgba(217,138,116,0.12)] flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-[#B85C3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
            </div>
            <ng-container *ngIf="!loading; else skeletonTpl">
              <p class="text-2xl font-bold text-[#B85C3E] dark:text-[#D98A74] tracking-tight">
                {{ balance.expense | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
              </p>
              <p class="text-xs text-[#8C7365] mt-1">Saídas</p>
            </ng-container>
          </div>
        </div>

        <!-- Main grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <!-- Recent transactions -->
          <div class="lg:col-span-2 card-white">
            <div class="flex items-center justify-between px-5 py-4 border-b border-[#EAD5C9] dark:border-[#3D312A]">
              <h2 class="text-sm font-semibold text-[#3D312A] dark:text-[#F0E6DF]">Transações recentes</h2>
              <a routerLink="/transactions" class="text-xs text-[#8C7365] hover:text-[#3D312A] dark:hover:text-[#F0E6DF] transition">Ver todas</a>
            </div>
            <div class="divide-y divide-[#F0DDD5] dark:divide-[#2A211B]">
              <ng-container *ngIf="!loading; else transactionSkeletons">
                <div *ngIf="transactions.length === 0" class="px-5 py-10 text-center">
                  <p class="text-sm text-[#8C7365]">Nenhuma transação registrada</p>
                  <a routerLink="/transactions" class="btn-primary text-xs px-3 py-1.5 mt-3 inline-flex">Adicionar transação</a>
                </div>
                <div *ngFor="let t of transactions" class="flex items-center gap-3 px-5 py-3 hover:bg-[#F5EBE6] dark:hover:bg-[#2A211B] transition">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    [class]="t.type === 'income' ? 'bg-[rgba(163,177,155,0.15)]' : 'bg-[rgba(217,138,116,0.12)]'">
                    <svg class="w-4 h-4" [class]="t.type === 'income' ? 'text-[#5C7A52]' : 'text-[#B85C3E]'" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path *ngIf="t.type === 'income'" stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                      <path *ngIf="t.type === 'expense'" stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-[#3D312A] dark:text-[#F0E6DF] truncate">{{ t.category_name || t.description }}</p>
                    <p class="text-xs text-[#8C7365] truncate">{{ t.description }}</p>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <p class="text-sm font-semibold" [class]="t.type === 'income' ? 'text-[#5C7A52] dark:text-[#A3B19B]' : 'text-[#B85C3E] dark:text-[#D98A74]'">
                      {{ t.type === 'income' ? '+' : '-' }}{{ t.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                    </p>
                    <p class="text-xs text-[#8C7365]">{{ t.date }}</p>
                  </div>
                </div>
              </ng-container>
              <ng-template #transactionSkeletons>
                <div *ngFor="let i of [1,2,3,4,5]" class="flex items-center gap-3 px-5 py-3">
                  <div class="skeleton w-8 h-8 rounded-full"></div>
                  <div class="flex-1 space-y-1.5">
                    <div class="skeleton h-3 rounded w-1/3"></div>
                    <div class="skeleton h-2.5 rounded w-1/2"></div>
                  </div>
                  <div class="skeleton h-3 rounded w-16"></div>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- Goals -->
          <div class="card-white">
            <div class="flex items-center justify-between px-5 py-4 border-b border-[#EAD5C9] dark:border-[#3D312A]">
              <h2 class="text-sm font-semibold text-[#3D312A] dark:text-[#F0E6DF]">Metas</h2>
              <a routerLink="/goals" class="text-xs text-[#8C7365] hover:text-[#3D312A] dark:hover:text-[#F0E6DF] transition">Ver todas</a>
            </div>
            <div class="p-5 space-y-4">
              <ng-container *ngIf="!loading; else goalSkeletons">
                <div *ngIf="goals.length === 0" class="text-center py-6">
                  <p class="text-sm text-[#8C7365]">Nenhuma meta definida</p>
                  <a routerLink="/goals" class="btn-primary text-xs px-3 py-1.5 mt-3 inline-flex">Criar meta</a>
                </div>
                <div *ngFor="let g of goals.slice(0,4)" class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-medium text-[#3D312A] dark:text-[#F0E6DF] truncate max-w-[140px]">{{ g.title }}</p>
                    <span class="text-xs text-[#8C7365]">{{ g.progress }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-bar-fill" [style.width.%]="g.progress"></div>
                  </div>
                  <p class="text-xs text-[#8C7365]">
                    {{ g.current_amount | currency:'BRL':'symbol':'1.0-0':'pt-BR' }} de {{ g.target_amount | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}
                  </p>
                </div>
              </ng-container>
              <ng-template #goalSkeletons>
                <div *ngFor="let i of [1,2,3]" class="space-y-1.5">
                  <div class="skeleton h-3 rounded w-2/3"></div>
                  <div class="skeleton h-1.5 rounded-full w-full"></div>
                </div>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="card-white p-5">
          <h2 class="text-sm font-semibold text-[#3D312A] dark:text-[#F0E6DF] mb-4">Ações rápidas</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a *ngFor="let action of quickActions" [routerLink]="action.route"
              class="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#EAD5C9] dark:border-[#3D312A] hover:bg-[#F5EBE6] dark:hover:bg-[#2A211B] transition cursor-pointer text-center">
              <div class="w-8 h-8 rounded-lg bg-[#EAD5C9] dark:bg-[#3D312A] flex items-center justify-center">
                <span [innerHTML]="action.icon" class="w-4 h-4 text-[#3D312A] dark:text-[#F0E6DF]"></span>
              </div>
              <span class="text-xs font-medium text-[#3D312A] dark:text-[#F0E6DF]">{{ action.label }}</span>
            </a>
          </div>
        </div>

      </div>
    </app-shell>

    <ng-template #skeletonTpl>
      <div class="skeleton h-7 rounded w-32 mt-1"></div>
      <div class="skeleton h-3 rounded w-16 mt-2"></div>
    </ng-template>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = true;
  balance = { income: 0, expense: 0, balance: 0 };
  transactions: any[] = [];
  goals: any[] = [];
  private destroy$ = new Subject<void>();

  quickActions = [
    { label: 'Nova transação', route: '/transactions', icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>` },
    { label: 'Ver categorias', route: '/categories', icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /></svg>` },
    { label: 'Minhas metas', route: '/goals', icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>` },
    { label: 'Transações', route: '/transactions', icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>` },
  ];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private goalService: GoalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.transactionService.getBalance().pipe(takeUntil(this.destroy$)).subscribe({
      next: (b: any) => { this.balance = b; },
      error: () => {}
    });

    this.transactionService.getTransactions(1, 8).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r: any) => { this.transactions = r?.data || r || []; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.goalService.getGoals().pipe(takeUntil(this.destroy$)).subscribe({
      next: (g: any) => { this.goals = g || []; },
      error: () => {}
    });
  }
}
