#!/usr/bin/env bash
# =============================================================================
# init-ssl.sh — Obtém certificados Let's Encrypt e ativa HTTPS no nginx
# Pré-requisitos:
#   - DNS de www.pertenser.com.br e pertenser.com.br apontando para esta VPS
#   - Stack rodando com pertenser-http.conf ativo (sem pertenser-ssl.conf)
# Execute em /opt/pertenser:
#   bash scripts/init-ssl.sh
# =============================================================================
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/pertenser}"
cd "${APP_DIR}"

if [ ! -f .env ]; then
  echo "ERRO: Arquivo .env não encontrado em ${APP_DIR}"
  exit 1
fi

# shellcheck disable=SC1091
source .env

DOMAIN="${DOMAIN:-www.pertenser.com.br}"
DOMAIN_ALT="${DOMAIN_ALT:-pertenser.com.br}"
EMAIL="${CERTBOT_EMAIL:?Defina CERTBOT_EMAIL no .env}"

NGINX_CONF_DIR="${APP_DIR}/nginx/conf.d"

echo "==> Verificando se os containers estão rodando..."
docker compose -f docker-compose.prod.yml ps --status running | grep -q pertenser-nginx \
  || { echo "ERRO: pertenser-nginx não está rodando. Suba o stack primeiro."; exit 1; }

echo "==> Garantindo config HTTP (sem SSL)..."
rm -f "${NGINX_CONF_DIR}/pertenser-ssl.conf"
cp -f nginx/conf.d/pertenser-http.conf "${NGINX_CONF_DIR}/pertenser-http.conf" 2>/dev/null \
  || true
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload 2>/dev/null \
  || docker compose -f docker-compose.prod.yml restart nginx

echo "==> Solicitando certificado para ${DOMAIN} e ${DOMAIN_ALT}..."
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "${EMAIL}" \
  --agree-tos \
  --no-eff-email \
  -d "${DOMAIN}" \
  -d "${DOMAIN_ALT}"

echo "==> Ativando configuração HTTPS..."
rm -f "${NGINX_CONF_DIR}/pertenser-http.conf"

# Substitui domínios no template SSL (caso tenham sido alterados no .env)
sed "s/www\.pertenser\.com\.br/${DOMAIN}/g; s/pertenser\.com\.br/${DOMAIN_ALT}/g" \
  nginx/conf.d/pertenser-ssl.conf.template > "${NGINX_CONF_DIR}/pertenser-ssl.conf"

docker compose -f docker-compose.prod.yml exec nginx nginx -t
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo ""
echo "==> Certificados instalados com sucesso!"
echo "    Certificados em: ${APP_DIR}/certbot/conf/live/${DOMAIN}/"
echo "    Renovação automática: container pertenser-certbot (a cada 12h)"
echo ""
echo "    Teste: https://${DOMAIN}"
