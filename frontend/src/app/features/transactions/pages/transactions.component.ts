import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { AppShellComponent } from '../../../shared/components/app-shell.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppShellComponent, CurrencyPipe],
  template: `
    <app-shell pageTitle="Transações">
      <div class="p-6 max-w-6xl mx-auto space-y-5 animate-fade-up">

        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-[#3D312A] dark:text-[#F0E6DF] tracking-tight">Transações</h1>
            <p class="text-sm text-[#8C7365] mt-0.5">Histórico completo de movimentações</p>
          </div>
          <button (click)="showModal = true" class="btn-primary text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nova transação
          </button>
        </div>

        <!-- Filters -->
        <div class="card-white p-4 flex flex-wrap gap-3">
          <select [(ngModel)]="filter.type" (change)="load()" class="input-field w-auto text-sm">
            <option value="">Todos os tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
          <input type="month" [(ngModel)]="filter.month" (change)="load()" class="input-field w-auto text-sm" />
          <button (click)="clearFilters()" class="btn-secondary text-sm px-3 py-1.5">Limpar</button>
        </div>

        <!-- Table -->
        <div class="card-white overflow-hidden">
          <table class="data-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Data</th>
                <th>Tipo</th>
                <th class="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="!loading; else loadingRows">
                <tr *ngIf="transactions.length === 0">
                  <td colspan="5" class="text-center py-10 text-[#8C7365]">Nenhuma transação encontrada</td>
                </tr>
                <tr *ngFor="let t of transactions">
                  <td>
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        [class]="t.type === 'income' ? 'bg-[rgba(163,177,155,0.15)]' : 'bg-[rgba(217,138,116,0.12)]'">
                        <svg class="w-3.5 h-3.5" [class]="t.type === 'income' ? 'text-[#5C7A52]' : 'text-[#B85C3E]'" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path *ngIf="t.type === 'income'" stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                          <path *ngIf="t.type === 'expense'" stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                        </svg>
                      </div>
                      <span class="font-medium text-[#3D312A] dark:text-[#F0E6DF]">{{ t.description }}</span>
                    </div>
                  </td>
                  <td class="text-[#8C7365]">{{ t.category_name || '—' }}</td>
                  <td class="text-[#8C7365]">{{ t.date }}</td>
                  <td>
                    <span [class]="t.type === 'income' ? 'badge-positive' : 'badge-negative'">
                      {{ t.type === 'income' ? 'Receita' : 'Despesa' }}
                    </span>
                  </td>
                  <td class="text-right font-semibold" [class]="t.type === 'income' ? 'text-[#5C7A52] dark:text-[#A3B19B]' : 'text-[#B85C3E] dark:text-[#D98A74]'">
                    {{ t.type === 'income' ? '+' : '-' }}{{ t.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                  </td>
                </tr>
              </ng-container>
              <ng-template #loadingRows>
                <tr *ngFor="let i of [1,2,3,4,5,6]">
                  <td><div class="skeleton h-3 rounded w-32"></div></td>
                  <td><div class="skeleton h-3 rounded w-20"></div></td>
                  <td><div class="skeleton h-3 rounded w-20"></div></td>
                  <td><div class="skeleton h-5 rounded-full w-16"></div></td>
                  <td class="text-right"><div class="skeleton h-3 rounded w-20 ml-auto"></div></td>
                </tr>
              </ng-template>
            </tbody>
          </table>
        </div>

      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D312A]/30 backdrop-blur-sm animate-fade-in">
        <div class="card-white w-full max-w-md p-6 animate-fade-up">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-semibold text-[#3D312A] dark:text-[#F0E6DF]">Nova transação</h3>
            <button (click)="showModal = false" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#EAD5C9] dark:hover:bg-[#3D312A] transition">
              <svg class="w-4 h-4 text-[#8C7365]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="label">Tipo</label>
              <select [(ngModel)]="newTx.type" class="input-field text-sm">
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>
            <div>
              <label class="label">Descrição</label>
              <input type="text" [(ngModel)]="newTx.description" placeholder="Ex: Salário, Aluguel..." class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Valor (R$)</label>
              <input type="number" [(ngModel)]="newTx.amount" placeholder="0,00" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Data</label>
              <input type="date" [(ngModel)]="newTx.date" class="input-field text-sm" />
            </div>
            <div class="flex gap-3 pt-2">
              <button (click)="showModal = false" class="btn-secondary flex-1 text-sm">Cancelar</button>
              <button (click)="saveTransaction()" class="btn-primary flex-1 text-sm">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </app-shell>
  `
})
export class TransactionsComponent implements OnInit {
  loading = true;
  transactions: any[] = [];
  showModal = false;
  filter = { type: '', month: '' };
  newTx = { type: 'expense', description: '', amount: 0, date: new Date().toISOString().split('T')[0], category_id: null };

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.transactionService.getTransactions(1, 50).subscribe({
      next: (r: any) => { this.transactions = r?.data || r || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  clearFilters(): void {
    this.filter = { type: '', month: '' };
    this.load();
  }

  saveTransaction(): void {
    if (!this.newTx.description || !this.newTx.amount) return;
    this.transactionService.createTransaction(this.newTx).subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => {}
    });
  }
}
