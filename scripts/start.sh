#!/bin/bash
# ============================================================
# MathVerse 一键启动
# 编译后端 → 启动后端 → 启动前端开发服务器
# ============================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"
WEB_DIR="$ROOT_DIR/web"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

cleanup() {
    info "正在停止服务..."
    [ -n "${BACKEND_PID:-}" ] && kill "$BACKEND_PID" 2>/dev/null && info "后端已停止 (PID: $BACKEND_PID)"
    [ -n "${FRONTEND_PID:-}" ] && kill "$FRONTEND_PID" 2>/dev/null && info "前端已停止 (PID: $FRONTEND_PID)"
    exit 0
}
trap cleanup SIGINT SIGTERM

# ---------- Step 1: 编译后端 ----------
info "========== 1/3 编译后端 =========="
JAR=$(ls "$SERVER_DIR/target/mathverse-server-*.jar" 2>/dev/null | head -1)
if [ -z "$JAR" ]; then
    info "JAR 不存在，执行编译..."
    cd "$SERVER_DIR"
    mvn clean package -DskipTests -q
    JAR=$(ls target/mathverse-server-*.jar | head -1)
    info "编译完成 ✅"
else
    info "使用已有 JAR: $(basename "$JAR")"
fi

# ---------- Step 2: 启动后端 ----------
info "========== 2/3 启动后端 =========="
cd "$SERVER_DIR"
java -jar "$JAR" --spring.profiles.active=dev &
BACKEND_PID=$!
info "后端 PID: $BACKEND_PID"

# 等待后端就绪
info "等待后端就绪..."
for i in $(seq 1 30); do
    if curl -sf 'http://localhost:8080/exam/random?count=1' > /dev/null 2>&1; then
        info "后端就绪 ✅ http://localhost:8080"
        break
    fi
    if [ "$i" -eq 30 ]; then
        warn "后端启动超时，但前端仍可尝试连接..."
    fi
    sleep 1
done

# ---------- Step 3: 启动前端 ----------
info "========== 3/3 启动前端 =========="
cd "$WEB_DIR"

if [ ! -d "node_modules" ]; then
    info "安装前端依赖..."
    npm install --silent
fi

npm run dev &
FRONTEND_PID=$!
info "前端 PID: $FRONTEND_PID"

# ---------- 完成 ----------
echo ""
echo -e "${GREEN}====================================${NC}"
echo -e "${GREEN}  MathVerse 已启动 🎉${NC}"
echo -e "${GREEN}====================================${NC}"
echo -e "  前端: ${YELLOW}http://localhost:8082${NC}"
echo -e "  后端: ${YELLOW}http://localhost:8080${NC}"
echo -e "  AI:   ${YELLOW}http://localhost:11434${NC} (Ollama)"
echo ""
echo "  按 Ctrl+C 停止所有服务"
echo ""

wait
