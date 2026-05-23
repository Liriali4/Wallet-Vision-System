import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../../core/services/goal.service';
import { AppShellComponent } from '../../../shared/components/app-shell.component';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule, AppShellComponent, CurrencyPipe],
  template: `
    <app-shell pageTitle="Metas">
      <div class="p-6 max-w-4xl mx-auto space-y-5 animate-fade-up">

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">{{ t('Metas financeiras', 'Financial goals') }}</h1>
            <p class="text-sm text-[#334155] mt-0.5">{{ t('Acompanhe seu progresso rumo aos seus objetivos', 'Track your progress toward your goals') }}</p>
          </div>
          <button (click)="openModal()" class="btn-primary text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {{ t('Nova meta', 'New goal') }}
          </button>
        </div>

        <!-- Goals grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="card-white p-4">
            <p class="text-xs text-[#334155]">Progresso mÃ©dio</p>
            <p class="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">{{ averageProgress | number:'1.0-0' }}%</p>
          </div>
          <div class="card-white p-4">
            <p class="text-xs text-[#334155]">Total restante</p>
            <p class="text-lg font-semibold text-[#15803D] dark:text-[#22C55E] mt-2">{{ remainingTotal | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
          </div>
          <div class="card-white p-4">
            <p class="text-xs text-[#334155]">Metas no caminho</p>
            <p class="text-2xl font-bold text-[#16A34A] dark:text-[#22C55E] mt-1">{{ onTrackCount }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ng-container *ngIf="!loading; else loadingCards">
            <div *ngIf="goals.length === 0" class="col-span-full text-center py-12">
              <p class="text-sm text-[#334155]">Nenhuma meta definida ainda</p>
              <button (click)="openModal()" class="btn-primary text-xs px-3 py-1.5 mt-3">Criar primeira meta</button>
            </div>
            <div *ngFor="let g of goals" class="card-white p-5 group">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{{ g.title }}</p>
                  <p class="text-xs text-[#334155] mt-0.5">{{ g.description }}</p>
                </div>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button (click)="editGoal(g)" class="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#DCFCE7] dark:hover:bg-[#166534]">
                    <svg class="w-3 h-3 text-[#334155]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button (click)="confirmDelete(g)" class="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[rgba(22,163,74,0.12)]">
                    <svg class="w-3 h-3 text-[#16A34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="space-y-2 mb-4">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-[#334155]">{{ g.current_amount | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</span>
                  <span class="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{{ g.progress }}%</span>
                  <span class="text-[#334155]">{{ g.target_amount | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" [style.width.%]="g.progress"></div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs mb-3 pb-3 border-b border-[#DCFCE7] dark:border-[#166534]">
                <div>
                  <p class="text-[#334155]">Esperado:</p>
                  <p class="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{{ calculateExpectedProgress(g) }}%</p>
                </div>
                <div>
                  <p class="text-[#334155]">Dias restantes:</p>
                  <p class="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{{ getRemainingDays(g) }}</p>
                </div>
                <div>
                  <p class="text-[#334155]">Restante:</p>
                  <p class="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{{ remainingAmount(g) | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</p>
                </div>
                <div>
                  <p class="text-[#334155]">Mensal necessÃ¡rio:</p>
                  <p class="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{{ monthlyNeeded(g) | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</p>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs px-2 py-0.5 rounded-full border"
                  [class]="statusClass(g.status)">
                  {{ statusLabel(g.status) }}
                </span>
                <span [class]="getProgressStatus(g).color" class="text-xs font-medium">
                  {{ getProgressStatus(g).label }}
                </span>
              </div>
            </div>
          </ng-container>
          <ng-template #loadingCards>
            <div *ngFor="let i of [1,2,3,4]" class="card-white p-5 space-y-3">
              <div class="skeleton h-4 rounded w-1/2"></div>
              <div class="skeleton h-3 rounded w-3/4"></div>
              <div class="skeleton h-2 rounded-full w-full"></div>
            </div>
          </ng-template>
        </div>

      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/30 backdrop-blur-sm animate-fade-in">
        <div class="card-white w-full max-w-sm p-6 animate-fade-up">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{{ editingId ? 'Editar meta' : 'Nova meta' }}</h3>
            <button (click)="closeModal()" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#DCFCE7] dark:hover:bg-[#166534] transition">
              <svg class="w-4 h-4 text-[#334155]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label class="label">TÃ­tulo <span class="text-red-500">*</span></label>
              <input type="text" [(ngModel)]="newGoal.title" placeholder="Ex: Reserva de emergÃªncia" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">DescriÃ§Ã£o</label>
              <input type="text" [(ngModel)]="newGoal.description" placeholder="Opcional" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Valor alvo (R$) <span class="text-red-500">*</span></label>
              <input type="number" [(ngModel)]="newGoal.target_amount" placeholder="0,00" class="input-field text-sm" min="0.01" step="0.01" />
            </div>
            <div>
              <label class="label">Valor atual (R$)</label>
              <input type="number" [(ngModel)]="newGoal.current_amount" placeholder="0,00" class="input-field text-sm" min="0" step="0.01" />
            </div>
            <div>
              <label class="label">Data de inÃ­cio</label>
              <input type="date" [(ngModel)]="newGoal.start_date" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Prazo <span class="text-red-500">*</span></label>
              <input type="date" [(ngModel)]="newGoal.end_date" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Prioridade</label>
              <select [(ngModel)]="newGoal.priority" class="input-field text-sm">
                <option value="low">Baixa</option>
                <option value="medium">MÃ©dia</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div>
              <label class="label">Status</label>
              <select [(ngModel)]="newGoal.status" class="input-field text-sm">
                <option value="not_started">NÃ£o iniciada</option>
                <option value="in_progress">Em progresso</option>
                <option value="paused">Pausada</option>
                <option value="completed">ConcluÃ­da</option>
              </select>
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
            Tem certeza que deseja deletar a meta <strong>{{ goalToDelete?.title }}</strong>?
            O histÃ³rico de progresso serÃ¡ perdido. Esta aÃ§Ã£o nÃ£o pode ser desfeita.
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
export class GoalsComponent implements OnInit {
  currentLang = 'pt';
  loading = true;
  saving = false;
  deleting = false;
  goals: any[] = [];
  showModal = false;
  showDeleteConfirm = false;
  editingId: number | null = null;
  goalToDelete: any = null;
  newGoal = {
    title: '',
    description: '',
    target_amount: 0,
    current_amount: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'not_started' as 'not_started' | 'in_progress' | 'completed' | 'paused'
  };

  constructor(private goalService: GoalService, private i18n: I18nService) {}

  get averageProgress(): number {
    return this.goals.length ? this.goals.reduce((sum, goal) => sum + Number(goal.progress || 0), 0) / this.goals.length : 0;
  }

  get remainingTotal(): number {
    return this.goals.reduce((sum, goal) => sum + this.remainingAmount(goal), 0);
  }

  get onTrackCount(): number {
    return this.goals.filter(goal => this.getProgressStatus(goal).label === 'No caminho').length;
  }

  ngOnInit(): void {
    this.i18n.language$.subscribe(lang => this.currentLang = lang);
    this.load();
  }

  load(): void {
    this.loading = true;
    this.goalService.getGoals().subscribe({
      next: (g: any) => {
        // API returns array or { data: array }
        this.goals = (g?.data || g || []).map((goal: any) => ({
          ...goal,
          progress: goal.progress ?? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openModal(goal?: any): void {
    if (goal) {
      this.editingId = goal.id;
      this.newGoal = {
        title: goal.title,
        description: goal.description,
        target_amount: goal.target_amount,
        current_amount: goal.current_amount,
        start_date: goal.start_date,
        end_date: goal.end_date,
        priority: goal.priority as 'low' | 'medium' | 'high',
        status: goal.status as 'not_started' | 'in_progress' | 'completed' | 'paused'
      };
    } else {
      this.resetForm();
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.newGoal = {
      title: '',
      description: '',
      target_amount: 0,
      current_amount: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
      priority: 'medium' as 'low' | 'medium' | 'high',
      status: 'not_started' as 'not_started' | 'in_progress' | 'completed' | 'paused'
    };
  }

  save(): void {
    if (!this.newGoal.title || !this.newGoal.target_amount) return;
    this.saving = true;

    if (this.editingId) {
      this.goalService.updateGoal(this.editingId, this.newGoal).subscribe({
        next: () => {
          this.closeModal();
          this.load();
          this.saving = false;
        },
        error: () => {
          this.saving = false;
        }
      });
    } else {
      this.goalService.createGoal(this.newGoal).subscribe({
        next: () => {
          this.closeModal();
          this.load();
          this.saving = false;
        },
        error: () => {
          this.saving = false;
        }
      });
    }
  }

  editGoal(goal: any): void {
    this.openModal(goal);
  }

  confirmDelete(goal: any): void {
    this.goalToDelete = goal;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.goalToDelete = null;
  }

  confirmDeleteAction(): void {
    if (!this.goalToDelete) return;
    this.deleting = true;
    this.goalService.deleteGoal(this.goalToDelete.id).subscribe({
      next: () => {
        this.deleting = false;
        this.showDeleteConfirm = false;
        this.goalToDelete = null;
        this.load();
      },
      error: () => {
        this.deleting = false;
      }
    });
  }

  calculateExpectedProgress(goal: any): number {
    if (!goal.start_date || !goal.end_date) return 0;
    const start = new Date(goal.start_date).getTime();
    const end = new Date(goal.end_date).getTime();
    const now = new Date().getTime();

    if (now < start) return 0;
    if (now >= end) return 100;

    return Math.round(((now - start) / (end - start)) * 100);
  }

  getProgressStatus(goal: any): { label: string; color: string } {
    const current = goal.progress || 0;
    const expected = this.calculateExpectedProgress(goal);
    const diff = current - expected;

    if (diff >= -5) return { label: 'No caminho', color: 'text-[#16A34A]' };
    if (diff < -25) return { label: 'Muito atrasado', color: 'text-[#16A34A]' };
    return { label: 'Atrasado', color: 'text-[#F97316]' };
  }

  getRemainingDays(goal: any): number {
    const end = new Date(goal.end_date).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  }

  remainingAmount(goal: any): number {
    return Math.max(0, Number(goal.target_amount || 0) - Number(goal.current_amount || 0));
  }

  monthlyNeeded(goal: any): number {
    const days = this.getRemainingDays(goal);
    const months = Math.max(1, Math.ceil(days / 30));
    return this.remainingAmount(goal) / months;
  }

  statusLabel(s: string): string {
    const map: any = {
      not_started: 'NÃ£o iniciada',
      in_progress: 'Em progresso',
      completed: 'ConcluÃ­da',
      paused: 'Pausada'
    };
    return map[s] || s;
  }

  statusClass(s: string): string {
    if (s === 'completed')
      return 'bg-[rgba(22,163,74,0.15)] text-[#16A34A] border-[rgba(22,163,74,0.3)]';
    if (s === 'in_progress')
      return 'bg-[rgba(15,23,42,0.08)] text-[#0F172A] dark:text-[#F8FAFC] border-[#BBF7D0] dark:border-[#14532D]';
    if (s === 'paused')
      return 'bg-[rgba(22,163,74,0.10)] text-[#15803D] border-[rgba(22,163,74,0.25)]';
    return 'bg-[#DCFCE7] text-[#334155] border-[#BBF7D0]';
  }

  t(pt: string, en: string): string {
    return this.currentLang === 'pt' ? pt : en;
  }
}


