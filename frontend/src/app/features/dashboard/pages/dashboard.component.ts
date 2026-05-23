import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { GoalService } from '../../../core/services/goal.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AppShellComponent } from '../../../shared/components/app-shell.component';

Chart.register(...registerables);

type Tx = {
  id: number;
  type: 'income' | 'expense';
  category_id?: number;
  category_name?: string;
  description?: string;
  amount: number;
  date: string;
};

type Category = {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
};

type Goal = {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  start_date?: string;
  end_date?: string;
  progress?: number;
};

type Insight = {
  title: string;
  value: string;
  tone: 'good' | 'warn' | 'neutral';
  description: string;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AppShellComponent, CurrencyPipe, DecimalPipe, DatePipe],
  template: `
    <app-shell pageTitle="Dashboard">
      <div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 animate-fade-up">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#334155]">Inteligencia financeira</p>
            <h1 class="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight mt-1">Visao geral</h1>
            <p class="text-sm text-[#334155] mt-1">Resumo do mes, tendencias e pontos de atencao da sua vida financeira.</p>
          </div>
          <div class="flex items-center gap-2 text-xs text-[#334155]">
            <span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            Atualizado com {{ transactions.length }} movimentacoes
          </div>
        </div>

        <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="card-white p-4 space-y-3">
            <div class="skeleton h-3 rounded w-20"></div>
            <div class="skeleton h-8 rounded w-32"></div>
            <div class="skeleton h-3 rounded w-24"></div>
          </div>
        </div>

        <ng-container *ngIf="!loading">
          <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
            <article *ngFor="let kpi of kpis" class="card-white p-4 min-h-[126px]">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold text-[#334155] uppercase tracking-wide">{{ kpi.label }}</p>
                  <p class="text-2xl font-bold tracking-tight mt-2" [class]="kpi.color">{{ kpi.value }}</p>
                </div>
                <div class="w-8 h-8 rounded-lg flex items-center justify-center" [style.background]="kpi.bg">
                  <span class="text-sm font-bold" [class]="kpi.color">{{ kpi.icon }}</span>
                </div>
              </div>
              <p class="text-xs text-[#334155] mt-3 leading-5">{{ kpi.detail }}</p>
            </article>
          </section>

          <section class="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div class="xl:col-span-8 card-white p-5">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Receitas vs despesas</h2>
                  <p class="text-xs text-[#334155] mt-1">Comparacao mensal dos ultimos periodos</p>
                </div>
                <span class="badge-positive" *ngIf="balance.balance >= 0">Saldo positivo</span>
                <span class="badge-negative" *ngIf="balance.balance < 0">Saldo negativo</span>
              </div>
              <div class="h-[280px]">
                <canvas #chartCanvas data-chart="monthly"></canvas>
              </div>
            </div>

            <div class="xl:col-span-4 card-white p-5">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Distribuicao de gastos</h2>
                  <p class="text-xs text-[#334155] mt-1">Categorias que mais consomem renda</p>
                </div>
              </div>
              <div class="h-[220px]">
                <canvas #chartCanvas data-chart="distribution"></canvas>
              </div>
              <div class="mt-4 space-y-2">
                <div *ngFor="let c of categoryStats.slice(0, 4)" class="flex items-center justify-between gap-3 text-xs">
                  <span class="flex items-center gap-2 min-w-0 text-[#0F172A] dark:text-[#F8FAFC]">
                    <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" [style.background]="c.color"></span>
                    <span class="truncate">{{ c.name }}</span>
                  </span>
                  <span class="text-[#334155]">{{ c.percent | number:'1.0-0' }}%</span>
                </div>
              </div>
            </div>
          </section>

          <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="card-white p-5">
              <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Evolucao financeira</h2>
              <p class="text-xs text-[#334155] mt-1 mb-4">Crescimento acumulado do saldo</p>
              <div class="h-[220px]">
                <canvas #chartCanvas data-chart="evolution"></canvas>
              </div>
            </div>

            <div class="card-white p-5">
              <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Atividade semanal</h2>
              <p class="text-xs text-[#334155] mt-1 mb-4">Gastos por dia da semana</p>
              <div class="h-[220px]">
                <canvas #chartCanvas data-chart="weekly"></canvas>
              </div>
            </div>

            <div class="card-white p-5">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Progresso de metas</h2>
                  <p class="text-xs text-[#334155] mt-1">Conclusao media e prioridades</p>
                </div>
                <span class="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{{ goalCompletion | number:'1.0-0' }}%</span>
              </div>
              <div class="h-[150px] flex items-center justify-center">
                <canvas #chartCanvas data-chart="goals"></canvas>
              </div>
              <div class="space-y-3 mt-4">
                <div *ngFor="let goal of goals.slice(0, 3)">
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="font-medium text-[#0F172A] dark:text-[#F8FAFC] truncate">{{ goal.title }}</span>
                    <span class="text-[#334155]">{{ goal.progress | number:'1.0-0' }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-bar-fill" [style.width.%]="goal.progress"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div class="xl:col-span-4 card-white p-5">
              <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-4">Insights inteligentes</h2>
              <div class="space-y-3">
                <article *ngFor="let insight of insights" class="rounded-lg border border-[#DCFCE7] dark:border-[#14532D] p-3">
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-xs font-semibold text-[#334155] uppercase tracking-wide">{{ insight.title }}</p>
                    <span class="w-2 h-2 rounded-full" [class]="insightDot(insight.tone)"></span>
                  </div>
                  <p class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mt-2">{{ insight.value }}</p>
                  <p class="text-xs text-[#334155] mt-1 leading-5">{{ insight.description }}</p>
                </article>
              </div>
            </div>

            <div class="xl:col-span-8 card-white overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[#DCFCE7] dark:border-[#14532D]">
                <div>
                  <h2 class="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Transacoes recentes</h2>
                  <p class="text-xs text-[#334155] mt-1">Impacto direto no saldo atual</p>
                </div>
                <a routerLink="/transactions" class="text-xs font-medium text-[#334155] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition">Ver todas</a>
              </div>
              <div class="divide-y divide-[#DCFCE7] dark:divide-[#14532D]">
                <div *ngIf="transactions.length === 0" class="px-5 py-12 text-center">
                  <p class="text-sm text-[#334155]">Sem movimentacoes ainda.</p>
                  <a routerLink="/transactions" class="btn-primary text-xs px-3 py-1.5 mt-3 inline-flex">Adicionar transacao</a>
                </div>
                <div *ngFor="let t of transactions.slice(0, 8)" class="flex items-center gap-3 px-5 py-3 hover:bg-[#F7FFF9] dark:hover:bg-[#052E16] transition">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" [style.background]="categoryColor(t) + '22'" [style.color]="categoryColor(t)">
                    <span class="text-sm font-semibold">{{ t.type === 'income' ? '+' : '-' }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] truncate">{{ t.description || t.category_name || 'Movimentacao' }}</p>
                    <p class="text-xs text-[#334155] truncate">{{ t.category_name || 'Sem categoria' }} Â· {{ t.date | date:'dd/MM/yyyy' }}</p>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <p class="text-sm font-semibold" [class]="t.type === 'income' ? 'text-[#16A34A] dark:text-[#22C55E]' : 'text-[#15803D] dark:text-[#22C55E]'">
                      {{ t.type === 'income' ? '+' : '-' }}{{ t.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                    </p>
                    <p class="text-xs text-[#334155]">{{ contribution(t) | number:'1.0-0' }}% do mes</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ng-container>
      </div>
    </app-shell>
  `
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('chartCanvas') chartCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  loading = true;
  balance = { income: 0, expense: 0, balance: 0 };
  transactions: Tx[] = [];
  categories: Category[] = [];
  goals: Goal[] = [];
  kpis: any[] = [];
  insights: Insight[] = [];
  categoryStats: Array<{ name: string; total: number; percent: number; color: string }> = [];
  goalCompletion = 0;
  private charts: Chart[] = [];
  private viewReady = false;
  private isDark = false;
  private destroy$ = new Subject<void>();

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private goalService: GoalService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.darkMode$.pipe(takeUntil(this.destroy$)).subscribe((dark) => {
      this.isDark = dark;
      this.renderCharts();
    });
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.chartCanvases.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.renderCharts());
    this.renderCharts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCharts();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      balance: this.transactionService.getBalance(),
      transactions: this.transactionService.getTransactions({ page: 1, perPage: 200 }),
      categories: this.categoryService.getCategories(),
      goals: this.goalService.getGoals()
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (result: any) => {
        this.balance = result.balance || { income: 0, expense: 0, balance: 0 };
        this.transactions = this.normalizeTransactions(result.transactions?.data || result.transactions || []);
        this.categories = result.categories || [];
        this.goals = (result.goals || []).map((g: Goal) => ({ ...g, progress: this.goalProgress(g) }));
        this.recalculate();
        this.loading = false;
        setTimeout(() => this.renderCharts());
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  insightDot(tone: Insight['tone']): string {
    return tone === 'good' ? 'bg-[#16A34A]' : tone === 'warn' ? 'bg-[#15803D]' : 'bg-[#334155]';
  }

  categoryColor(t: Tx): string {
    const category = this.categories.find(c => c.id === Number(t.category_id) || c.name === t.category_name);
    return category?.color || (t.type === 'income' ? '#16A34A' : '#16A34A');
  }

  contribution(t: Tx): number {
    const base = t.type === 'income' ? this.balance.income : this.balance.expense;
    return base > 0 ? Math.min(100, (Number(t.amount) / base) * 100) : 0;
  }

  private recalculate(): void {
    const savingsRate = this.balance.income > 0 ? (this.balance.balance / this.balance.income) * 100 : 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentNet = this.netForMonth(currentMonth, currentYear);
    const previous = new Date(currentYear, currentMonth - 1, 1);
    const previousNet = this.netForMonth(previous.getMonth(), previous.getFullYear());
    const monthlyVariation = previousNet !== 0 ? ((currentNet - previousNet) / Math.abs(previousNet)) * 100 : currentNet > 0 ? 100 : 0;
    this.goalCompletion = this.goals.length ? this.goals.reduce((s, g) => s + (g.progress || 0), 0) / this.goals.length : 0;

    this.kpis = [
      { label: 'Saldo atual', value: this.money(this.balance.balance), detail: 'Resultado liquido acumulado', icon: 'R$', color: this.balance.balance >= 0 ? 'text-[#16A34A] dark:text-[#22C55E]' : 'text-[#15803D] dark:text-[#22C55E]', bg: 'rgba(22,163,74,0.16)' },
      { label: 'Receitas', value: this.money(this.balance.income), detail: 'Total de entradas registradas', icon: '+', color: 'text-[#16A34A] dark:text-[#22C55E]', bg: 'rgba(22,163,74,0.16)' },
      { label: 'Despesas', value: this.money(this.balance.expense), detail: 'Total de saidas registradas', icon: '-', color: 'text-[#15803D] dark:text-[#22C55E]', bg: 'rgba(22,163,74,0.14)' },
      { label: 'Taxa poupanca', value: `${Math.round(savingsRate)}%`, detail: savingsRate >= 20 ? 'Otima eficiencia de poupanca' : 'Espaco para melhorar retencao', icon: '%', color: savingsRate >= 0 ? 'text-[#0F172A] dark:text-[#F8FAFC]' : 'text-[#15803D] dark:text-[#22C55E]', bg: 'rgba(220,252,231,0.55)' },
      { label: 'Variacao mensal', value: `${monthlyVariation >= 0 ? '+' : ''}${Math.round(monthlyVariation)}%`, detail: 'Comparado ao periodo anterior', icon: '~', color: monthlyVariation >= 0 ? 'text-[#16A34A] dark:text-[#22C55E]' : 'text-[#15803D] dark:text-[#22C55E]', bg: 'rgba(51,65,85,0.12)' },
      { label: 'Metas', value: `${Math.round(this.goalCompletion)}%`, detail: 'Conclusao media dos objetivos', icon: 'â—Ž', color: 'text-[#0F172A] dark:text-[#F8FAFC]', bg: 'rgba(220,252,231,0.55)' }
    ];

    this.categoryStats = this.buildCategoryStats();
    this.insights = this.buildInsights(savingsRate, monthlyVariation);
  }

  private buildInsights(savingsRate: number, monthlyVariation: number): Insight[] {
    const highest = this.categoryStats[0];
    const unusual = this.transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => Number(b.amount) - Number(a.amount))[0];
    return [
      {
        title: 'Maior categoria',
        value: highest ? `${highest.name} Â· ${this.money(highest.total)}` : 'Sem despesas',
        tone: highest && highest.percent > 40 ? 'warn' : 'neutral',
        description: highest ? `Representa ${Math.round(highest.percent)}% dos gastos. Acompanhe se passar de 40%.` : 'Cadastre despesas para obter distribuicao por categoria.'
      },
      {
        title: 'Tendencia de poupanca',
        value: `${Math.round(savingsRate)}% da renda`,
        tone: savingsRate >= 20 ? 'good' : savingsRate < 0 ? 'warn' : 'neutral',
        description: savingsRate >= 20 ? 'Voce esta preservando uma boa fatia da renda.' : 'Tente elevar a taxa para pelo menos 20% como referencia.'
      },
      {
        title: 'Alerta de gasto',
        value: unusual ? this.money(unusual.amount) : 'Sem alerta',
        tone: unusual && Number(unusual.amount) > this.balance.expense * 0.35 ? 'warn' : 'neutral',
        description: unusual ? `${unusual.description || unusual.category_name || 'Maior despesa'} foi a maior saida recente.` : 'Nenhum gasto fora do padrao identificado.'
      },
      {
        title: 'Comparativo mensal',
        value: `${monthlyVariation >= 0 ? '+' : ''}${Math.round(monthlyVariation)}%`,
        tone: monthlyVariation >= 0 ? 'good' : 'warn',
        description: monthlyVariation >= 0 ? 'O resultado liquido melhorou frente ao periodo anterior.' : 'O resultado liquido caiu; revise categorias de maior impacto.'
      }
    ];
  }

  private buildCategoryStats(): Array<{ name: string; total: number; percent: number; color: string }> {
    const totals = new Map<string, { total: number; color: string }>();
    this.transactions.filter(t => t.type === 'expense').forEach(t => {
      const name = t.category_name || this.categories.find(c => c.id === Number(t.category_id))?.name || 'Sem categoria';
      const color = this.categoryColor(t);
      const current = totals.get(name) || { total: 0, color };
      current.total += Number(t.amount) || 0;
      totals.set(name, current);
    });
    const totalExpense = Array.from(totals.values()).reduce((s, c) => s + c.total, 0);
    return Array.from(totals.entries())
      .map(([name, data]) => ({ name, total: data.total, color: data.color, percent: totalExpense ? (data.total / totalExpense) * 100 : 0 }))
      .sort((a, b) => b.total - a.total);
  }

  private renderCharts(): void {
    if (!this.viewReady || this.loading || !this.chartCanvases?.length) return;
    this.destroyCharts();
    this.chartCanvases.forEach((canvas) => {
      const type = canvas.nativeElement.dataset['chart'];
      const config = this.chartConfig(type || '');
      if (config) this.charts.push(new Chart(canvas.nativeElement, config));
    });
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  private chartConfig(type: string): ChartConfiguration | null {
    const text = this.isDark ? '#F8FAFC' : '#0F172A';
    const muted = this.isDark ? '#94A3B8' : '#334155';
    const grid = this.isDark ? 'rgba(248,250,252,0.08)' : 'rgba(15,23,42,0.08)';
    const baseOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: muted, boxWidth: 10, usePointStyle: true } } },
      scales: {
        x: { ticks: { color: muted }, grid: { color: 'transparent' } },
        y: { ticks: { color: muted }, grid: { color: grid } }
      }
    };

    if (type === 'monthly') {
      const monthly = this.monthlySeries();
      return {
        type: 'line',
        data: {
          labels: monthly.labels,
          datasets: [
            { label: 'Receitas', data: monthly.income, borderColor: '#16A34A', backgroundColor: 'rgba(92,122,82,0.12)', fill: true, tension: 0.35 },
            { label: 'Despesas', data: monthly.expense, borderColor: '#15803D', backgroundColor: 'rgba(21,128,61,0.10)', fill: true, tension: 0.35 }
          ]
        },
        options: baseOptions
      };
    }

    if (type === 'distribution') {
      const stats = this.categoryStats.length ? this.categoryStats : [{ name: 'Sem dados', total: 1, percent: 100, color: '#BBF7D0' }];
      return {
        type: 'doughnut',
        data: { labels: stats.map(s => s.name), datasets: [{ data: stats.map(s => s.total), backgroundColor: stats.map(s => s.color), borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false } } } as any
      };
    }

    if (type === 'evolution') {
      const monthly = this.monthlySeries();
      return {
        type: 'line',
        data: { labels: monthly.labels, datasets: [{ label: 'Saldo', data: monthly.balance, borderColor: '#0F172A', backgroundColor: 'rgba(15,23,42,0.10)', fill: true, tension: 0.4 }] },
        options: { ...baseOptions, plugins: { legend: { display: false } } }
      };
    }

    if (type === 'weekly') {
      const weekly = this.weeklySeries();
      return {
        type: 'bar',
        data: { labels: weekly.labels, datasets: [{ label: 'Gastos', data: weekly.values, backgroundColor: '#16A34A', borderRadius: 6 }] },
        options: { ...baseOptions, plugins: { legend: { display: false } } }
      };
    }

    if (type === 'goals') {
      return {
        type: 'doughnut',
        data: { labels: ['Concluido', 'Restante'], datasets: [{ data: [this.goalCompletion, Math.max(0, 100 - this.goalCompletion)], backgroundColor: ['#16A34A', this.isDark ? '#14532D' : '#DCFCE7'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '74%', plugins: { legend: { display: false }, tooltip: { enabled: false } } } as any
      };
    }

    return null;
  }

  private monthlySeries() {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - (5 - i), 1));
    let cumulative = 0;
    return {
      labels: months.map(d => d.toLocaleDateString('pt-BR', { month: 'short' })),
      income: months.map(d => this.sumFor(d.getMonth(), d.getFullYear(), 'income')),
      expense: months.map(d => this.sumFor(d.getMonth(), d.getFullYear(), 'expense')),
      balance: months.map(d => {
        cumulative += this.sumFor(d.getMonth(), d.getFullYear(), 'income') - this.sumFor(d.getMonth(), d.getFullYear(), 'expense');
        return cumulative;
      })
    };
  }

  private weeklySeries() {
    const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const values = labels.map((_, day) => this.transactions
      .filter(t => t.type === 'expense' && new Date(`${t.date}T00:00:00`).getDay() === day)
      .reduce((s, t) => s + Number(t.amount || 0), 0));
    return { labels, values };
  }

  private sumFor(month: number, year: number, type: Tx['type']): number {
    return this.transactions
      .filter(t => {
        const d = new Date(`${t.date}T00:00:00`);
        return t.type === type && d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((s, t) => s + Number(t.amount || 0), 0);
  }

  private netForMonth(month: number, year: number): number {
    return this.sumFor(month, year, 'income') - this.sumFor(month, year, 'expense');
  }

  private goalProgress(goal: Goal): number {
    const target = Number(goal.target_amount) || 0;
    return Math.min(100, Math.max(0, target > 0 ? (Number(goal.current_amount || 0) / target) * 100 : 0));
  }

  private money(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(value) || 0);
  }

  private normalizeTransactions(items: any[]): Tx[] {
    return items.map(t => ({ ...t, amount: Number(t.amount) || 0 })).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }
}

