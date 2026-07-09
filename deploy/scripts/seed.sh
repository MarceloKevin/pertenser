#!/usr/bin/env bash
# =============================================================================
# seed.sh — Popula o banco com dados iniciais (executar uma vez após o deploy)
# Execute em /opt/pertenser:
#   bash scripts/seed.sh
# =============================================================================
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/pertenser}"
cd "${APP_DIR}"

echo "==> Executando seed do banco de dados..."
docker exec pertenser-api npx tsx prisma/seed.ts

echo "==> Seed concluído!"
