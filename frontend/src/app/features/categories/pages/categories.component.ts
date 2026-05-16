import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { AppShellComponent } from '../../../shared/components/app-shell.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AppShellComponent],
  template: `
    <app-shell pageTitle="Categorias">
      <div class="p-6 max-w-4xl mx-auto space-y-5 animate-fade-up">

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-[#3D312A] dark:text-[#F0E6DF] tracking-tight">Categorias</h1>
            <p class="text-sm text-[#8C7365] mt-0.5">Organize suas transações por categoria</p>
          </div>
          <button (click)="showModal = true" class="btn-primary text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nova categoria
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 p-1 bg-[#EAD5C9] dark:bg-[#2A211B] rounded-lg w-fit">
          <button *ngFor="let tab of tabs" (click)="activeTab = tab.value"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition"
            [class]="activeTab === tab.value ? 'bg-[#FDFAF8] dark:bg-[#3D312A] text-[#3D312A] dark:text-[#F0E6DF] shadow-sm' : 'text-[#8C7365] hover:text-[#3D312A] dark:hover:text-[#F0E6DF]'">
            {{ tab.label }}
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <ng-container *ngIf="!loading; else loadingCards">
            <div *ngIf="filtered.length === 0" class="col-span-full text-center py-12">
              <p class="text-sm text-[#8C7365]">Nenhuma categoria encontrada</p>
              <button (click)="showModal = true" class="btn-primary text-xs px-3 py-1.5 mt-3">Criar categoria</button>
            </div>
            <div *ngFor="let c of filtered" class="card-white p-4 flex items-center gap-3 group">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                [style.background]="c.color ? c.color + '22' : '#EAD5C9'">
                <span class="text-base">{{ c.icon || '📁' }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-[#3D312A] dark:text-[#F0E6DF] truncate">{{ c.name }}</p>
                <span [class]="c.type === 'income' ? 'badge-positive' : 'badge-negative'" class="mt-0.5">
                  {{ c.type === 'income' ? 'Receita' : 'Despesa' }}
                </span>
              </div>
              <button (click)="deleteCategory(c.id)" class="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-md hover:bg-[rgba(217,138,116,0.12)] transition">
                <svg class="w-3.5 h-3.5 text-[#D98A74]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
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
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D312A]/30 backdrop-blur-sm animate-fade-in">
        <div class="card-white w-full max-w-sm p-6 animate-fade-up">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-semibold text-[#3D312A] dark:text-[#F0E6DF]">Nova categoria</h3>
            <button (click)="showModal = false" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#EAD5C9] dark:hover:bg-[#3D312A] transition">
              <svg class="w-4 h-4 text-[#8C7365]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="label">Nome</label>
              <input type="text" [(ngModel)]="newCat.name" placeholder="Ex: Alimentação" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Tipo</label>
              <select [(ngModel)]="newCat.type" class="input-field text-sm">
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>
            <div class="flex gap-3 pt-2">
              <button (click)="showModal = false" class="btn-secondary flex-1 text-sm">Cancelar</button>
              <button (click)="save()" class="btn-primary flex-1 text-sm">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </app-shell>
  `
})
export class CategoriesComponent implements OnInit {
  loading = true;
  categories: any[] = [];
  showModal = false;
  activeTab = 'all';
  newCat = { name: '', type: 'expense', color: '#EAD5C9', icon: '' };

  tabs = [
    { label: 'Todas', value: 'all' },
    { label: 'Despesas', value: 'expense' },
    { label: 'Receitas', value: 'income' },
  ];

  get filtered() {
    if (this.activeTab === 'all') return this.categories;
    return this.categories.filter(c => c.type === this.activeTab);
  }

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (c: any) => { this.categories = c || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  save(): void {
    if (!this.newCat.name) return;
    this.categoryService.createCategory(this.newCat).subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => {}
    });
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe({ next: () => this.load(), error: () => {} });
  }
}
