# Personal Finance Management System - Frontend

Frontend moderno e profissional para o Sistema de Gestão Financeira Pessoal, construído com Angular, TypeScript e TailwindCSS.

## Features

✅ Dashboard moderna e responsiva
✅ Gestão de transações (receitas/despesas)
✅ Gestão de categorias com ícones personalizáveis
✅ Sistema de metas financeiras
✅ Autenticação segura com JWT
✅ Dark Mode elegante
✅ Multi-idioma (Português/Inglês)
✅ Design profissional estilo fintech
✅ Animações suaves
✅ Componentes reutilizáveis
✅ Responsivo (Mobile/Tablet/Desktop)

## Tecnologias

- **Framework**: Angular 17 (Standalone Components)
- **Linguagem**: TypeScript 5.2
- **Styling**: TailwindCSS 3.3
- **Ícones**: Lucide Angular (com fallback SVG)
- **Gráficos**: Chart.js / ApexCharts
- **HTTP**: Angular HttpClient
- **Roteamento**: Angular Router
- **Estado**: RxJS Observables

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/                 # Serviços, Guards, Interceptors
│   │   ├── services/        # API, Auth, Theme, i18n
│   │   ├── guards/          # Auth Guard
│   │   └── interceptors/    # HTTP Interceptors
│   ├── shared/              # Componentes compartilhadas
│   │   ├── components/      # Navbar, Sidebar, etc
│   │   └── pipes/           # Custom Pipes
│   ├── features/            # Módulos de funcionalidades
│   │   ├── auth/           # Login/Register
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── transactions/   # Gestão de transações
│   │   ├── categories/     # Gestão de categorias
│   │   ├── goals/          # Metas financeiras
│   │   └── admin/          # Painel administrativo
│   ├── layouts/            # Layouts compartilhadas
│   ├── app.routes.ts       # Rotas principais
│   └── app.component.ts    # Componente raiz
├── styles/                 # Estilos globais
├── environments/          # Configurações por ambiente
└── assets/               # Imagens, fonts, etc
```

## Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Setup

```bash
# Instalação de dependências
npm install

# Desenvolvimento (localhost:4200)
npm start

# Build para produção
npm run build:prod

# Testes (se configurado)
npm test

# Lint
npm run lint
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` (não versionado):

```env
NG_APP_API_URL=http://localhost:8000
NG_APP_API_KEY=your-api-key
```

## Funcionalidades Principais

### 1. Autenticação
- Login/Registro
- JWT com refresh tokens
- Guards de rota
- Interceptors para adicionar token automaticamente

### 2. Dashboard
- Cards KPI (Saldo, Receitas, Despesas)
- Gráficos financeiros
- Transações recentes
- Metas em progresso

### 3. Transactions
- CRUD completo
- Filtros e busca
- Categorização
- Histórico detalhado

### 4. Categories
- Criação customizável
- Ícones e cores
- Organização por tipo

### 5. Goals
- Acompanhamento de progresso
- Priorização
- Status visual

### 6. Admin
- Gerenciamento de usuários
- Estatísticas globais
- Relatórios

## Dark Mode

O dark mode é ativado automaticamente com base na preferência do sistema, mas pode ser:
- Togglaldo manualmente via navbar
- Persistido no localStorage
- Aplicado com transições suaves

## i18n (Internacionalização)

Suporte para múltiplos idiomas:
- **Português (pt)** - Padrão
- **Inglês (en)**

Disponível no navbar com flags de países.

## Performance

- Lazy loading de módulos
- OnPush change detection onde aplicável
- Tree-shaking otimizado
- Minificação automática

## Segurança

- ✅ Proteção CSRF via CORS
- ✅ JWT para autenticação
- ✅ Armazenamento seguro de tokens
- ✅ Limpeza de dados sensíveis no logout
- ✅ Sanitização de inputs

## Responsividade

Breakpoints Tailwind:
- `sm: 640px` - Mobile pequeno
- `md: 768px` - Tablet
- `lg: 1024px` - Laptop
- `xl: 1280px` - Desktop

## Deploy

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy
```

### Manual (Apache/Nginx)
```bash
npm run build:prod
# Upload dist/personal-finance-wallet
```

## Troubleshooting

### Erro de CORS
- Verificar `environment.ts`
- Confirmar Backend está rodando em 8000

### Token expirado
- Implementar refresh token automático
- Redirecionar para login

### Dark Mode não funciona
- Limpar localStorage: `localStorage.removeItem('theme')`
- Check browser console para erros

## Contribuindo

1. Create nueva branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Open Pull Request

## License

MIT License - Veja LICENSE.txt

## Suporte

Para suporte, contate: support@personal-finance.local

---

**Versão**: 1.0.0  
**Última atualização**: 2026-01-15
