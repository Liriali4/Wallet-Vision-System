# Personal Finance Management System - Backend

## Setup Rápido

### 1. Banco de Dados
```bash
# Import schema
mysql -u root < database/schema.sql
```

### 2. Configuração
```bash
# Copy .env
cp .env.example .env

# Edit .env with your DB credentials
```

### 3. Executar Servidor
```bash
# Local development
php -S localhost:8000 -t public

# Application estará disponível em:
# http://localhost:8000
```

## Estrutura

- `/app` - Lógica da aplicação
- `/config` - Configurações
- `/database` - Schema SQL
- `/public` - Entry point
- `/utils` - Utilidades

## API Endpoints

Veja `README.md` na pasta server para documentação completa da API.

---

**Versão**: 1.0.0
