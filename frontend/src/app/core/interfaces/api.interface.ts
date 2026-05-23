/**
 * Interfaces comuns para a API
 */

// Resposta padrão da API backend
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Resposta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

// Erro da API
export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// Usuário
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  locale: string;
  theme: string;
  phone?: string;
  profile_image?: string;
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

// Dados de autenticação
export interface AuthData {
  user: User;
  token: string;
}

// Credenciais de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Dados de registro
export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

// Transação
export interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  category_name?: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  notes?: string;
  attachment_url?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  created_at?: string;
  updated_at?: string;
}

// Saldo
export interface Balance {
  income: number;
  expense: number;
  balance: number;
}

// Categoria
export interface Category {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
  order_index?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Meta
export interface Goal {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  progress?: number;
  start_date: string;
  end_date: string;
  category?: string;
  color?: string;
  icon?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  created_at?: string;
  updated_at?: string;
}

// Filtros de transação
export interface TransactionFilters {
  page?: number;
  perPage?: number;
  type?: 'income' | 'expense';
  month?: number;
  year?: number;
  search?: string;
  category_id?: number;
}

// Filtros de categoria
export interface CategoryFilters {
  type?: 'income' | 'expense';
}

// Filtros de meta
export interface GoalFilters {
  status?: string;
}
