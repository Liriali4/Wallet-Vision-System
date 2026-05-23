import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { AppShellComponent } from '../../../shared/components/app-shell.component';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AppShellComponent, CurrencyPipe],
  template: `
    <app-shell pageTitle="Categorias">
      <div class="p-6 max-w-4xl mx-auto space-y-5 animate-fade-up">

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">{{ t('Categorias', 'Categories') }}</h1>
            <p class="text-sm text-[#334155] mt-0.5">{{ t('Organize suas transaÃ§Ãµes por categoria', 'Organize your transactions by category') }}</p>
          </div>
          <button (click)="openModal()" class="btn-primary text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {{ t('Nova categoria', 'New category') }}
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 p-1 bg-[#DCFCE7] dark:bg-[#052E16] rounded-lg w-fit">
          <button *ngFor="let tab of tabs" (click)="activeTab = tab.value"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition"
            [class]="activeTab === tab.value ? 'bg-[#FFFFFF] dark:bg-[#166534] text-[#0F172A] dark:text-[#F8FAFC] shadow-sm' : 'text-[#334155] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'">
            {{ tab.label }}
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="card-white p-4">
            <p class="text-xs text-[#334155]">Categorias ativas</p>
            <p class="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">{{ categories.length }}</p>
          </div>
          <div class="card-white p-4">
            <p class="text-xs text-[#334155]">Mais usada</p>
            <p class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mt-2 truncate">{{ topCategory?.name || 'Sem dados' }}</p>
          </div>
          <div class="card-white p-4">
            <p class="text-xs text-[#334155]">Maior impacto</p>
            <p class="text-sm font-semibold text-[#15803D] dark:text-[#22C55E] mt-2">{{ (topCategory?.total || 0) | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <ng-container *ngIf="!loading; else loadingCards">
            <div *ngIf="filtered.length === 0" class="col-span-full text-center py-12">
              <p class="text-sm text-[#334155]">Nenhuma categoria encontrada</p>
              <button (click)="openModal()" class="btn-primary text-xs px-3 py-1.5 mt-3">Criar categoria</button>
            </div>
            <div *ngFor="let c of filtered" class="card-white p-4 flex items-center gap-3 group">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                [style.background]="(c.color || '#DCFCE7') + '22'"
                [style.color]="c.color || '#334155'">
                <span class="text-base">{{ c.icon || 'ðŸ“' }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] truncate">{{ c.name }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <div class="w-3 h-3 rounded-full" [style.background]="c.color || '#334155'"></div>
                  <span [class]="c.type === 'income' ? 'badge-positive' : 'badge-negative'" class="text-xs">
                    {{ c.type === 'income' ? 'Receita' : 'Despesa' }}
                  </span>
                </div>
                <div class="mt-3">
                  <div class="flex items-center justify-between text-xs text-[#334155] mb-1">
                    <span>{{ statsFor(c).count }} transaÃ§Ãµes</span>
                    <span>{{ statsFor(c).percent | number:'1.0-0' }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-bar-fill" [style.width.%]="statsFor(c).percent" [style.background]="c.color || '#334155'"></div>
                  </div>
                </div>
              </div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button (click)="editCategory(c)" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#DCFCE7] dark:hover:bg-[#0F172A] transition">
                  <svg class="w-3.5 h-3.5 text-[#334155]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button (click)="confirmDelete(c)" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[rgba(22,163,74,0.12)] transition">
                  <svg class="w-3.5 h-3.5 text-[#16A34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </ng-container>
          <ng-template #loadingCards>
            <div *ngFor="let i of [1,2,3,4,5,6]" class="card-white p-4 flex items-center gap-3">
              <div class="skeleton w-9 h-9 rounded-lg"></div>
              <div class="flex-1 space-y-1.5">
                <div class="skeleton h-3 rounded w-2/3"></div>
                <div class="skeleton h-4 rounded-full w-14"></div>
              </div>
            </div>
          </ng-template>
        </div>

      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/30 backdrop-blur-sm animate-fade-in">
        <div class="card-white w-full max-w-sm p-6 animate-fade-up">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{{ editingId ? 'Editar categoria' : 'Nova categoria' }}</h3>
            <button (click)="closeModal()" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#DCFCE7] dark:hover:bg-[#166534] transition">
              <svg class="w-4 h-4 text-[#334155]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="label">Nome</label>
              <input type="text" [(ngModel)]="newCat.name" placeholder="Ex: AlimentaÃ§Ã£o" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Tipo</label>
              <select [(ngModel)]="newCat.type" class="input-field text-sm">
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>
            <div>
              <label class="label">Cor</label>
              <div class="flex items-center gap-2 mb-2">
                <button (click)="showColorPicker = !showColorPicker" class="w-10 h-10 rounded-lg border-2 border-[#DCFCE7] dark:border-[#166534] transition"
                  [style.background]="newCat.color">
                </button>
                <span class="text-sm text-[#334155]">{{ newCat.color }}</span>
              </div>
              <div *ngIf="showColorPicker" class="grid grid-cols-6 gap-2 p-3 bg-[#F7FFF9] dark:bg-[#2A211B] rounded-lg">
                <button *ngFor="let color of colorOptions" (click)="newCat.color = color; showColorPicker = false"
                  class="w-8 h-8 rounded-md border-2 transition hover:scale-110"
                  [style.background]="color"
                  [class.border-[#0F172A]="newCat.color === color"
                  [class.border-transparent]="newCat.color !== color">
                </button>
              </div>
            </div>
            <div>
              <label class="label">Ãcone</label>
              <div class="grid grid-cols-6 gap-2">
                <button *ngFor="let icon of iconOptions" (click)="newCat.icon = icon.value"
                  class="h-9 rounded-lg border text-sm transition"
                  [ngClass]="newCat.icon === icon.value ? 'border-[#0F172A] dark:border-[#F8FAFC]' : 'border-[#DCFCE7] dark:border-[#14532D]'">
                  {{ icon.label }}
                </button>
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button (click)="closeModal()" class="btn-secondary flex-1 text-sm">Cancelar</button>
              <button (click)="save()" [disabled]="saving" class="btn-primary flex-1 text-sm">{{ saving ? 'Salvando...' : 'Salvar' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/30 backdrop-blur-sm animate-fade-in">
        <div class="card-white w-full max-w-md p-6 animate-fade-up">
          <h3 class="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-lg mb-3">Confirmar exclusÃ£o</h3>
          <p class="text-sm text-[#334155] mb-5">
            Tem certeza que deseja deletar a categoria <strong>{{ categoryToDelete?.name }}</strong>?
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
    .badge-positive {
      @apply bg-[rgba(22,163,74,0.15)] text-[#16A34A] px-2 py-0.5 rounded-full;
    }
    .badge-negative {
      @apply bg-[rgba(22,163,74,0.12)] text-[#15803D] px-2 py-0.5 rounded-full;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  currentLang = 'pt';
  loading = true;
  categories: any[] = [];
  transactions: any[] = [];
  showModal = false;
  showDeleteConfirm = false;
  showColorPicker = false;
  activeTab = 'all';
  editingId: number | null = null;
  categoryToDelete: any = null;
  deleting = false;
  saving = false;
  colorOptions = [
    '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981',
    '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#16A34A',
    '#22C55E', '#334155'
  ];
  iconOptions = [
    { label: 'ðŸ·', value: 'tag' },
    { label: 'ðŸ’¼', value: 'briefcase' },
    { label: 'ðŸ½', value: 'utensils' },
    { label: 'ðŸš—', value: 'car' },
    { label: 'ðŸ ', value: 'home' },
    { label: 'ðŸ’¡', value: 'zap' },
    { label: 'ðŸŽµ', value: 'music' },
    { label: 'â¤', value: 'heart' },
    { label: 'ðŸ“ˆ', value: 'trending-up' },
    { label: 'ðŸ’»', value: 'code' },
    { label: 'ðŸŽ¯', value: 'target' },
    { label: 'ðŸ§¾', value: 'receipt' }
  ];
  newCat = { name: '', type: 'expense' as 'expense' | 'income', color: '#6366f1', icon: 'tag' };

  tabs = [
    { label: 'Todas', value: 'all' },
    { label: 'Despesas', value: 'expense' },
    { label: 'Receitas', value: 'income' },
  ];

  get filtered() {
    if (this.activeTab === 'all') return this.categories;
    return this.categories.filter(c => c.type === this.activeTab);
  }

  constructor(
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.i18n.language$.subscribe(lang => this.currentLang = lang);
    this.load();
  }

  load(): void {
    this.loading = true;
    forkJoin({
      categories: this.categoryService.getCategories(),
      transactions: this.transactionService.getTransactions({ page: 1, perPage: 500 })
    }).subscribe({
      next: (result: any) => {
        this.categories = result.categories || [];
        this.transactions = (result.transactions?.data || result.transactions || []).map((t: any) => ({ ...t, amount: Number(t.amount) || 0 }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get topCategory(): any {
    return this.categories
      .map(c => ({ ...c, ...this.statsFor(c) }))
      .sort((a, b) => b.total - a.total)[0];
  }

  statsFor(category: any): { count: number; total: number; percent: number } {
    const related = this.transactions.filter(t => Number(t.category_id) === Number(category.id) || t.category_name === category.name);
    const count = related.length;
    const total = related.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const categoryTypeTotal = this.transactions
      .filter(t => t.type === category.type)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return { count, total, percent: categoryTypeTotal ? (total / categoryTypeTotal) * 100 : 0 };
  }

  openModal(category?: any): void {
    if (category) {
      this.editingId = category.id;
      this.newCat = { ...category };
    } else {
      this.editingId = null;
      this.newCat = { name: '', type: 'expense', color: '#6366f1', icon: 'tag' };
    }
    this.showColorPicker = false;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showColorPicker = false;
    this.editingId = null;
    this.newCat = { name: '', type: 'expense', color: '#6366f1', icon: 'tag' };
  }

  save(): void {
    if (!this.newCat.name) return;
    this.saving = true;

    if (this.editingId) {
      this.categoryService.updateCategory(this.editingId, this.newCat).subscribe({
        next: () => { 
          this.closeModal(); 
          this.load(); 
          this.saving = false; 
        },
        error: () => { this.saving = false; }
      });
    } else {
      this.categoryService.createCategory(this.newCat).subscribe({
        next: () => { 
          this.closeModal(); 
          this.load(); 
          this.saving = false; 
        },
        error: () => { this.saving = false; }
      });
    }
  }

  editCategory(category: any): void {
    this.openModal(category);
  }

  confirmDelete(category: any): void {
    this.categoryToDelete = category;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.categoryToDelete = null;
  }

  confirmDeleteAction(): void {
    if (!this.categoryToDelete) return;
    this.deleting = true;
    this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: () => { this.deleting = false; this.showDeleteConfirm = false; this.categoryToDelete = null; this.load(); },
      error: () => { this.deleting = false; }
    });
  }

  t(pt: string, en: string): string {
    return this.currentLang === 'pt' ? pt : en;
  }
}


