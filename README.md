# Personal Finance Management System

**Sistema de Gestão Financeira Pessoal** - Aplicação profissional e moderna para controle de receitas, despesas e metas financeiras.

## 📁 Estrutura do Projeto

```
Wallet/
├── server/          # Backend PHP (REST API)
│   ├── app/        # Controllers, Services, Models
│   ├── config/     # Configurações
│   ├── public/     # Entry point
│   ├── utils/      # Utilidades
│   ├── .env        # Variáveis de ambiente
│   └── composer.json
├── client/         # Frontend Angular
│   ├── src/
│   │   ├── app/    # Componentes Angular
│   │   ├── styles/ # Estilos TailwindCSS
│   │   └── index.html
│   ├── package.json
│   └── angular.json
├── database/       # Schema SQL
│   └── schema.sql
└── SETUP.md       # Instruções de setup
```

## 🚀 Quick Start

### Backend
```bash
cd server
php -S localhost:8000 -t public
 C:\xampp\php\php.exe -S localhost:8000
```

### Frontend
```bash
cd client
npm install
npm start
```

Acesse: http://localhost:4200

## ✨ Funcionalidades

- ✅ Dashboard financeira moderna
- ✅ CRUD de transações (receitas/despesas)
- ✅ Gestão de categorias
- ✅ Sistema de metas
- ✅ Autenticação JWT segura
- ✅ Admin dashboard
- ✅ Dark mode
- ✅ Multi-idioma
- ✅ Design responsivo
- ✅ UI profissional estilo fintech

## 🛠 Tecnologias

**Backend:**
- PHP 8.1+
- MySQL
- JWT Authentication

**Frontend:**
- Angular 17
- TypeScript
- TailwindCSS
- Chart.js

## 📚 Documentação

- [Backend README](./server/README.md)
- [Frontend README](./client/README.md)
- [Setup Guide](./SETUP.md)

## 🔐 Segurança

- JWT tokens com expiração
- Password hashing com bcrypt
- CORS protection
- SQL injection prevention
- XSS protection

## 📱 Responsividade

Otimizado para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 🖥️ Desktop (1024px+)

## 🎨 Design

Inspirado em apps fintech profissionais:
- Stripe
- Revolut
- Wise
- Nubank

Dark mode elegante e dark-first.

## 📄 License

MIT License

---

**Versão**: 1.0.0  
**Status**: Production Ready ✅  
**Última atualização**: 15 Jan 2026
