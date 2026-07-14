#!/bin/bash
# ============================================================
# MathVerse 全平台打包脚本
# 一键：编译后端 → 构建前端 → 打包 Tauri .app/.dmg
# 支持后端引擎切换:
#   ./build.sh             —— 默认使用 Java (编译 JAR)
#   ./build.sh node        —— 使用 Node.js (编译 server.js)
#   ./build.sh java        —— Java JAR (显式)
# ============================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPT_DIR="$ROOT_DIR/scripts"
TAURI_DIR="$ROOT_DIR/src-tauri"
SERVER_DIR="$ROOT_DIR/server"
NODE_DIR="$ROOT_DIR/node-server"
WEB_DIR="$ROOT_DIR/web"
BINARIES_DIR="$TAURI_DIR/binaries"
NODE_BUNDLE_DIR="$TAURI_DIR/backend"

# 后端引擎: java | node
BACKEND="${1:-java}"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检测 Java
check_java() {
    if ! command -v java &>/dev/null; then
        error "需要 Java 21+，请先安装 JDK"
        exit 1
    fi
    JAVA_VER=$(java -version 2>&1 | head -1 | sed 's/.*version "\([0-9]*\).*/\1/')
    info "Java 版本: $(java -version 2>&1 | head -1)"
}

# 检测 Node.js
check_node() {
    if ! command -v node &>/dev/null; then
        error "需要 Node.js 18+"
        exit 1
    fi
    info "Node.js 版本: $(node -v)"
}

# 检测 Rust (Tauri)
check_rust() {
    if ! command -v cargo &>/dev/null; then
        error "需要 Rust / Cargo，请先安装: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        exit 1
    fi
    info "Rust 版本: $(cargo --version)"
}

# ============================================================
# Step 1: 编译后端
# ============================================================
build_backend() {
    if [ "$BACKEND" = "node" ]; then
        info "========== 1/4 编译 Node.js 后端 =========="
        cd "$NODE_DIR"
        
        # 安装依赖
        npm install --production --ignore-scripts
        
        # 用 esbuild 打包成一个 JS 文件
        npx esbuild src/index.ts --bundle --platform=node --outfile="$NODE_BUNDLE_DIR/server.js" --external:@prisma/client
        
        # 复制 Prisma schema + 预生成的 client
        cp -r node_modules/.prisma "$NODE_BUNDLE_DIR/"
        cp prisma/schema.prisma "$NODE_BUNDLE_DIR/"
        
        # 初始数据库（空，首次启动时自动 seed）
        touch "$NODE_BUNDLE_DIR/prisma/mathverse.db"
        
        info "Node.js 后端打包完成: $NODE_BUNDLE_DIR/server.js"
    else
        info "========== 1/4 编译后端 JAR =========="
        cd "$SERVER_DIR"
        mvn clean package -DskipTests -q
    JAR_FILE=$(ls target/mathverse-server-*.jar 2>/dev/null | head -1)

    if [ -z "$JAR_FILE" ]; then
        error "后端编译失败，未找到 JAR"
        exit 1
    fi

    info "后端 JAR: $(basename "$JAR_FILE")"

    # 复制到 Tauri binaries 目录
    mkdir -p "$BINARIES_DIR"
    cp "$JAR_FILE" "$BINARIES_DIR/mathverse-backend.jar"
    info "已复制到 binaries/"

    # 同时保留一份在 scripts 目录（方便开发调试）
    cp "$JAR_FILE" "$SCRIPT_DIR/mathverse-backend.jar"
    info "已复制到 scripts/（开发调试用）"
}

# ============================================================
# Step 2: 构建前端
# ============================================================
build_frontend() {
    info "========== 2/4 构建前端 =========="
    cd "$WEB_DIR"

    if [ ! -d "node_modules" ]; then
        info "安装前端依赖..."
        npm install --silent
    fi

    npm run build
    info "前端构建完成 ✅"
}

