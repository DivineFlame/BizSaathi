# Dokploy Deployment Guide for BizSaathi

BizSaathi is configured to avoid port 3000.

- App/container port: `8080`
- Local Docker browser port: `3080`
- Dokploy domain routing target: `8080`

## Recommended option: external PostgreSQL

Use `docker-compose.dokploy.yml` when PostgreSQL is already running in Dokploy or managed externally.

Required environment variables:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/bizsaathi?schema=public
AUTH_SECRET=replace-with-output-of-openssl-rand-base64-32
AUTH_COOKIE_NAME=bizsaathi_session
PAPERCLIP_API_URL=http://paperclip:3001
PAPERCLIP_API_KEY=
OLLAMA_BASE_URL=http://ollama:11434
DEFAULT_MODEL_PROVIDER=ollama
DEFAULT_MODEL_NAME=llama3.1:8b
RUN_MIGRATIONS=true
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

## Self-contained option: app + PostgreSQL

Use `docker-compose.dokploy.with-postgres.yml` when you want the BizSaathi stack to create its own PostgreSQL container and volume.

Add these environment variables in Dokploy:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
AUTH_SECRET=replace-with-output-of-openssl-rand-base64-32
POSTGRES_USER=bizsaathi
POSTGRES_PASSWORD=replace-with-strong-db-password
POSTGRES_DB=bizsaathi
PAPERCLIP_API_URL=http://paperclip:3001
OLLAMA_BASE_URL=http://ollama:11434
RUN_MIGRATIONS=true
```

## Paperclip and Ollama networking

If Paperclip and Ollama are separate Dokploy apps, put them on the same `dokploy-network` and set:

```env
PAPERCLIP_API_URL=http://paperclip:3001
OLLAMA_BASE_URL=http://ollama:11434
```

If service names differ, update the hostnames accordingly.

## Deployment checklist

- Route your Dokploy domain to container port `8080`.
- Do not route or publish port 3000 for BizSaathi.
- Keep PostgreSQL private.
- Set `RUN_MIGRATIONS=true` for first deployment.
- Store all secrets as Dokploy environment variables.
- After first login, change demo credentials if you use the seed script.
