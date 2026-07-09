#!/usr/bin/env bash
# =============================================================================
# setup-server.sh — Prepara a VPS Ubuntu/Debian para o PertenSer
# Execute como root ou com sudo na VPS:
#   curl -fsSL <url> | bash
#   ou: bash setup-server.sh
# =============================================================================
set -euo pipefail

APP_DIR="/opt/pertenser"
DEPLOY_USER="${DEPLOY_USER:-$USER}"

echo "==> Instalando dependências do sistema..."
apt-get update -qq
apt-get install -y -qq ca-certificates curl git ufw

if ! command -v docker &>/dev/null; then
  echo "==> Instalando Docker..."
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker "$DEPLOY_USER" 2>/dev/null || true
fi

if ! docker compose version &>/dev/null; then
  echo "ERRO: Docker Compose plugin não encontrado."
  exit 1
fi

echo "==> Criando estrutura de diretórios em ${APP_DIR}..."
mkdir -p "${APP_DIR}"/{backend,frontend,nginx/conf.d,certbot/conf,certbot/www,scripts}

echo "==> Configurando firewall (UFW)..."
ufw allow OpenSSH
ufw allow 8080/tcp
ufw allow 8443/tcp
ufw --force enable

echo "==> Estrutura criada. Próximos passos:"
echo "    1. Clone os repositórios em ${APP_DIR}/backend e ${APP_DIR}/frontend"
echo "    2. Copie deploy/* para ${APP_DIR}/"
echo "    3. Configure o .env: cp .env.example .env && nano .env"
echo "    4. Execute: bash scripts/create-compose.sh  (se ainda não tiver o compose)"
echo "    5. Execute: docker compose -f docker-compose.prod.yml up -d --build"
echo "    6. Execute: bash scripts/init-ssl.sh"
echo ""
echo "Estrutura final:"
find "${APP_DIR}" -maxdepth 3 -type d 2>/dev/null | sort || true
