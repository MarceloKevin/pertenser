# PertenSer — Backend API

API REST para gerenciamento das informações do site PertenSer.

## Stack

- **Express 5** + TypeScript
- **Prisma ORM** + PostgreSQL
- **JWT** para autenticação
- **Multer** para upload de imagens

## Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma      # Modelos do banco
│   └── seed.ts            # Dados iniciais
├── src/
│   ├── config/            # Env e Multer
│   ├── controllers/       # Lógica das rotas
│   ├── lib/               # Prisma e JWT
│   ├── middleware/        # Auth e erros
│   ├── routes/            # Rotas da API
│   ├── types/             # Tipos TypeScript
│   ├── app.ts             # Configuração Express
│   └── server.ts          # Entrada do servidor
└── uploads/               # Imagens enviadas
    └── eventos/
        └── {slug}/
            ├── destaque.jpg
            └── galeria/
```

## Configuração

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Ajuste `DATABASE_URL` com suas credenciais do PostgreSQL local.

3. Instale as dependências:

```bash
npm install
```

4. Crie o banco e aplique o schema:

```bash
npm run db:push
npm run db:seed
```

5. Inicie o servidor:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:4000/api`.

## Endpoints

### Públicos (sem autenticação)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Status do servidor |
| POST | `/api/auth/login` | Login (retorna JWT) |
| GET | `/api/general-info` | Contato e redes sociais |
| GET | `/api/proximo-evento` | Próximo evento (ou `null`) |
| GET | `/api/eventos` | Lista de eventos realizados |
| GET | `/api/eventos/:slug` | Detalhe de um evento |
| GET | `/api/duvidas` | Dúvidas frequentes |
| GET | `/api/historia` | Textos da seção história |
| GET | `/api/historia/objetivos` | Objetivos da história |

### Protegidos (header `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/auth/me` | Dados do usuário logado |
| PUT | `/api/general-info` | Atualizar contato/redes |
| GET | `/api/proximo-evento/admin` | Próximo evento (com flag ativo) |
| PUT | `/api/proximo-evento` | Atualizar próximo evento |
| POST | `/api/eventos` | Criar evento |
| PUT | `/api/eventos/:slug` | Atualizar evento |
| DELETE | `/api/eventos/:slug` | Excluir evento |
| POST | `/api/duvidas` | Criar dúvida |
| PUT | `/api/duvidas/:id` | Atualizar dúvida |
| DELETE | `/api/duvidas/:id` | Excluir dúvida |
| PUT | `/api/historia` | Atualizar história |
| POST | `/api/historia/objetivos` | Criar objetivo |
| PUT | `/api/historia/objetivos/:id` | Atualizar objetivo |
| DELETE | `/api/historia/objetivos/:id` | Excluir objetivo |
| POST | `/api/upload` | Upload de imagem (multipart) |

### Upload de imagens

`POST /api/upload` com `multipart/form-data`:

- `file` — arquivo de imagem (JPG, PNG, WebP, GIF, máx. 5 MB)
- `slug` — slug do evento (ex: `encontro-de-recomecos`)
- `folder` — opcional: `galeria` para fotos da galeria

As imagens são salvas em `uploads/eventos/{slug}/` e servidas em `/uploads/eventos/{slug}/...`.

## Mapeamento com o frontend

| Seção do frontend | Modelo Prisma | Endpoint |
|-------------------|---------------|----------|
| Informações gerais | `GeneralInfo` | `/api/general-info` |
| Próximo evento | `ProximoEvento` | `/api/proximo-evento` |
| Eventos realizados | `EventoRealizado` + `Depoimento` | `/api/eventos` |
| Dúvidas frequentes | `Duvida` | `/api/duvidas` |
| Nossa história | `Historia` + `Objetivo` | `/api/historia` |
| Login | `User` | `/api/auth/login` |
