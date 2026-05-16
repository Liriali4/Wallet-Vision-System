import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F5EBE6] text-[#3D312A]">

      <!-- ── NAV ── -->
      <nav class="sticky top-0 z-50 bg-[#F5EBE6]/90 backdrop-blur-sm border-b border-[#EAD5C9]">
        <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-[#3D312A] flex items-center justify-center">
              <svg class="w-4 h-4 text-[#F5EBE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
              </svg>
            </div>
            <span class="font-semibold text-sm tracking-tight">Wallet Vision</span>
          </div>
          <div class="hidden md:flex items-center gap-6 text-sm text-[#8C7365]">
            <a href="#features" class="hover:text-[#3D312A] transition">Funcionalidades</a>
            <a href="#pricing" class="hover:text-[#3D312A] transition">Preços</a>
            <a href="#testimonials" class="hover:text-[#3D312A] transition">Depoimentos</a>
          </div>
          <div class="flex items-center gap-2">
            <a routerLink="/auth/login" class="btn-secondary text-xs px-3 py-1.5">Entrar</a>
            <a routerLink="/auth/register" class="btn-primary text-xs px-3 py-1.5">Começar grátis</a>
          </div>
        </div>
      </nav>

      <!-- ── HERO ── -->
      <section class="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAD5C9] border border-[#D9C4B8] text-xs font-medium text-[#8C7365] mb-6">
            <span class="w-1.5 h-1.5 rounded-full bg-[#A3B19B]"></span>
            Novo — Relatórios inteligentes disponíveis
          </div>
          <h1 class="text-5xl font-bold text-[#3D312A] leading-tight tracking-tight mb-5">
            Controle financeiro<br/>sem complicação
          </h1>
          <p class="text-lg text-[#8C7365] leading-relaxed mb-8 max-w-xl">
            Wallet Vision reúne todas as suas finanças em um só lugar. Acompanhe gastos, defina metas e tome decisões com clareza.
          </p>
          <div class="flex items-center gap-3">
            <a routerLink="/auth/register" class="btn-primary px-5 py-2.5 text-sm">
              Criar conta gratuita
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a routerLink="/auth/login" class="btn-secondary px-5 py-2.5 text-sm">Ver demonstração</a>
          </div>
          <p class="text-xs text-[#8C7365] mt-4">Sem cartão de crédito. Cancele quando quiser.</p>
        </div>

        <!-- Dashboard mockup -->
        <div class="mt-14 rounded-xl border border-[#D9C4B8] bg-[#FDFAF8] shadow-[0_8px_40px_rgba(61,49,42,0.10)] overflow-hidden">
          <!-- Mockup header bar -->
          <div class="flex items-center gap-1.5 px-4 py-3 border-b border-[#EAD5C9] bg-[#F5EBE6]">
            <div class="w-2.5 h-2.5 rounded-full bg-[#D98A74]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-[#EAD5C9]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-[#A3B19B]"></div>
            <div class="flex-1 mx-4 h-5 rounded bg-[#EAD5C9] max-w-xs"></div>
          </div>
          <!-- Mockup content -->
          <div class="flex">
            <!-- Sidebar mock -->
            <div class="w-[180px] border-r border-[#EAD5C9] p-3 space-y-1 hidden md:block">
              <div class="h-7 rounded-md bg-[#3D312A] w-full"></div>
              <div class="h-7 rounded-md bg-[#EAD5C9] w-full"></div>
              <div class="h-7 rounded-md bg-[#EAD5C9] w-full"></div>
              <div class="h-7 rounded-md bg-[#EAD5C9] w-3/4"></div>
            </div>
            <!-- Main mock -->
            <div class="flex-1 p-5 space-y-4">
              <div class="grid grid-cols-3 gap-3">
                <div class="rounded-lg border border-[#EAD5C9] p-3 space-y-2">
                  <div class="h-3 rounded bg-[#EAD5C9] w-1/2"></div>
                  <div class="h-6 rounded bg-[#3D312A] w-3/4"></div>
                </div>
                <div class="rounded-lg border border-[#EAD5C9] p-3 space-y-2">
                  <div class="h-3 rounded bg-[#EAD5C9] w-1/2"></div>
                  <div class="h-6 rounded bg-[#A3B19B] w-3/4"></div>
                </div>
                <div class="rounded-lg border border-[#EAD5C9] p-3 space-y-2">
                  <div class="h-3 rounded bg-[#EAD5C9] w-1/2"></div>
                  <div class="h-6 rounded bg-[#D98A74] w-3/4"></div>
                </div>
              </div>
              <div class="rounded-lg border border-[#EAD5C9] p-3 space-y-2">
                <div class="h-3 rounded bg-[#EAD5C9] w-1/4 mb-3"></div>
                <div class="space-y-2">
                  <div *ngFor="let i of [1,2,3,4]" class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-full bg-[#EAD5C9] flex-shrink-0"></div>
                    <div class="flex-1 h-3 rounded bg-[#EAD5C9]"></div>
                    <div class="w-16 h-3 rounded bg-[#EAD5C9]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── STATS ── -->
      <section class="border-y border-[#EAD5C9] bg-[#EAD5C9]/40">
        <div class="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div *ngFor="let stat of stats" class="text-center">
            <p class="text-3xl font-bold text-[#3D312A] tracking-tight">{{ stat.value }}</p>
            <p class="text-sm text-[#8C7365] mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </section>

      <!-- ── FEATURES ── -->
      <section id="features" class="max-w-6xl mx-auto px-6 py-20">
        <div class="text-center mb-12">
          <p class="text-xs font-semibold text-[#8C7365] uppercase tracking-widest mb-3">Funcionalidades</p>
          <h2 class="text-3xl font-bold text-[#3D312A] tracking-tight">Tudo que você precisa</h2>
          <p class="text-[#8C7365] mt-3 max-w-md mx-auto">Uma plataforma completa para gestão financeira pessoal, sem complexidade desnecessária.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-5">
          <div *ngFor="let feature of features" class="card-white p-5 hover:shadow-[0_4px_16px_rgba(61,49,42,0.08)] transition-shadow">
            <div class="w-9 h-9 rounded-lg bg-[#EAD5C9] flex items-center justify-center mb-4">
              <span [innerHTML]="feature.icon" class="w-5 h-5 text-[#3D312A]"></span>
            </div>
            <h3 class="font-semibold text-[#3D312A] mb-1.5">{{ feature.title }}</h3>
            <p class="text-sm text-[#8C7365] leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </section>

      <!-- ── PRICING ── -->
      <section id="pricing" class="bg-[#EAD5C9]/30 border-y border-[#EAD5C9]">
        <div class="max-w-6xl mx-auto px-6 py-20">
          <div class="text-center mb-12">
            <p class="text-xs font-semibold text-[#8C7365] uppercase tracking-widest mb-3">Preços</p>
            <h2 class="text-3xl font-bold text-[#3D312A] tracking-tight">Simples e transparente</h2>
          </div>
          <div class="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div *ngFor="let plan of plans" class="card-white p-6 relative" [class.ring-2]="plan.featured" [class.ring-[#3D312A]]="plan.featured">
              <div *ngIf="plan.featured" class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#3D312A] text-[#F5EBE6] text-xs font-medium rounded-full">Popular</div>
              <p class="font-semibold text-[#3D312A] mb-1">{{ plan.name }}</p>
              <div class="flex items-baseline gap-1 mb-4">
                <span class="text-3xl font-bold text-[#3D312A]">{{ plan.price }}</span>
                <span class="text-sm text-[#8C7365]">{{ plan.period }}</span>
              </div>
              <ul class="space-y-2 mb-6">
                <li *ngFor="let f of plan.features" class="flex items-center gap-2 text-sm text-[#8C7365]">
                  <svg class="w-4 h-4 text-[#A3B19B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {{ f }}
                </li>
              </ul>
              <a routerLink="/auth/register" [class]="plan.featured ? 'btn-primary w-full justify-center text-sm' : 'btn-secondary w-full justify-center text-sm'">
                Começar
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ── TESTIMONIALS ── -->
      <section id="testimonials" class="max-w-6xl mx-auto px-6 py-20">
        <div class="text-center mb-12">
          <p class="text-xs font-semibold text-[#8C7365] uppercase tracking-widest mb-3">Depoimentos</p>
          <h2 class="text-3xl font-bold text-[#3D312A] tracking-tight">O que dizem nossos usuários</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-5">
          <div *ngFor="let t of testimonials" class="card-white p-5">
            <div class="flex items-center gap-1 mb-3">
              <svg *ngFor="let s of [1,2,3,4,5]" class="w-3.5 h-3.5 text-[#D98A74]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-sm text-[#3D312A] leading-relaxed mb-4">"{{ t.text }}"</p>
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-[#EAD5C9] flex items-center justify-center text-xs font-semibold text-[#3D312A]">
                {{ t.name.charAt(0) }}
              </div>
              <div>
                <p class="text-xs font-medium text-[#3D312A]">{{ t.name }}</p>
                <p class="text-xs text-[#8C7365]">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── FOOTER ── -->
      <footer class="border-t border-[#EAD5C9] bg-[#EAD5C9]/30">
        <div class="max-w-6xl mx-auto px-6 py-10">
          <div class="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="w-6 h-6 rounded-md bg-[#3D312A] flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-[#F5EBE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
                  </svg>
                </div>
                <span class="font-semibold text-sm text-[#3D312A]">Wallet Vision</span>
              </div>
              <p class="text-xs text-[#8C7365] max-w-xs">Gestão financeira inteligente para pessoas que valorizam clareza e controle.</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div>
                <p class="font-medium text-[#3D312A] mb-3">Produto</p>
                <ul class="space-y-2 text-[#8C7365]">
                  <li><a href="#features" class="hover:text-[#3D312A] transition">Funcionalidades</a></li>
                  <li><a href="#pricing" class="hover:text-[#3D312A] transition">Preços</a></li>
                  <li><a routerLink="/auth/register" class="hover:text-[#3D312A] transition">Começar</a></li>
                </ul>
              </div>
              <div>
                <p class="font-medium text-[#3D312A] mb-3">Legal</p>
                <ul class="space-y-2 text-[#8C7365]">
                  <li><a href="#" class="hover:text-[#3D312A] transition">Privacidade</a></li>
                  <li><a href="#" class="hover:text-[#3D312A] transition">Termos</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="mt-8 pt-6 border-t border-[#EAD5C9] flex items-center justify-between">
            <p class="text-xs text-[#8C7365]">© 2026 Wallet Vision. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {
  stats = [
    { value: '12k+', label: 'Usuários ativos' },
    { value: 'R$2M+', label: 'Transações registradas' },
    { value: '98%', label: 'Satisfação' },
    { value: '4.9', label: 'Avaliação média' },
  ];

  features = [
    {
      title: 'Controle de gastos',
      desc: 'Registre e categorize todas as suas transações com facilidade. Veja para onde vai cada centavo.',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>`
    },
    {
      title: 'Metas financeiras',
      desc: 'Defina objetivos e acompanhe seu progresso. Do fundo de emergência à viagem dos sonhos.',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>`
    },
    {
      title: 'Relatórios visuais',
      desc: 'Gráficos claros e intuitivos que mostram sua saúde financeira de forma imediata.',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>`
    },
    {
      title: 'Categorias personalizadas',
      desc: 'Organize suas finanças do seu jeito. Crie categorias que fazem sentido para a sua vida.',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /></svg>`
    },
    {
      title: 'Modo escuro',
      desc: 'Interface elegante em modo claro ou escuro. Seu conforto visual em primeiro lugar.',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`
    },
    {
      title: 'Segurança total',
      desc: 'Seus dados protegidos com autenticação JWT e criptografia de ponta a ponta.',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>`
    },
  ];

  plans = [
    {
      name: 'Gratuito', price: 'R$0', period: '/mês', featured: false,
      features: ['Até 50 transações/mês', '3 categorias', 'Dashboard básico', 'Suporte por e-mail']
    },
    {
      name: 'Pro', price: 'R$19', period: '/mês', featured: true,
      features: ['Transações ilimitadas', 'Categorias ilimitadas', 'Relatórios avançados', 'Metas financeiras', 'Suporte prioritário']
    },
    {
      name: 'Família', price: 'R$39', period: '/mês', featured: false,
      features: ['Tudo do Pro', 'Até 5 usuários', 'Painel familiar', 'Exportação de dados', 'API access']
    },
  ];

  testimonials = [
    { name: 'Ana Souza', role: 'Designer', text: 'Finalmente um app de finanças que não parece um sistema bancário dos anos 2000. Uso todo dia.' },
    { name: 'Carlos Lima', role: 'Desenvolvedor', text: 'A interface é impecável. Consigo ver minha situação financeira em segundos, sem precisar navegar por menus.' },
    { name: 'Mariana Costa', role: 'Empreendedora', text: 'As metas financeiras me ajudaram a juntar para minha reserva de emergência em 6 meses. Recomendo.' },
  ];
}
