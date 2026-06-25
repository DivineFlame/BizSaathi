# BizSaathi Architecture

BizSaathi is designed as a vertical SaaS layer above Paperclip. Paperclip remains the agent control plane; BizSaathi provides the business UI, tenant model, approval center, CRM/campaign workflows, and deployment packaging.

## Runtime layers

```text
Responsive BizSaathi UI
  -> Next.js server/API routes
  -> PostgreSQL via Prisma
  -> Paperclip task API adapter
  -> Ollama / Hermes / HTTP agent runtimes
  -> Business integrations after human approval
```

## Port policy

BizSaathi does not use port 3000.

- Container/app port: `8080`
- Local Docker browser port: `3080`
- Dokploy routing target: container port `8080`

## Human approval model

Agents can always draft, summarize, plan, score, and propose. The following actions must go through Approval Center before execution:

- Publishing social posts
- Sending emails or WhatsApp messages
- Updating CRM records
- Changing budgets, discounts, invoices, or plans
- Making high-risk factual claims
- Triggering external APIs with customer impact

## Data model

Core tenant-scoped entities:

- Tenant
- User
- Agent
- AgentTask
- AgentRun
- AgentOutput
- ApprovalRequest
- Integration
- Campaign
- ContentItem
- Lead
- AuditLog

## Phase 2 implementation status

Implemented:

- Tenant onboarding
- Login/logout/session APIs
- Default agent team seeding
- Agent task API with Paperclip mock/fallback mode
- Approval creation and decision APIs
- Campaign creation API and UI form
- Lead capture/scoring API and UI form
- Integration upsert API
- Audit trail API writes and UI page
- Live Paperclip/Ollama connection checks
- Dokploy compose files using port 8080

Next recommended phase:

- Encrypted secret storage for per-tenant integrations
- Real Paperclip org-chart sync endpoint mapping
- Model list selector from Ollama `/api/tags`
- Saved content editor with version history
- Integration-specific adapters for Gmail, Meta, LinkedIn, X, WhatsApp, and Google Calendar
