-- Personal Finance Management System - SQLite Schema
-- Created: 2026-01-15

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  profile_image TEXT,
  phone TEXT,
  locale TEXT DEFAULT 'pt',
  theme TEXT DEFAULT 'dark',
  is_active INTEGER DEFAULT 1,
  role TEXT DEFAULT 'user',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT 'tag',
  type TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, name)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  month INTEGER,
  year INTEGER,
  notes TEXT,
  attachment_url TEXT,
  is_recurring INTEGER DEFAULT 0,
  recurrence_pattern TEXT,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  category TEXT,
  color TEXT DEFAULT '#8b5cf6',
  icon TEXT DEFAULT 'target',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'not_started',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Password resets table
CREATE TABLE IF NOT EXISTS password_resets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  report_type TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_income DECIMAL(15,2) DEFAULT 0,
  total_expense DECIMAL(15,2) DEFAULT 0,
  net_balance DECIMAL(15,2) DEFAULT 0,
  data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_month_year ON transactions(month, year);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_end_date ON goals(end_date);

CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(email);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON password_resets(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_period ON reports(period_start, period_end);

-- Sample data
INSERT OR IGNORE INTO users (id, email, password, full_name, role) VALUES
(
  1,
  'lirialia51@gmail.com',
  '$2y$10$85vJLNrn5Cv2ALsEVhK33.AGqiGrLORlIrqrol83fEU.yHTUdN4PS',
  'Utilizador PadrÃ£o',
  'user'
),
(
  2,
  '20230237@isptec.co.ao',
  '$2y$10$85vJLNrn5Cv2ALsEVhK33.AGqiGrLORlIrqrol83fEU.yHTUdN4PS',
  'Administrador',
  'admin'
);

INSERT OR IGNORE INTO categories (user_id, name, type, color, icon) VALUES
(1, 'SalÃ¡rio', 'income', '#10b981', 'briefcase'),
(1, 'Freelance', 'income', '#3b82f6', 'code'),
(1, 'Investimentos', 'income', '#f59e0b', 'trending-up'),
(1, 'AlimentaÃ§Ã£o', 'expense', '#ef4444', 'utensils'),
(1, 'Transporte', 'expense', '#8b5cf6', 'car'),
(1, 'Utilidades', 'expense', '#ec4899', 'zap'),
(1, 'Entretenimento', 'expense', '#06b6d4', 'music'),
(1, 'SaÃºde', 'expense', '#14b8a6', 'heart');

INSERT OR IGNORE INTO transactions (user_id, category_id, type, description, amount, date, month, year) VALUES
(1, 1, 'income', 'SalÃ¡rio mensal', 3000.00, '2026-01-01', 1, 2026),
(1, 4, 'expense', 'Mercado semanal', 150.00, '2026-01-05', 1, 2026),
(1, 5, 'expense', 'Gasolina', 80.00, '2026-01-07', 1, 2026),
(1, 6, 'expense', 'Conta de energia', 120.00, '2026-01-08', 1, 2026),
(1, 7, 'expense', 'Cinema', 30.00, '2026-01-10', 1, 2026),
(1, 2, 'income', 'Projeto freelance', 500.00, '2026-01-12', 1, 2026);

INSERT OR IGNORE INTO goals (user_id, title, target_amount, start_date, end_date, priority, status) VALUES
(1, 'Fundo de EmergÃªncia', 10000.00, '2026-01-01', '2026-12-31', 'high', 'in_progress'),
(1, 'FÃ©rias de VerÃ£o', 3000.00, '2026-01-01', '2026-06-30', 'medium', 'in_progress'),
(1, 'Novo Laptop', 2000.00, '2026-01-01', '2026-12-31', 'medium', 'not_started');


-- Ensure admin user (id=2) has sample categories
INSERT OR IGNORE INTO categories (user_id, name, type, color, icon) VALUES
(2, 'Salário', 'income', '#10b981', 'briefcase'),
(2, 'Freelance', 'income', '#3b82f6', 'code'),
(2, 'Investimentos', 'income', '#f59e0b', 'trending-up'),
(2, 'Alimentação', 'expense', '#ef4444', 'utensils'),
(2, 'Transporte', 'expense', '#8b5cf6', 'car'),
(2, 'Utilidades', 'expense', '#ec4899', 'zap'),
(2, 'Entretenimento', 'expense', '#06b6d4', 'music'),
(2, 'Saúde', 'expense', '#14b8a6', 'heart');

-- Ensure admin user (id=2) has sample goals
INSERT OR IGNORE INTO goals (user_id, title, target_amount, start_date, end_date, priority, status) VALUES
(2, 'Fundo de Emergência', 10000.00, '2026-01-01', '2026-12-31', 'high', 'in_progress'),
(2, 'Férias de Verão', 3000.00, '2026-01-01', '2026-06-30', 'medium', 'in_progress'),
(2, 'Novo Laptop', 2000.00, '2026-01-01', '2026-12-31', 'medium', 'not_started');
