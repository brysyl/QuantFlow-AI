#!/bin/bash
set -e

echo "🚀 Running QuantFlow-AI Pre-Flight Check..."

if [ -f .env.production ]; then
  export $(grep -v '^#' .env.production | xargs)
fi

if [ -z "$NEBIUS_API_KEY" ] || [ "$NEBIUS_API_KEY" = "PASTE_YOUR_NEBIUS_KEY_HERE" ]; then
  echo "❌ Error: Update NEBIUS_API_KEY in .env.production first."
  exit 1
fi

echo "📡 Validating key with Nebius Token Factory..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $NEBIUS_API_KEY" \
  "$NEBIUS_BASE_URL/models" || echo "000")

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "🎉 Token allocation active! Deploying live via GitHub CI/CD..."
  git push origin main
  echo "🟢 Pipeline executing. Your live Nebius serverless build is in progress!"
else
  echo "⚠️ Connection failed (HTTP $HTTP_STATUS). Check your token key or credits."
  exit 1
fi
