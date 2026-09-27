# SODE Strategy

Backend NestJS + Prisma conectado ao PostgreSQL do Supabase. A aplicação mantém autenticação JWT, sessões, OTP, RBAC, auditoria e isolamento multi-tenant no backend.

## Requisitos
- Node.js 20+
- Projeto Supabase PostgreSQL
- Prisma CLI

## Configuração
```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

A API estará em `http://localhost:3000/api/v1` e o Swagger em `/docs`.

## Supabase
Use a connection string de pooler em `DATABASE_URL` para a API e a conexão direta em `DIRECT_URL` para migrations. Não exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend.

## Segurança
- Nunca versione `.env`.
- Use Argon2id para senhas e tokens armazenados.
- O `organization_id` é obtido da sessão autenticada; não confie em um tenant enviado pelo cliente.
- Ative RLS adicionalmente se outros clientes acessarem o banco diretamente.

## Scripts
- `npm run start:dev`: desenvolvimento
- `npm run build`: compilação
- `npm test`: testes
- `npm run prisma:migrate`: migration local
- `npm run prisma:deploy`: aplica migrations em produção
