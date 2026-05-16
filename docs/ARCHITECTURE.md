# Arquitetura do Wallet System

## Visão geral

O Wallet System é um esqueleto profissional de aplicação full-stack para gestão financeira pessoal. Ele separa claramente frontend e backend, usando Angular no cliente e PHP puro no servidor.

## Estrutura do frontend

- `frontend/src/app/core`: serviços globais, autenticação, interceptores e configurações compartilhadas.
- `frontend/src/app/shared`: componentes reutilizáveis, diretivas e pipes.
- `frontend/src/app/features`: módulos de funcionalidades isoladas.
- `frontend/src/app/layouts`: layouts aplicacionais reutilizáveis.
- Cada feature possui seu módulo e roteamento próprio, facilitando lazy loading e escalabilidade.

## Estrutura do backend

- `backend/config`: configurações de ambiente e banco de dados.
- `backend/routes`: definição de rotas e mapeamento de endpoints.
- `backend/controllers`: controladores responsáveis por traduzir requisições em ações de serviço.
- `backend/services`: camada de regras de negócio e coordenação de processos.
- `backend/models`: objetos de acesso a dados e entidades de domínio.
- `backend/middlewares`: processamento de requisições antes dos controladores.
- `backend/utils`: utilitários de resposta, conexão e validação.

## Fluxo de dados

1. O frontend envia requisições HTTP JSON para o backend.
2. `backend/public/index.php` inicializa o ambiente e delega para o roteador.
3. O roteador valida o caminho e o método HTTP e chama o controlador apropriado.
4. O controlador usa serviços para executar a lógica de negócio.
5. Serviços usam modelos para acessar o banco de dados.
6. A resposta JSON é devolvida ao frontend.

## Decisões de design

- Separação clara entre camadas reduz acoplamento.
- Angular fornece arquitetura modular para aplicações ricas.
- Backend em PHP puro evita dependências de framework e mantém flexibilidade.
- Documentação junto ao código facilita onboarding e revisão.

## Escalabilidade

- Frontend: módulos de features e core/shared isolam responsabilidades.
- Backend: rotas simples e controllers leves permitem evolução incremental.
- Banco de dados relacional com chaves estrangeiras garante integridade.
- Arquitetura preparada para adição de novas features sem reorganização profunda.
