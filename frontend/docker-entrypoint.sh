#!/bin/sh
set -e

mkdir -p /app/public/eventos
chown -R nextjs:nodejs /app/public/eventos

exec gosu nextjs "$@"
