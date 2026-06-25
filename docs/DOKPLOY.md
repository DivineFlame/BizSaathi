# Dokploy Deployment Guide for BizSaathi

## Option A: Use external PostgreSQL

Recommended for production.

1. Create a PostgreSQL database in Dokploy or another managed provider.
2. Add these environment variables to the BizSaathi app:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/bizsaathi?schema=public
AUTH_SECRET=replace-with-output-of-openssl-rand-base64-32
PAPERCLIP_API_URL=http://paperclip:3001
OLLAMA_BASE_URL=http://ollama:11434
RUN_MIGRATIONS=true
```

3. Use `docker-compose.dokploy.yml` as the raw compose file.
4. Attach your domain to port `3000`.
5. Deploy.

## Option B: Full local compose

For development or single VPS testing:

```bash
docker compose up --build
```

## Paperclip and Ollama networking

If Paperclip and Ollama are separate Dokploy apps, put them on the same `dokploy-network` and set:

```env
PAPERCLIP_API_URL=http://paperclip:3001
OLLAMA_BASE_URL=http://ollama:11434
```

If they have different service names, update the hostnames accordingly.

## Production checklist

- Replace `AUTH_SECRET` with a strong secret.
- Use managed or backed-up PostgreSQL.
- Keep `RUN_MIGRATIONS=true` for normal deploys, or run migrations manually and set it to `false`.
- Configure HTTPS domain in Dokploy.
- Do not expose PostgreSQL publicly unless protected by firewall/VPN.
- Do not put real API keys in source code.
