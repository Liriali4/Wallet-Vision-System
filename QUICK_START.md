# 🚀 QUICK START GUIDE - Personal Finance Management System

## 📥 Pré-requisitos

- **PHP 8.1+** (com MySQLi)
- **MySQL 5.7+** ou **MariaDB**
- **Node.js 18+** e **npm**
- **Angular CLI** (opcional): `npm install -g @angular/cli`

---

## ⚡ Setup em 5 Minutos

### 1️⃣ Backend (PHP)

```bash
# Navegar para pasta server
cd server

# Copiar configuração
cp .env.example .env

# Editar .env com db credentials (editor de sua escolha)
# DB_HOST=localhost
# DB_NAME=personal_finance
# DB_USER=root
# DB_PASSWORD=

# Criar banco de dados (MySQL)
mysql -u root -e "CREATE DATABASE personal_finance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root personal_finance < ../database/schema.sql

# Iniciar servidor (em uma terminal)
php -S localhost:8000 -t public
```

✅ Backend rodando em: **http://localhost:8000**

### 2️⃣ Frontend (Angular)

```bash
# Navegar para pasta client (nova terminal)
cd client

# Instalar dependências
npm install

# Iniciar dev server
npm start
```

✅ Frontend rodando em: **http://localhost:4200**

### 3️⃣ Testar

Abrir browser: **http://localhost:4200**

---

## 🎯 Fluxo de Utilização

### Login
1. Acesse http://localhost:4200
2. Será redirecionado para /auth/login
3. Insira credenciais
4. JWT será armazenado automaticamente

### Dashboard
1. Dashboard carrega automaticamente com:
   - Cards KPI (Saldo, Receitas, Despesas)
   - Transações recentes
   - Dados financeiros do mês

### Navegação
- **Sidebar** esquerda: Menu de navegação
- **Navbar** topo: Usuário, tema, idioma
- **Dark Mode**: Toggle no navbar (🌙)
- **Idioma**: Toggle no navbar (🇧🇷/🇺🇸)

---

## 🗂️ Estrutura de Pastas

```
Wallet/
├── server/
│   ├── app/controllers      ← API endpoints
│   ├── app/services         ← Lógica negócio
│   ├── app/repositories     ← Acesso BD
│   ├── config/              ← Configurações
│   ├── public/              ← Entry point
│   └── database/schema.sql  ← BD
│
├── client/
│   ├── src/app/
│   │   ├── core/            ← Serviços, Guards
│   │   ├── shared/          ← Componentes comuns
│   │   ├── features/        ← Módulos funcionais
│   │   └── layouts/         ← Layouts
│   └── src/styles/          ← Estilos globais
│
└── database/schema.sql
```

---

## 📚 API Endpoints Principais

### Autenticação
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/change-password
PUT  /auth/profile
```

### Transações
```
GET  /transactions
GET  /transactions/balance
GET  /transactions/monthly?month=1&year=2026
POST /transactions
PUT  /transactions/update?id=1
DELETE /transactions/delete?id=1
```

### Categorias
```
GET  /categories?type=expense
POST /categories
PUT  /categories/update?id=1
DELETE /categories/delete?id=1
```

### Metas
```
GET  /goals?status=in_progress
POST /goals
PUT  /goals/update?id=1
DELETE /goals/delete?id=1
```

### Admin (admin only)
```
GET  /admin/users?page=1
GET  /admin/stats
PUT  /admin/users/deactivate?id=1
PUT  /admin/users/activate?id=1
DELETE /admin/users/delete?id=1
```

---

## 🔧 Troubleshooting

### ❌ PHP não encontrado
```bash
# Verificar instalação
php -v

# Se não instalado:
# Windows: Download em php.net
# Mac: brew install php
# Linux: sudo apt install php php-mysql
```

### ❌ MySQL não conecta
```bash
# Verificar servidor MySQL
mysql -u root

