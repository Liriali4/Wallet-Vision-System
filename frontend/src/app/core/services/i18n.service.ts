import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private language: string = localStorage.getItem('language') || 'pt';

  private translations: Record<string, Record<string, string>> = {
    pt: {
      'dashboard': 'Painel de Controle',
      'transactions': 'Transações',
      'income': 'Receitas',
      'expense': 'Despesas',
      'categories': 'Categorias',
      'goals': 'Metas',
      'reports': 'Relatórios',
      'settings': 'Configurações',
      'balance': 'Saldo',
      'month': 'Mês',
      'year': 'Ano',
      'add': 'Adicionar',
      'edit': 'Editar',
      'delete': 'Deletar',
      'save': 'Salvar',
      'cancel': 'Cancelar',
      'loading': 'Carregando...',
      'error': 'Erro',
      'success': 'Sucesso',
      'logout': 'Sair',
      'login': 'Entrar',
      'register': 'Registrar',
      'email': 'E-mail',
      'password': 'Senha',
      'fullName': 'Nome Completo',
      'welcome': 'Bem-vindo',
    },
    en: {
      'dashboard': 'Dashboard',
      'transactions': 'Transactions',
      'income': 'Income',
      'expense': 'Expense',
      'categories': 'Categories',
      'goals': 'Goals',
      'reports': 'Reports',
      'settings': 'Settings',
      'balance': 'Balance',
      'month': 'Month',
      'year': 'Year',
      'add': 'Add',
      'edit': 'Edit',
      'delete': 'Delete',
      'save': 'Save',
      'cancel': 'Cancel',
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      'logout': 'Logout',
      'login': 'Login',
      'register': 'Register',
      'email': 'Email',
      'password': 'Password',
      'fullName': 'Full Name',
      'welcome': 'Welcome',
    }
  };

  constructor() { }

  setLanguage(lang: string): void {
    this.language = lang;
    localStorage.setItem('language', lang);
  }

  getLanguage(): string {
    return this.language;
  }

  translate(key: string): string {
    return this.translations[this.language]?.[key] || key;
  }

  t(key: string): string {
    return this.translate(key);
  }
}
