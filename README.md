# BizSaathi

BizSaathi is a responsive, role-based AI operations workspace for MSMEs and digital marketing agencies. It is designed to sit above Paperclip as the agent governance/control plane and connect role-specific AI workspaces to local or hosted agent runtimes such as Ollama, Hermes-style agents, or custom HTTP adapters.

## Current implementation

- Next.js App Router application with TypeScript
- Responsive UI for desktop, laptop, tablet, and mobile
- Role-based workspaces for CEO, Marketing, Content, Social, Sales/CRM, Support, Finance, and Compliance agents
- Tenant onboarding and login/session API foundation
- Approval Center with decision API
- Campaign Studio with campaign creation API
- Lead/CRM workspace with lead capture and scoring API
- Content Studio placeholder for human editing workflows
- Audit trail page and audit logging helper
- Paperclip task adapter with safe mock/fallback mode
- Ollama/Paperclip live connection checks
- Prisma PostgreSQL multi-tenant SaaS schema
- Dockerfile and Dokploy raw compose files

## Port policy

BizSaathi intentionally does **not** use port 3000.

- App/container port: `8080`
- Local Docker browser port: `3080`
- Dokploy routing target: `8080`

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3080`.

## Docker development

```bash
docker compose up --build
```

Open `http://localhost:3080`.

## Database setup

After configuring `DATABASE_URL`, run:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

For production migrations/deployment sync:

```bash
npm run db:migrate
```

If no migrations exist yet, the Docker entrypoint safely falls back to `prisma db push` for initial deployment when `RUN_MIGRATIONS=true`.

## Dokploy deployment

Use one of these files as raw compose:

```text
docker-compose.dokploy.yml                 # external PostgreSQL
docker-compose.dokploy.with-postgres.yml   # app + private PostgreSQL
```

Required environment variables:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/bizsaathi?schema=public
AUTH_SECRET=replace-with-output-of-openssl-rand-base64-32
PAPERCLIP_API_URL=http://paperclip:3001
OLLAMA_BASE_URL=http://ollama:11434
RUN_MIGRATIONS=true
```

## Default seed login

Only available after running `npm run db:seed`:

```text
Email: owner@bizsaathi.local
Password: BizSaathi@12345
```

## Build roadmap

1. Foundation: responsive role-based UI, schema, Docker, and health route. ✅
2. Authentication and tenant onboarding. ✅
3. Agent manager with Paperclip adapter settings. ✅ foundation
4. Approval workflows for publishing, email, CRM updates, and budget actions. ✅ foundation
5. Campaign studio and content calendar. ✅ foundation
6. Lead generation and CRM pipeline. ✅ foundation
7. Integrations: Gmail, Meta, LinkedIn, X, WhatsApp, Calendar, and file storage. Next
8. Billing, plans, usage limits, audit logs, and admin reporting. Next