# Se erro, iniciar MySQL:
# Windows: mysql80 (Services)
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql
```

### ❌ Porta 8000 já em uso
```bash
# Usar porta diferente
php -S localhost:8001 -t public

# Update environment.ts:
# apiUrl: 'http://localhost:8001'
```

### ❌ CORS error
- Backend deve estar em `http://localhost:8000`
- Frontend em `http://localhost:4200`
- Ambos locais diferentes = CORS necessário ✅ (já configurado)

### ❌ Token expirado
- Token expira em 24 horas
- Fazer logout e novo login
- Refresh token implementado no backend

---

## 📊 Dados de Teste

Ao rodar schema.sql, dados de exemplo são carregados:

- **1 usuário admin**
- **1 usuário regular**
- **8 categorias** (Receitas + Despesas)
- **6 transações** de exemplo
- **3 metas** financeiras

---

## 🎨 Customizações

### Mudar Cores
Edite [tailwind.config.js](client/tailwind.config.js):

```js
theme: {
  extend: {
    colors: {
      'primary': '#6366f1',  // Mudar cor primária
      'secondary': '#8b5cf6',
      // ...
    }
  }
}
```

### Mudar Logo
Substitua SVG em [navbar.component.ts](client/src/app/shared/components/navbar.component.ts)

### Adicionar Idioma
Edite [i18n.service.ts](client/src/app/core/services/i18n.service.ts):

```typescript
translations: {
  'pt': { ... },
  'en': { ... },
  'es': { ... }  // Novo idioma
}
```

---

## 🚢 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build:prod
# Upload pasta dist/
```

### Backend (Heroku/Hostinger)
```bash
# Configurar banco de dados remoto
# Upload via SFTP/Git
# Configure .env com credenciais reais
```

---

## 🔐 Produção Checklist

- [ ] Mudar JWT_SECRET em `.env`
- [ ] Configurar CORS com domínio real
- [ ] Usar HTTPS
- [ ] Executar `npm run build:prod`
- [ ] Testar autenticação
- [ ] Testar transações
- [ ] Backup do banco de dados
- [ ] Monitorar performance
- [ ] Configurar logs

---

## 📞 Suporte

**Problemas Comuns:**

1. **Backend não conecta ao MySQL**
   - Verificar credenciais em `.env`
   - Verificar se MySQL está rodando
   - Verificar se BD exist: `mysql -u root -e "SHOW DATABASES;"`

2. **Frontend não carrega**
   - Limpar cache: `Ctrl+Shift+Delete`
   - Verificar console: `F12`
   - Verificar se backend está em 8000

3. **Login falha**
   - Verificar credenciais
   - Verificar se schema foi importado
   - Checar backend logs

4. **Transações não aparecem**
   - Verificar se JWT é válido
   - Verificar network tab (F12)
   - Testar endpoint via Postman

---

## 📚 Documentação Completa

- [Backend README](server/README.md)
- [Frontend README](client/README.md)
- [Implementation Status](IMPLEMENTATION_STATUS.md)
- [Setup Guide](SETUP.md)

---

## ✨ Features Implementadas

✅ Login/Register com JWT
✅ Dashboard com KPIs
✅ CRUD Transações
✅ CRUD Categorias
✅ Sistema de Metas
✅ Admin Dashboard
✅ Dark Mode
✅ Multi-idioma (PT/EN)
✅ Design responsivo
✅ Design fintech premium

---

## 🎉 Pronto!

Seu sistema está **100% funcional** e pronto para uso!

```
✨ Personal Finance Management System v1.0.0 ✨
Backend: PHP + MySQL ✅
Frontend: Angular 17 ✅
Design: Profissional & Moderno ✅
Status: Production Ready 🚀
```

---

**Última atualização**: 15 Jan 2026  
**Versão**: 1.0.0  
**Desenvolvido com ❤️ por seu time de desenvolvimento**
