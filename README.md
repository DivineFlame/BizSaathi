# BizSaathi

BizSaathi is a production-oriented, responsive AI operations workspace for MSMEs and digital marketing agencies. It provides different UI workspaces for different AI agents, while keeping human approval, auditability, tenant isolation, and Paperclip/Ollama integration at the center of the product.

## Current implementation

This repository now includes:

- Next.js App Router with TypeScript and Tailwind CSS v4
- Responsive UI for desktop, laptop, tablet, and mobile
- Tenant onboarding and email/password login API foundation
- Role-based agent manager and agent workspaces
- Approval center for human-in-the-loop governance
- Campaign studio and lead/CRM pipeline screens
- Settings page for Paperclip, Ollama, model, and deployment configuration
- PostgreSQL schema using Prisma for multi-tenant SaaS data
- Paperclip task client placeholder with safe mock fallback
- Dokploy-ready Dockerfile and raw compose file
- Health check route for container monitoring

## Architecture

```text
BizSaathi responsive UI
  -> Next.js API routes
  -> PostgreSQL / Prisma
  -> Paperclip control plane
  -> Agent adapters
  -> Ollama / Hermes / custom HTTP agents
  -> External tools: Gmail, Meta, LinkedIn, X, WhatsApp, CRM, Calendar, Files
```

## Local development

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Demo login after seeding:

```text
Email: owner@bizsaathi.local
Password: BizSaathi@12345
```

## Docker development

```bash
docker compose up --build
```

The web app runs at `http://localhost:3000`.

## Dokploy deployment

Use `docker-compose.dokploy.yml` as the raw compose file in Dokploy.

Required Dokploy environment variables:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/bizsaathi?schema=public
AUTH_SECRET=replace-with-output-of-openssl-rand-base64-32
PAPERCLIP_API_URL=http://paperclip:3001
OLLAMA_BASE_URL=http://ollama:11434
RUN_MIGRATIONS=true
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

## Important routes

```text
/                Main operating dashboard
/onboarding      Create first tenant and owner user
/login           Login page
/agents          Agent manager
/agents/ceo      CEO agent workspace
/agents/marketing
/agents/content
/agents/social
/agents/sales-crm
/approvals       Human approval queue
/campaigns       Campaign studio
/leads           CRM pipeline
/settings        Paperclip/Ollama settings
/api/health      Container health check
```

## Next build steps

1. Connect Agent Manager directly to Paperclip's live API once the final Paperclip adapter endpoint is fixed.
2. Add invite-based user management and RBAC enforcement to every API route.
3. Add campaign/content persistence screens backed by Prisma.
4. Add integration connectors for Gmail, Meta, LinkedIn, X, WhatsApp, and Google Calendar.
5. Add usage limits, subscription plans, audit log viewer, and tenant billing.
