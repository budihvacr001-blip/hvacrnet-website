#!/usr/bin/env bash
set -euo pipefail

# Coze 预览常驻进程：绑定 0.0.0.0:5000（平台唯一暴露端口），幂等启动
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

export PORT=5000

# 依赖缺失时自愈（环境可能清理 node_modules）
if [ ! -x "node_modules/.bin/vite" ]; then
  echo "[preview] node_modules missing, running pnpm install..."
  pnpm install
fi

# 清理 5000 端口残留，避免多进程争抢
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

# 前台常驻，进程由平台托管
exec pnpm exec vite --host 0.0.0.0 --port 5000 --strictPort