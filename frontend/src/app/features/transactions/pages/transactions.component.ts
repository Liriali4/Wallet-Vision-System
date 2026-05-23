import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { AppShellComponent } from '../../../shared/components/app-shell.component';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppShellComponent, CurrencyPipe],
  template: `
    <app-shell pageTitle="TransaÃ§Ãµes">
      <div class="p-6 max-w-6xl mx-auto space-y-5 animate-fade-up">

        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">{{ t('TransaÃ§Ãµes', 'Transactions') }}</h1>
            <p class="text-sm text-[#334155] mt-0.5">{{ t('HistÃ³rico completo de movimentaÃ§Ãµes', 'Complete transaction history') }}</p>
          </div>
          <button (click)="openModal()" class="btn-primary text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {{ t('Nova transaÃ§Ã£o', 'New transaction') }}
          </button>
        </div>

        <!-- Filters -->
        <div class="card-white p-4 space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3">
          <input type="search" [(ngModel)]="filter.search" (ngModelChange)="page = 1" placeholder="Pesquisar descriÃ§Ã£o, categoria ou notas" class="input-field text-sm" />
          <select [(ngModel)]="filter.type" (change)="page = 1" class="input-field md:w-40 text-sm">
            <option value="">Todos os tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
          <input type="month" [(ngModel)]="filter.month" (change)="page = 1" class="input-field md:w-40 text-sm" />
          <button (click)="clearFilters()" class="btn-secondary text-sm px-3 py-1.5">Limpar</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="rounded-lg border border-[#DCFCE7] dark:border-[#14532D] p-3">
              <p class="text-xs text-[#334155]">Entradas filtradas</p>
              <p class="text-lg font-semibold text-[#16A34A] dark:text-[#22C55E]">{{ filteredTotals.income | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
            </div>
            <div class="rounded-lg border border-[#DCFCE7] dark:border-[#14532D] p-3">
              <p class="text-xs text-[#334155]">SaÃ­das filtradas</p>
              <p class="text-lg font-semibold text-[#15803D] dark:text-[#22C55E]">{{ filteredTotals.expense | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
            </div>
            <div class="rounded-lg border border-[#DCFCE7] dark:border-[#14532D] p-3">
              <p class="text-xs text-[#334155]">Resultado</p>
              <p class="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{{ filteredTotals.net | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="card-white overflow-hidden">
          <table class="data-table">
            <thead>
              <tr>
                <th>DescriÃ§Ã£o</th>
                <th>Categoria</th>
                <th>Data</th>
                <th>Tipo</th>
                <th class="text-right">Valor</th>
                <th class="text-center">AÃ§Ãµes</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="!loading; else loadingRows">
                <tr *ngIf="filteredTransactions.length === 0">
                  <td colspan="6" class="text-center py-10 text-[#334155]">Nenhuma transaÃ§Ã£o encontrada</td>
                </tr>
                <tr *ngFor="let t of pagedTransactions">
                  <td>
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        [style.background]="categoryColor(t) + '22'">
                        <svg class="w-3.5 h-3.5" [style.color]="categoryColor(t)" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path *ngIf="t.type === 'income'" stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                          <path *ngIf="t.type === 'expense'" stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                        </svg>
                      </div>
                      <span class="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{{ t.description }}</span>
                    </div>
                  </td>
                  <td class="text-[#334155] dark:text-[#94A3B8]">
                    <span class="inline-flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full" [style.background]="categoryColor(t)"></span>
                      {{ t.category_name || 'Sem categoria' }}
                    </span>
                  </td>
                  <td class="text-[#334155] dark:text-[#94A3B8]">{{ t.date }}</td>
                  <td>
                    <span [class]="t.type === 'income' ? 'badge-positive' : 'badge-negative'">
                      {{ t.type === 'income' ? 'Receita' : 'Despesa' }}
                    </span>
                  </td>
                  <td class="text-right font-semibold" [class]="t.type === 'income' ? 'text-[#16A34A] dark:text-[#22C55E]' : 'text-[#15803D] dark:text-[#22C55E]'">
                    {{ t.type === 'income' ? '+' : '-' }}{{ t.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                  </td>
                  <td class="text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button (click)="editTransaction(t)" class="text-xs px-2 py-1 rounded text-[#334155] hover:bg-[#DCFCE7] dark:hover:bg-[#166534] transition">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button (click)="confirmDelete(t)" class="text-xs px-2 py-1 rounded text-[#16A34A] hover:bg-[rgba(22,163,74,0.12)] transition">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
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
                  <td class="text-center"><div class="skeleton h-3 rounded w-12 mx-auto"></div></td>
                </tr>
              </ng-template>
            </tbody>
          </table>
          <div *ngIf="filteredTransactions.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-[#DCFCE7] dark:border-[#14532D]">
            <p class="text-xs text-[#334155]">
              Mostrando {{ pageStart + 1 }}-{{ pageEnd }} de {{ filteredTransactions.length }} transaÃ§Ãµes
            </p>
            <div class="flex items-center gap-2">
              <button (click)="page = page - 1" [disabled]="page === 1" class="btn-secondary text-xs px-3 py-1.5">Anterior</button>
              <span class="text-xs text-[#334155]">PÃ¡gina {{ page }} de {{ totalPages }}</span>
              <button (click)="page = page + 1" [disabled]="page === totalPages" class="btn-secondary text-xs px-3 py-1.5">PrÃ³xima</button>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/30 backdrop-blur-sm animate-fade-in">
        <div class="card-white w-full max-w-md p-6 animate-fade-up">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{{ editingId ? 'Editar transaÃ§Ã£o' : 'Nova transaÃ§Ã£o' }}</h3>
            <button (click)="closeModal()" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#DCFCE7] dark:hover:bg-[#166534] transition">
              <svg class="w-4 h-4 text-[#334155]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="label">Tipo</label>
              <select [(ngModel)]="newTx.type" (change)="loadCategories()" class="input-field text-sm">
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>
            <div>
              <label class="label">Categoria <span class="text-red-500">*</span></label>
              <select [(ngModel)]="newTx.category_id" class="input-field text-sm">
                <option [ngValue]="null">Selecione uma categoria</option>
                <option *ngFor="let c of filteredCategories" [ngValue]="c.id">{{ c.name }}</option>
              </select>
              <p *ngIf="validationErrors.category" class="text-xs text-red-500 mt-1">{{ validationErrors.category }}</p>
            </div>
            <div>
              <label class="label">DescriÃ§Ã£o</label>
              <input type="text" [(ngModel)]="newTx.description" placeholder="Ex: SalÃ¡rio, Aluguel..." class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Valor (R$) <span class="text-red-500">*</span></label>
              <input type="number" [(ngModel)]="newTx.amount" placeholder="0,00" class="input-field text-sm" min="0.01" step="0.01" />
              <p *ngIf="validationErrors.amount" class="text-xs text-red-500 mt-1">{{ validationErrors.amount }}</p>
            </div>
            <div>
              <label class="label">Data</label>
              <input type="date" [(ngModel)]="newTx.date" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Notas</label>
              <textarea [(ngModel)]="newTx.notes" placeholder="ObservaÃ§Ãµes adicionais..." class="input-field text-sm" rows="2"></textarea>
            </div>
            <div class="flex gap-3 pt-2">
              <button (click)="closeModal()" class="btn-secondary flex-1 text-sm">Cancelar</button>
              <button (click)="saveTransaction()" [disabled]="saving" class="btn-primary flex-1 text-sm">{{ saving ? 'Salvando...' : 'Salvar' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/30 backdrop-blur-sm animate-fade-in">
        <div class="card-white w-full max-w-md p-6 animate-fade-up">
          <h3 class="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-lg mb-3">Confirmar exclusÃ£o</h3>
          <p class="text-sm text-[#334155] mb-5">
            Tem certeza que deseja deletar a transaÃ§Ã£o <strong>{{ transactionToDelete?.description }}</strong>?
            Esta aÃ§Ã£o nÃ£o pode ser desfeita.
          </p>
          <div class="flex gap-3">
            <button (click)="cancelDelete()" class="btn-secondary flex-1 text-sm">Cancelar</button>
            <button (click)="confirmDeleteAction()" [disabled]="deleting" class="btn-danger flex-1 text-sm">
              {{ deleting ? 'Deletando...' : 'Deletar' }}
            </button>
          </div>
        </div>
      </div>
    </app-shell>
  `,
  styles: [`
    .btn-danger {
      @apply bg-[#16A34A] hover:bg-[#15803D] text-white dark:bg-[#16A34A] dark:hover:bg-[#22C55E];
    }
  `]
})
export class TransactionsComponent implements OnInit {
  currentLang = 'pt';
  loading = true;
  saving = false;
  deleting = false;
  transactions: any[] = [];
  categories: any[] = [];
  filteredCategories: any[] = [];
  showModal = false;
  showDeleteConfirm = false;
  editingId: number | null = null;
  transactionToDelete: any = null;
  filter = { type: '', month: '', search: '' };
  page = 1;
  perPage = 10;
  validationErrors: any = {};
  newTx = {
    type: 'expense' as 'income' | 'expense',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category_id: undefined as number | undefined,
    notes: ''
  };

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.i18n.language$.subscribe(lang => this.currentLang = lang);
    this.loadCategories();
    this.load();
  }

  get filteredTransactions(): any[] {
    const term = this.filter.search.trim().toLowerCase();
    return this.transactions.filter(t => {
      const matchesType = !this.filter.type || t.type === this.filter.type;
      const matchesMonth = !this.filter.month || String(t.date || '').startsWith(this.filter.month);
      const text = `${t.description || ''} ${t.category_name || ''} ${t.notes || ''}`.toLowerCase();
      return matchesType && matchesMonth && (!term || text.includes(term));
    }).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }

  get filteredTotals(): { income: number; expense: number; net: number } {
    const income = this.filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const expense = this.filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return { income, expense, net: income - expense };
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredTransactions.length / this.perPage));
  }

  get pageStart(): number {
    return Math.min((this.page - 1) * this.perPage, Math.max(0, this.filteredTransactions.length - 1));
  }

  get pageEnd(): number {
    return Math.min(this.page * this.perPage, this.filteredTransactions.length);
  }

  get pagedTransactions(): any[] {
    if (this.page > this.totalPages) this.page = this.totalPages;
    return this.filteredTransactions.slice((this.page - 1) * this.perPage, this.page * this.perPage);
  }

  categoryColor(transaction: any): string {
    const category = this.categories.find(c => Number(c.id) === Number(transaction.category_id) || c.name === transaction.category_name);
    return category?.color || (transaction.type === 'income' ? '#16A34A' : '#16A34A');
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats: any) => {
        this.categories = cats || [];
        this.filterCategoriesByType();
      },
      error: () => {}
    });
  }

  filterCategoriesByType(): void {
    this.filteredCategories = this.categories.filter(c => c.type === this.newTx.type);
  }

  load(): void {
    this.loading = true;
    this.transactionService.getTransactions({ page: 1, perPage: 50 }).subscribe({
      next: (r: any) => {
        this.transactions = (r?.data || r?.transactions || r || []).map((t: any) => ({ ...t, amount: Number(t.amount) || 0 }));
        this.page = 1;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  clearFilters(): void {
    this.filter = { type: '', month: '', search: '' };
    this.page = 1;
  }

  openModal(transaction?: any): void {
    if (transaction) {
      this.editingId = transaction.id;
      this.newTx = {
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        category_id: transaction.category_id,
        notes: transaction.notes || ''
      };
      this.filterCategoriesByType();
    } else {
      this.resetForm();
    }
    this.validationErrors = {};
    this.showModal = true;
  }

  editTransaction(transaction: any): void {
    this.openModal(transaction);
  }

  closeModal(): void {
    this.showModal = false;
    this.editingId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.newTx = {
      type: 'expense',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category_id: undefined,
      notes: ''
    };
    this.filterCategoriesByType();
  }

  validateForm(): boolean {
    this.validationErrors = {};

    if (!this.newTx.category_id) {
      this.validationErrors.category = 'Categoria Ã© obrigatÃ³ria';
    }

    if (!this.newTx.amount || this.newTx.amount <= 0) {
      this.validationErrors.amount = 'Valor deve ser maior que zero';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  saveTransaction(): void {
    if (!this.validateForm()) return;

    this.saving = true;
    const data = {
      ...this.newTx,
      amount: Math.abs(this.newTx.amount),
      category_id: this.newTx.category_id || undefined,
      type: this.newTx.type as 'income' | 'expense'
    };

    if (this.editingId) {
      this.transactionService.updateTransaction(this.editingId, data).subscribe({
        next: () => {
          this.closeModal();
          this.load();
          this.saving = false;
        },
        error: () => { this.saving = false; }
      });
    } else {
      this.transactionService.createTransaction(data).subscribe({
        next: () => {
          this.closeModal();
          this.load();
          this.saving = false;
        },
        error: () => { this.saving = false; }
      });
    }
  }

  confirmDelete(transaction: any): void {
    this.transactionToDelete = transaction;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.transactionToDelete = null;
  }

  confirmDeleteAction(): void {
    if (!this.transactionToDelete) return;
    this.deleting = true;
    this.transactionService.deleteTransaction(this.transactionToDelete.id).subscribe({
      next: () => {
        this.deleting = false;
        this.showDeleteConfirm = false;
        this.transactionToDelete = null;
        this.load();
      },
      error: () => { this.deleting = false; }
    });
  }

  t(pt: string, en: string): string {
    return this.currentLang === 'pt' ? pt : en;
  }
}

