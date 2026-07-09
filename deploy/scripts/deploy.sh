#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Atualiza e reinicia a aplicação na VPS
# Execute em /opt/pertenser:
#   bash scripts/deploy.sh
# =============================================================================
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/pertenser}"
cd "${APP_DIR}"

COMPOSE="docker compose -f docker-compose.prod.yml"

echo "==> Atualizando repositórios..."
if [ -d backend/.git ]; then
  git -C backend pull --ff-only
fi
if [ -d frontend/.git ]; then
  git -C frontend pull --ff-only
fi

echo "==> Rebuild e restart dos containers..."
${COMPOSE} up -d --build

echo "==> Aguardando API ficar saudável..."
sleep 10
docker exec pertenser-api wget -qO- http://localhost:4000/api/health || true

echo "==> Status dos containers:"
${COMPOSE} ps

echo ""
echo "==> Deploy concluído!"
