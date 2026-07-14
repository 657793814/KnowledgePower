#!/bin/bash
# ============================================================
# MathVerse 打包脚本
# 编译后端 JAR → 构建前端 → 打包 Tauri .app
# ============================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"
WEB_DIR="$ROOT_DIR/web"
TAURI_DIR="$ROOT_DIR/src-tauri"
BINARIES_DIR="$TAURI_DIR/binaries"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 前置检查
command -v java  >/dev/null 2>&1 || { error "需要 Java 21+"; exit 1; }
command -v node  >/dev/null 2>&1 || { error "需要 Node.js 18+"; exit 1; }
command -v cargo >/dev/null 2>&1 || { error "需要 Rust/Cargo"; exit 1; }

info "Java: $(java -version 2>&1 | head -1)"
info "Node: $(node -v)"
info "Rust: $(cargo --version | head -1)"

# Step 1: 编译后端
info "========== 1/4 编译后端 JAR =========="
cd "$SERVER_DIR"
mvn clean package -DskipTests -q
JAR_FILE=$(ls target/mathverse-server-*.jar | head -1)
info "后端 JAR: $(basename "$JAR_FILE") ($(du -h "$JAR_FILE" | cut -f1))"

# 复制到 binary 目录（Tauri 会打包进去）
mkdir -p "$BINARIES_DIR"
cp "$JAR_FILE" "$BINARIES_DIR/mathverse-backend.jar"
info "已复制到: $BINARIES_DIR/mathverse-backend.jar"

# Step 2: 构建前端
info "========== 2/4 构建前端 =========="
cd "$WEB_DIR"
[ ! -d "node_modules" ] && npm install --silent
npm run build
info "前端构建完成 ✅"

# Step 3: 打包 Tauri
info "========== 3/4 打包 Tauri =========="
cd "$TAURI_DIR"
cargo build --release
info "Tauri 编译完成 ✅"

# Step 4: 收集产物
info "========== 4/4 收集产物 =========="
echo ""
echo -e "${GREEN}====================================${NC}"
echo -e "${GREEN}  MathVerse 打包完成 🎉${NC}"
echo -e "${GREEN}====================================${NC}"
echo ""

if [ -f "target/release/bundle/macos/数理世界.app" ]; then
    echo -e "  ${GREEN}✅${NC} macOS .app:"
    echo "     target/release/bundle/macos/数理世界.app"
    echo "     ($(du -sh target/release/bundle/macos/数理世界.app | cut -f1))"
fi

if [ -f "target/release/bundle/dmg/数理世界.dmg" ]; then
    echo -e "  ${GREEN}✅${NC} macOS .dmg:"
    echo "     target/release/bundle/dmg/数理世界.dmg"
    echo "     ($(du -sh target/release/bundle/dmg/数理世界.dmg | cut -f1))"
fi

echo ""
echo -e "  ${YELLOW}后端 JAR:${NC} $BINARIES_DIR/mathverse-backend.jar"
echo ""
