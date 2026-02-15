#!/usr/bin/env bash
# Usage: ./scripts/get-cert.sh app.logistics.com you@example.com
set -euo pipefail
DOMAIN=${1:-}
EMAIL=${2:-}
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "Usage: $0 <domain> <email>"
  exit 1
fi

# Ensure docker compose services are up so webroot is available
docker compose up -d reverse-proxy

# Run certbot to obtain/renew certificate using webroot
docker run --rm -it \
  -v "$PWD/nginx/www":/var/www/certbot \
  -v "$PWD/nginx/certs":/etc/letsencrypt \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d "$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive

# Reload nginx
docker compose exec reverse-proxy nginx -s reload

echo "Certificate obtained (or renewed) for $DOMAIN."
