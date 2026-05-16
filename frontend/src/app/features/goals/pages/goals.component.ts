import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../../core/services/goal.service';
import { AppShellComponent } from '../../../shared/components/app-shell.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule, AppShellComponent, CurrencyPipe],
  template: `
    <app-shell pageTitle="Metas">
      <div class="p-6 max-w-4xl mx-auto space-y-5 animate-fade-up">

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-[#3D312A] dark:text-[#F0E6DF] tracking-tight">Metas financeiras</h1>
            <p class="text-sm text-[#8C7365] mt-0.5">Acompanhe seu progresso rumo aos seus objetivos</p>
          </div>
          <button (click)="showModal = true" class="btn-primary text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nova meta
          </button>
        </div>

        <!-- Goals grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ng-container *ngIf="!loading; else loadingCards">
            <div *ngIf="goals.length === 0" class="col-span-full text-center py-12">
              <p class="text-sm text-[#8C7365]">Nenhuma meta definida ainda</p>
              <button (click)="showModal = true" class="btn-primary text-xs px-3 py-1.5 mt-3">Criar primeira meta</button>
            </div>
            <div *ngFor="let g of goals" class="card-white p-5">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="font-semibold text-[#3D312A] dark:text-[#F0E6DF]">{{ g.title }}</p>
                  <p class="text-xs text-[#8C7365] mt-0.5">{{ g.description }}</p>
                </div>
                <span class="text-xs px-2 py-0.5 rounded-full border"
                  [class]="statusClass(g.status)">
                  {{ statusLabel(g.status) }}
                </span>
              </div>

              <div class="space-y-2 mb-3">
                <div class="flex items-center justify-between text-xs text-[#8C7365]">
                  <span>{{ g.current_amount | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</span>
                  <span class="font-medium text-[#3D312A] dark:text-[#F0E6DF]">{{ g.progress }}%</span>
                  <span>{{ g.target_amount | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" [style.width.%]="g.progress"
                    [style.background]="g.progress >= 100 ? '#A3B19B' : '#3D312A'"></div>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <p class="text-xs text-[#8C7365]">Prazo: {{ g.end_date }}</p>
                <button (click)="deleteGoal(g.id)" class="text-xs text-[#D98A74] hover:underline">Remover</button>
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
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D312A]/30 backdrop-blur-sm animate-fade-in">
        <div class="card-white w-full max-w-sm p-6 animate-fade-up">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-semibold text-[#3D312A] dark:text-[#F0E6DF]">Nova meta</h3>
            <button (click)="showModal = false" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#EAD5C9] dark:hover:bg-[#3D312A] transition">
              <svg class="w-4 h-4 text-[#8C7365]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="label">Título</label>
              <input type="text" [(ngModel)]="newGoal.title" placeholder="Ex: Reserva de emergência" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Descrição</label>
              <input type="text" [(ngModel)]="newGoal.description" placeholder="Opcional" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Valor alvo (R$)</label>
              <input type="number" [(ngModel)]="newGoal.target_amount" placeholder="0,00" class="input-field text-sm" />
            </div>
            <div>
              <label class="label">Prazo</label>
              <input type="date" [(ngModel)]="newGoal.end_date" class="input-field text-sm" />
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
export class GoalsComponent implements OnInit {
  loading = true;
  goals: any[] = [];
  showModal = false;
  newGoal = { title: '', description: '', target_amount: 0, end_date: '' };

  constructor(private goalService: GoalService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.goalService.getGoals().subscribe({
      next: (g: any) => { this.goals = g || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  save(): void {
    if (!this.newGoal.title || !this.newGoal.target_amount) return;
    this.goalService.createGoal(this.newGoal).subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => {}
    });
  }

  deleteGoal(id: number): void {
    this.goalService.deleteGoal(id).subscribe({ next: () => this.load(), error: () => {} });
  }

  statusLabel(s: string): string {
    const map: any = { not_started: 'Não iniciada', in_progress: 'Em progresso', completed: 'Concluída', paused: 'Pausada' };
    return map[s] || s;
  }

  statusClass(s: string): string {
    if (s === 'completed') return 'bg-[rgba(163,177,155,0.15)] text-[#5C7A52] border-[rgba(163,177,155,0.3)]';
    if (s === 'in_progress') return 'bg-[rgba(61,49,42,0.08)] text-[#3D312A] dark:text-[#F0E6DF] border-[#D9C4B8] dark:border-[#3D312A]';
    if (s === 'paused') return 'bg-[rgba(217,138,116,0.10)] text-[#B85C3E] border-[rgba(217,138,116,0.25)]';
    return 'bg-[#EAD5C9] text-[#8C7365] border-[#D9C4B8]';
  }
}
