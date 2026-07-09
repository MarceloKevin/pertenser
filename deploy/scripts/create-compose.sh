#!/usr/bin/env bash
# =============================================================================
# create-compose.sh — Gera o docker-compose.prod.yml diretamente no servidor
# Execute na VPS dentro de /opt/pertenser:
#   bash scripts/create-compose.sh
# =============================================================================
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/pertenser}"
COMPOSE_FILE="${APP_DIR}/docker-compose.prod.yml"

mkdir -p "${APP_DIR}"/{nginx/conf.d,certbot/conf,certbot/www,scripts}

cat > "${COMPOSE_FILE}" << 'COMPOSE_EOF'
# PertenSer — Produção (gerado por create-compose.sh)
name: pertenser

services:
  db:
    image: postgres:16-alpine
    container_name: pertenser-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: projetopertenser
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d projetopertenser"]
      interval: 5s
      timeout: 5s
      retries: 10
    networks:
      - pertenser

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: pertenser-api
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      PORT: 4000
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/projetopertenser?schema=public
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-7d}
      FRONTEND_URL: ${FRONTEND_URL}
      UPLOAD_DIR: /app/uploads
      MAX_FILE_SIZE_MB: ${MAX_FILE_SIZE_MB:-5}
      ADMIN_EMAIL: ${ADMIN_EMAIL:-admin@pertenser.com.br}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
    volumes:
      - uploads_data:/app/uploads
    networks:
      - pertenser

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: pertenser-frontend
    restart: unless-stopped
    depends_on:
      - api
    environment:
      BACKEND_URL: http://pertenser-api:4000
      NODE_ENV: production
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      - eventos_uploads:/app/public/eventos
    networks:
      - pertenser

  nginx:
    image: nginx:1.27-alpine
    container_name: pertenser-nginx
    restart: unless-stopped
    ports:
      - "${NGINX_HTTP_PORT:-8080}:80"
      - "${NGINX_HTTPS_PORT:-8443}:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - frontend
    networks:
      - pertenser

  certbot:
    image: certbot/certbot:latest
    container_name: pertenser-certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: /bin/sh -c "trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done"
    networks:
      - pertenser

volumes:
  postgres_data:
  uploads_data:
  eventos_uploads:

networks:
  pertenser:
    driver: bridge
COMPOSE_EOF

echo "==> docker-compose.prod.yml criado em: ${COMPOSE_FILE}"

# Cria .env.example se não existir
if [ ! -f "${APP_DIR}/.env" ]; then
  cat > "${APP_DIR}/.env.example" << 'ENV_EOF'
DOMAIN=www.pertenser.com.br
DOMAIN_ALT=pertenser.com.br
FRONTEND_URL=https://www.pertenser.com.br
NGINX_HTTP_PORT=8080
NGINX_HTTPS_PORT=8443
CERTBOT_EMAIL=admin@pertenser.com.br
POSTGRES_PASSWORD=troque-por-uma-senha-forte-aqui
JWT_SECRET=troque-por-um-secret-forte-aqui
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE_MB=5
ADMIN_EMAIL=admin@pertenser.com.br
ADMIN_PASSWORD=troque-por-uma-senha-forte-aqui
ENV_EOF
  echo "==> .env.example criado. Copie e edite: cp .env.example .env"
fi

echo "==> Pronto! Edite o .env e execute:"
echo "    cd ${APP_DIR}"
echo "    docker compose -f docker-compose.prod.yml up -d --build"
