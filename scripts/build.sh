#!/bin/bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

echo "Installing dependencies..."
pnpm install --prefer-frozen-lockfile --prefer-offline --loglevel debug --reporter=append-only

echo "Building frontend with Vite..."
pnpm vite build

echo "Generating sitemap.xml..."
npx tsx scripts/generate-sitemap.mjs

echo "Pre-rendering pages (SSG)..."
npx tsx scripts/prerender.ts || echo "SSG pre-rendering failed (non-blocking)"

echo "Submitting URLs to IndexNow..."
node scripts/indexnow-submit.mjs || echo "IndexNow submission failed (non-blocking)"