# ============================================================
# Step 3: 启动后端 (开发模式用)
# ============================================================
start_backend_dev() {
    info "========== 启动后端开发服务器 =========="
    cd "$SERVER_DIR"

    # 找到 JAR
    JAR_FILE=$(ls target/mathverse-server-*.jar 2>/dev/null | head -1)
    if [ -z "$JAR_FILE" ]; then
        info "JAR 不存在，先编译..."
        build_backend
        JAR_FILE=$(ls target/mathverse-server-*.jar 2>/dev/null | head -1)
    fi

    info "启动后端: java -jar $(basename "$JAR_FILE")"
    java -jar "$JAR_FILE" &
    BACKEND_PID=$!
    info "后端 PID: $BACKEND_PID (按 Ctrl+C 停止)"

    # 等待后端就绪
    for i in {1..30}; do
        if curl -s http://localhost:8080/actuator/health 2>/dev/null | grep -q "UP"; then
            info "后端就绪 ✅ (http://localhost:8080)"
            break
        fi
        sleep 1
    done
}

# ============================================================
# Step 4: 构建 Tauri 桌面 App
# ============================================================
build_tauri() {
    info "========== 3/4 构建 Tauri 桌面 App =========="
    cd "$TAURI_DIR"

    # 确保前端已构建
    if [ ! -d "$WEB_DIR/dist" ]; then
        warn "前端 dist/ 不存在，先构建前端"
        build_frontend
    fi

    cargo build --release
    info "Tauri 编译完成 ✅"

    # 如果 bundle 可用，创建 .app
    if [ -f "target/release/bundle/macos/数理世界.app" ]; then
        info "✅ .app 已生成: target/release/bundle/macos/数理世界.app"
    fi

    if [ -f "target/release/bundle/dmg/数理世界.dmg" ]; then
        info "✅ .dmg 已生成: target/release/bundle/dmg/数理世界.dmg"
    fi
}

# ============================================================
# Step 5: 开发模式
# ============================================================
dev_mode() {
    info "========== 开发模式 =========="
    check_java
    check_node

    # 启动后端
    start_backend_dev

    # 启动前端 dev server
    info "启动前端开发服务器..."
    cd "$WEB_DIR"
    npm run dev &
    FRONTEND_PID=$!

    info "前端 PID: $FRONTEND_PID"
    info ""
    info "📐 MathVerse 开发模式已启动"
    info "   前端: http://localhost:8082"
    info "   后端: http://localhost:8080"
    info "   按 Ctrl+C 停止所有服务"

    # 等待任意进程退出
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
    wait
}

# ============================================================
# Step 6: 完整打包（增量构建）
# ============================================================
full_build() {
    info "========== MathVerse 完整打包 =========="
    check_java
    check_node
    check_rust

    build_backend
    build_frontend
    build_tauri

    info ""
    info "====================================="
    info "🎉 MathVerse 打包完成！"
    info "====================================="
    info "产物位置:"
    info "  .app: $TAURI_DIR/target/release/bundle/macos/数理世界.app"
    info "  .dmg: $TAURI_DIR/target/release/bundle/dmg/数理世界.dmg"
    info "  后端: $SCRIPT_DIR/mathverse-backend.jar"
    echo ""
}

# ============================================================
# CLI
# ============================================================
case "${1:-full}" in
    full)
        full_build
        ;;
    dev)
        dev_mode
        ;;
    backend)
        check_java
        build_backend
        ;;
    frontend)
        check_node
        build_frontend
        ;;
    tauri)
        check_rust
        build_frontend
        build_tauri
        ;;
    start-backend)
        check_java
        start_backend_dev
        ;;
    *)
        echo "用法: $0 [full|dev|backend|frontend|tauri|start-backend]"
        echo ""
        echo "  full           完整打包（后端+前端+Tauri）"
        echo "  dev            开发模式（后端+前端 dev server）"
        echo "  backend        仅编译后端 JAR"
        echo "  frontend       仅构建前端"
        echo "  tauri          仅构建 Tauri（需先 build frontend）"
        echo "  start-backend  启动后端开发服务器"
        exit 1
        ;;
esac
