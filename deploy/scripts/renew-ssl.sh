#!/usr/bin/env bash
# =============================================================================
# renew-ssl.sh — Renovação manual dos certificados (backup do container certbot)
# Execute em /opt/pertenser:
#   bash scripts/renew-ssl.sh
# =============================================================================
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/pertenser}"
cd "${APP_DIR}"

docker compose -f docker-compose.prod.yml run --rm certbot renew
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "==> Renovação concluída."
