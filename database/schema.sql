-- Personal Finance Management System - Database Schema
-- Created: 2026-01-15

CREATE DATABASE IF NOT EXISTS wallet_vision CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wallet_vision;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS=1;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  phone VARCHAR(20),
  locale VARCHAR(10) DEFAULT 'pt',
  theme VARCHAR(10) DEFAULT 'dark',
  is_active BOOLEAN DEFAULT true,
  role ENUM('user', 'admin') DEFAULT 'user',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6366f1',
  icon VARCHAR(50) DEFAULT 'tag',
  type ENUM('income', 'expense') NOT NULL,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  UNIQUE KEY uniq_user_category (user_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  description VARCHAR(255),
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  month INT,
  year INT,
  notes TEXT,
  attachment_url VARCHAR(255),
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(50),
  transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_user_id (user_id),
  INDEX idx_category_id (category_id),
  INDEX idx_type (type),
  INDEX idx_date (date),
  INDEX idx_month_year (month, year),
  INDEX idx_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- GOALS TABLE
-- ============================================
CREATE TABLE goals (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  category VARCHAR(100),
  color VARCHAR(7) DEFAULT '#8b5cf6',
  icon VARCHAR(50) DEFAULT 'target',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('not_started', 'in_progress', 'completed', 'paused') DEFAULT 'not_started',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- PASSWORD RESETS TABLE
-- ============================================
CREATE TABLE password_resets (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  email VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_password_resets_email (email),
  INDEX idx_password_resets_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SESSIONS TABLE (for JWT refresh tokens)
-- ============================================
CREATE TABLE sessions (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  token VARCHAR(500) NOT NULL,
  user_agent VARCHAR(255),
  ip_address VARCHAR(45),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- REPORTS TABLE
-- ============================================
CREATE TABLE reports (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_income DECIMAL(15,2) DEFAULT 0,
  total_expense DECIMAL(15,2) DEFAULT 0,
  net_balance DECIMAL(15,2) DEFAULT 0,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_period (period_start, period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CREATE SAMPLE DATA (OPTIONAL)
-- ============================================


-- Default categories for user 1
INSERT INTO categories (user_id, name, type, color, icon) VALUES
(1, 'Salário', 'income', '#10b981', 'briefcase'),
(1, 'Freelance', 'income', '#3b82f6', 'code'),
(1, 'Investimentos', 'income', '#f59e0b', 'trending-up'),
(1, 'Alimentação', 'expense', '#ef4444', 'utensils'),
(1, 'Transporte', 'expense', '#8b5cf6', 'car'),
(1, 'Utilidades', 'expense', '#ec4899', 'zap'),
(1, 'Entretenimento', 'expense', '#06b6d4', 'music'),
(1, 'Saúde', 'expense', '#14b8a6', 'heart');

-- Sample transactions for user 1
INSERT INTO transactions (user_id, category_id, type, description, amount, date, month, year) VALUES
(1, 1, 'income', 'Salário mensal', 3000.00, '2026-01-01', 1, 2026),
(1, 4, 'expense', 'Mercado semanal', 150.00, '2026-01-05', 1, 2026),
(1, 5, 'expense', 'Gasolina', 80.00, '2026-01-07', 1, 2026),
(1, 6, 'expense', 'Conta de energia', 120.00, '2026-01-08', 1, 2026),
(1, 7, 'expense', 'Cinema', 30.00, '2026-01-10', 1, 2026),
(1, 2, 'income', 'Projeto freelance', 500.00, '2026-01-12', 1, 2026);

-- Sample goals
INSERT INTO goals (user_id, title, target_amount, start_date, end_date, priority, status) VALUES
(1, 'Fundo de Emergência', 10000.00, '2026-01-01', '2026-12-31', 'high', 'in_progress'),
(1, 'Férias de Verão', 3000.00, '2026-01-01', '2026-06-30', 'medium', 'in_progress'),
(1, 'Novo Laptop', 2000.00, '2026-01-01', '2026-12-31', 'medium', 'not_started');


