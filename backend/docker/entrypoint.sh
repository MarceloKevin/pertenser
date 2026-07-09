#!/bin/sh
set -e

echo "Aplicando schema no banco..."
npx prisma db push --skip-generate

echo "Iniciando API..."
exec node dist/server.js
