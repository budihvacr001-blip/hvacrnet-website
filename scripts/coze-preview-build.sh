#!/usr/bin/env bash
set -euo pipefail

# Coze 预览准备：安装依赖（短时执行，不启动常驻进程）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

pnpm install