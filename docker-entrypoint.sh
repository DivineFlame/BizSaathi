#!/bin/sh
set -e

if [ "$RUN_MIGRATIONS" = "true" ]; then
  if find prisma/migrations -name migration.sql -print -quit 2>/dev/null | grep -q migration.sql; then
    echo "Running Prisma migrations..."
    ./node_modules/.bin/prisma migrate deploy
  else
    echo "No Prisma migrations found; synchronizing schema with prisma db push for initial deployment..."
    ./node_modules/.bin/prisma db push --accept-data-loss
  fi
fi

exec node server.js
