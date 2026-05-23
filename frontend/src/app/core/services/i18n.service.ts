import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const LANG_KEY = 'language';
const DEFAULT_LANG = 'pt';

// All UI strings in both languages.
// Key = Portuguese string (canonical), value = English translation.
const STRINGS: Record<string, string> = {
  // Nav / sidebar
  'Dashboard': 'Dashboard',
  'Transações': 'Transactions',
  'Categorias': 'Categories',
  'Metas': 'Goals',
  'Admin': 'Admin',
  'Sair': 'Logout',
  'Perfil e conta': 'Profile and account',

  // Auth
  'Entrar': 'Login',
  'Criar conta': 'Create account',
  'Criar conta gratuita': 'Create free account',
  'Começar grátis': 'Start free',
  'Começar': 'Start',
  'Esqueceu?': 'Forgot?',
  'Bem-vindo de volta': 'Welcome back',
  'Entre na sua conta para continuar': 'Sign in to your account to continue',
  'Gratuito para sempre. Sem cartão de crédito.': 'Free forever. No credit card required.',
  'Não tem conta?': "Don't have an account?",
  'Já tem conta?': 'Already have an account?',
  'Nome completo': 'Full name',
  'E-mail': 'Email',
  'Senha': 'Password',
  'Confirmar senha': 'Confirm password',
  'Mínimo 8 caracteres': 'Minimum 8 characters',
  'Repita a senha': 'Repeat password',
  'Entrando...': 'Signing in...',
  'Criando conta...': 'Creating account...',
  'Credenciais inválidas': 'Invalid credentials',
  'Erro ao criar conta': 'Error creating account',
  'E-mail inválido': 'Invalid email',
  'Senha obrigatória': 'Password required',
  'Nome obrigatório (mín. 3 caracteres)': 'Name required (min. 3 characters)',
  'As senhas não coincidem': 'Passwords do not match',

  // Landing
  'Funcionalidades': 'Features',
  'Depoimentos': 'Testimonials',
  'Ver demonstração': 'View demo',
  'Sem cartão de crédito. Cancele quando quiser.': 'No credit card. Cancel anytime.',
  'Controle financeiro sem complicação': 'Financial control without complications',
  'Wallet Vision reúne todas as suas finanças em um só lugar. Acompanhe gastos, defina metas e tome decisões com clareza.': 'Wallet Vision brings all your finances together in one place. Track spending, set goals and make decisions with clarity.',
  'Novo — Relatórios inteligentes disponíveis': 'New — Smart reports available',
  'Usuários ativos': 'Active users',
  'Transações registradas': 'Transactions recorded',
  'Satisfação': 'Satisfaction',
  'Avaliação média': 'Average rating',
  'Tudo que você precisa': 'Everything you need',
  'Uma plataforma completa para gestão financeira pessoal, sem complexidade desnecessária.': 'A complete platform for personal financial management, without unnecessary complexity.',
  'O que dizem nossos usuários': 'What our users say',
  'Produto': 'Product',
  'Legal': 'Legal',
  'Privacidade': 'Privacy',
  'Termos': 'Terms',
  'Gestão financeira inteligente para pessoas que valorizam clareza e controle.': 'Smart financial management for people who value clarity and control.',
  '© 2026 Wallet Vision. Todos os direitos reservados.': '© 2026 Wallet Vision. All rights reserved.',
  'Controle de gastos': 'Expense tracking',
  'Registre e categorize todas as suas transações com facilidade. Veja para onde vai cada centavo.': 'Record and categorize all your transactions easily. See where every cent goes.',
  'Metas financeiras': 'Financial goals',
  'Controle financeiro': 'Financial control',
  'sem complicação': 'without complications',
  'Defina objetivos e acompanhe seu progresso. Do fundo de emergência à viagem dos sonhos.': 'Set objectives and track your progress. From emergency fund to dream vacation.',
  'Relatórios visuais': 'Visual reports',
  'Gráficos claros e intuitivos que mostram sua saúde financeira de forma imediata.': 'Clear and intuitive charts that show your financial health immediately.',
  'Categorias personalizadas': 'Custom categories',
  'Organize suas finanças do seu jeito. Crie categorias que fazem sentido para a sua vida.': 'Organize your finances your way. Create categories that make sense for your life.',
  'Modo escuro': 'Dark mode',
  'Interface elegante em modo claro ou escuro. Seu conforto visual em primeiro lugar.': 'Elegant interface in light or dark mode. Your visual comfort comes first.',
  'Segurança total': 'Total security',
  'Seus dados protegidos com autenticação JWT e criptografia de ponta a ponta.': 'Your data protected with JWT authentication and end-to-end encryption.',

  // Dashboard
  'Inteligencia financeira': 'Financial intelligence',
  'Visao geral': 'Overview',
  'Resumo do mes, tendencias e pontos de atencao da sua vida financeira.': 'Monthly summary, trends and key points of your financial life.',
  'Atualizado com': 'Updated with',
  'movimentacoes': 'transactions',
  'Saldo atual': 'Current balance',
  'Resultado liquido acumulado': 'Accumulated net result',
  'Receitas': 'Income',
  'Total de entradas registradas': 'Total recorded income',
  'Despesas': 'Expenses',
  'Total de saidas registradas': 'Total recorded expenses',
  'Taxa poupanca': 'Savings rate',
  'Otima eficiencia de poupanca': 'Excellent savings efficiency',
  'Espaco para melhorar retencao': 'Room to improve retention',
  'Variacao mensal': 'Monthly variation',
  'Comparado ao periodo anterior': 'Compared to previous period',
  'Conclusao media dos objetivos': 'Average goal completion',
  'Receitas vs despesas': 'Income vs expenses',
  'Comparacao mensal dos ultimos periodos': 'Monthly comparison of recent periods',
  'Saldo positivo': 'Positive balance',
  'Saldo negativo': 'Negative balance',
  'Distribuicao de gastos': 'Expense distribution',
  'Categorias que mais consomem renda': 'Categories consuming most income',
  'Evolucao financeira': 'Financial evolution',
  'Crescimento acumulado do saldo': 'Accumulated balance growth',
  'Atividade semanal': 'Weekly activity',
  'Gastos por dia da semana': 'Spending by day of week',
  'Progresso de metas': 'Goal progress',
  'Conclusao media e prioridades': 'Average completion and priorities',
  'Insights inteligentes': 'Smart insights',
  'Transacoes recentes': 'Recent transactions',
  'Impacto direto no saldo atual': 'Direct impact on current balance',
  'Ver todas': 'View all',
  'Sem movimentacoes ainda.': 'No transactions yet.',
  'Adicionar transacao': 'Add transaction',
  'Sem categoria': 'No category',
  'do mes': 'of month',
  'Maior categoria': 'Top category',
  'Sem despesas': 'No expenses',
  'Tendencia de poupanca': 'Savings trend',
  'da renda': 'of income',
  'Alerta de gasto': 'Spending alert',
  'Sem alerta': 'No alert',
  'Comparativo mensal': 'Monthly comparison',

  // Transactions
  'Histórico completo de movimentações': 'Complete transaction history',
  'Nova transação': 'New transaction',
  'Editar transação': 'Edit transaction',
  'Todos os tipos': 'All types',
  'Receita': 'Income',
  'Despesa': 'Expense',
  'Limpar': 'Clear',
  'Entradas filtradas': 'Filtered income',
  'Saídas filtradas': 'Filtered expenses',
  'Resultado': 'Result',
  'Descrição': 'Description',
  'Categoria': 'Category',
  'Data': 'Date',
  'Tipo': 'Type',
  'Valor': 'Amount',
  'Ações': 'Actions',
  'Nenhuma transação encontrada': 'No transactions found',
  'Mostrando': 'Showing',
  'de': 'of',
  'transações': 'transactions',
  'Anterior': 'Previous',
  'Página': 'Page',
  'Próxima': 'Next',
  'Selecione uma categoria': 'Select a category',
  'Ex: Salário, Aluguel...': 'E.g.: Salary, Rent...',
  'Observações adicionais...': 'Additional notes...',
  'Notas': 'Notes',
  'Salvando...': 'Saving...',
  'Salvar': 'Save',
  'Cancelar': 'Cancel',
  'Confirmar exclusão': 'Confirm deletion',
  'Esta ação não pode ser desfeita.': 'This action cannot be undone.',
  'Deletando...': 'Deleting...',
  'Deletar': 'Delete',

  // Goals
  'Acompanhe seu progresso rumo aos seus objetivos': 'Track your progress toward your goals',
  'Nova meta': 'New goal',
  'Editar meta': 'Edit goal',
  'Progresso médio': 'Average progress',
  'Total restante': 'Total remaining',
  'Metas no caminho': 'Goals on track',
  'Nenhuma meta definida ainda': 'No goals defined yet',
  'Criar primeira meta': 'Create first goal',
  'Esperado:': 'Expected:',
  'Dias restantes:': 'Days remaining:',
  'Restante:': 'Remaining:',
  'Mensal necessário:': 'Monthly needed:',
  'No caminho': 'On track',
  'Muito atrasado': 'Very behind',
  'Atrasado': 'Behind',
  'Não iniciada': 'Not started',
  'Em progresso': 'In progress',
  'Concluída': 'Completed',
  'Pausada': 'Paused',
  'Título': 'Title',
  'Ex: Reserva de emergência': 'E.g.: Emergency fund',
  'Opcional': 'Optional',
  'Valor alvo (R$)': 'Target amount (R$)',
  'Valor atual (R$)': 'Current amount (R$)',
  'Data de início': 'Start date',
  'Prazo': 'Deadline',
  'Prioridade': 'Priority',
  'Baixa': 'Low',
  'Média': 'Medium',
  'Alta': 'High',
  'Status': 'Status',
  'Histório de progresso será perdido.': 'Progress history will be lost.',

  // Categories
  'Organize suas transações por categoria': 'Organize your transactions by category',
  'Nova categoria': 'New category',
  'Editar categoria': 'Edit category',
  'Todas': 'All',
  'Categorias ativas': 'Active categories',
  'Mais usada': 'Most used',
  'Maior impacto': 'Biggest impact',
  'Sem dados': 'No data',
  'Nenhuma categoria encontrada': 'No categories found',
  'Criar categoria': 'Create category',
  'Nome': 'Name',
  'Ex: Alimentação': 'E.g.: Food',
  'Cor': 'Color',
  'Ícone': 'Icon',
  

  // Admin
  'Painel Administrativo': 'Admin Panel',
  'Visão geral da plataforma': 'Platform overview',
  'Total usuários': 'Total users',
  'Ativos hoje': 'Active today',
  
  'este mês': 'this month',
  'Usuários': 'Users',
  'registrados': 'registered',
  'Usuário': 'User',
  'Função': 'Role',
  'Último login': 'Last login',
  'Cadastro': 'Registered',
  'Nenhum usuário encontrado': 'No users found',
  'Nunca': 'Never',
  'Ativo': 'Active',
  'Inativo': 'Inactive',
  'Suspender': 'Suspend',
  'Ativar': 'Activate',
  'Apagar': 'Delete',
  'Alterar função': 'Change role',
  'Confirmar': 'Confirm',

  // Common
  'Saldo': 'Balance',
  'Adicionar': 'Add',
  'Editar': 'Edit',
  'Excluir': 'Delete',
  'Carregando...': 'Loading...',
  'Erro': 'Error',
  'Sucesso': 'Success',
  'Tema': 'Theme',
  'Idioma': 'Language',
  'Modo Claro': 'Light Mode',
  'Modo Escuro': 'Dark Mode',
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private langSubject = new BehaviorSubject<string>(
    localStorage.getItem(LANG_KEY) || DEFAULT_LANG
  );
  public language$: Observable<string> = this.langSubject.asObservable();

  setLanguage(lang: string): void {
    if (lang !== 'pt' && lang !== 'en') return;
    localStorage.setItem(LANG_KEY, lang);
    this.langSubject.next(lang);
  }

  getLanguage(): string { return this.langSubject.value; }

  toggleLanguage(): void {
    this.setLanguage(this.langSubject.value === 'pt' ? 'en' : 'pt');
  }

  /**
   * Translate a Portuguese string to the current language.
   * Falls back to the input string if no translation found.
   */
  t(pt: string, en?: string): string {
    if (this.langSubject.value === 'pt') return pt;
    // Prefer explicit en override, then dictionary lookup, then pt fallback
    return en ?? STRINGS[pt] ?? pt;
  }

  /**
   * Apply translations to static DOM elements outside Angular templates.
   * Searches for `title`, elements with `data-i18n` (text) and
   * `data-i18n-placeholder` (input placeholders).
   */
  applyDocumentTranslations(): void {
    if (typeof document === 'undefined') return;

    const titleEl = document.querySelector('title');
    if (titleEl && titleEl.textContent) {
      titleEl.textContent = this.t(titleEl.textContent.trim());
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = (el.getAttribute('data-i18n') || el.textContent || '').trim();
      if (key) el.textContent = this.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = (el.getAttribute('data-i18n-placeholder') || '').trim();
      if (!key) return;
      try {
        (el as HTMLInputElement).placeholder = this.t(key);
      } catch (e) {
        // ignore non-inputs
      }
    });
  }

  /** Legacy key-based lookup kept for backward compat */
  translate(key: string): string { return this.t(key); }
}
