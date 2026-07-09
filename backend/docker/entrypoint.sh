#!/bin/sh
set -e

echo "Aplicando schema no banco..."
npx prisma db push --skip-generate

echo "Aplicando seed inicial..."
npx tsx prisma/seed.ts

echo "Iniciando API..."
exec node dist/server.js
