#!/bin/bash
# KnowledgePower 一键启动脚本
# 用法:
#   ./start.sh [backend] [frontend-only]
#     backend: java | node (默认: java)
#     frontend-only: 可选，设为 "frontend" 只启动前端

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND="${1:-java}"
MODE="${2:-}"

mkdir -p "$PROJECT_DIR/logs"

echo "🚀 KnowledgePower 启动中..."
echo "  后端引擎: $BACKEND"

# ====== 后端启动 ======

load_ai_config() {
  local ai_config_path="$PROJECT_DIR/config/ai-config.json"
  if [ ! -f "$ai_config_path" ]; then
    echo "  ⚠️ AI 配置文件不存在: $ai_config_path"
    echo "     将使用默认配置，如需自定义请复制样例文件"
    return
  fi

  echo "  📖 加载 AI 配置..."
  local provider=$(cat "$ai_config_path" | grep -o '"provider": *"[^"]*"' | cut -d'"' -f4)
  local base_url=$(cat "$ai_config_path" | grep -o '"baseUrl": *"[^"]*"' | cut -d'"' -f4)
  local api_key=$(cat "$ai_config_path" | grep -o '"apiKey": *"[^"]*"' | cut -d'"' -f4)
  local model=$(cat "$ai_config_path" | grep -o '"model": *"[^"]*"' | cut -d'"' -f4)
  local max_tokens=$(cat "$ai_config_path" | grep -o '"maxTokens": *[0-9]*' | cut -d':' -f2 | tr -d ' ')
  local max_context_chars=$(cat "$ai_config_path" | grep -o '"maxContextChars": *[0-9]*' | cut -d':' -f2 | tr -d ' ')

  export AGNES_PROVIDER="${provider:-openai}"
  export AGNES_BASE_URL="${base_url:-http://localhost:11434}"
  export AGNES_API_BASE_URL="${base_url:-https://apihub.agnes-ai.com/v1}"
  export AGNES_API_KEY="${api_key:-}"
  export AGNES_MODEL="${model:-agnes-2.0-flash}"
  export AGNES_MAX_TOKENS="${max_tokens:-4096}"
  export AGNES_MAX_CONTEXT_CHARS="${max_context_chars:-3000}"

  if [ -n "$api_key" ]; then
    echo "     Provider: $provider | Model: $model | API Key: ${api_key:0:8}..."
  else
    echo "     Provider: $provider | Model: $model | API Key: 未配置"
  fi
}

start_java_backend() {
  echo "🔍 检查 MySQL..."
  if mysqladmin ping -h 127.0.0.1 -u root -proot1234 --silent 2>/dev/null; then
    echo "  ✅ MySQL 就绪"
  elif docker exec mysql-master mysqladmin ping -u root -proot1234 --silent 2>/dev/null; then
    echo "  ✅ MySQL 就绪 (Docker)"
  else
    echo "❌ MySQL 未运行！请先启动 Docker 中间件"
    echo "   前往: /Users/liuzuodong/Documents/workspace/dockerProject"
    exit 1
  fi

  echo "🗄️  检查数据库..."
  DB_EXISTS=$(mysql -h 127.0.0.1 -u root -proot1234 -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='knowledgepower'" 2>/dev/null | grep knowledgepower || true)
  if [ -z "$DB_EXISTS" ]; then
    echo "  创建数据库..."
    mysql -h 127.0.0.1 -u root -proot1234 -e "CREATE DATABASE knowledgepower DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo "  初始化表结构..."
    mysql -h 127.0.0.1 -u root -proot1234 knowledgepower < "$PROJECT_DIR/server/src/main/resources/db/init.sql"
  fi

  load_ai_config

  echo "🖥️  启动后端 (Spring Boot :8080)..."
  cd "$PROJECT_DIR/server"
  PID=$(lsof -ti:8080 2>/dev/null) && kill -9 $PID 2>/dev/null && echo "  已停止旧进程"
  AGNES_PROVIDER="$AGNES_PROVIDER" AGNES_BASE_URL="$AGNES_BASE_URL" AGNES_API_BASE_URL="$AGNES_API_BASE_URL" AGNES_API_KEY="$AGNES_API_KEY" AGNES_MODEL="$AGNES_MODEL" AGNES_MAX_TOKENS="$AGNES_MAX_TOKENS" AGNES_MAX_CONTEXT_CHARS="$AGNES_MAX_CONTEXT_CHARS" mvn spring-boot:run -Dspring-boot.run.profiles=dev -q > "$PROJECT_DIR/logs/server.log" 2>&1 &
  echo "  后端 PID: $! (日志: logs/server.log)"
  sleep 12

  export API_TARGET="http://localhost:8080"
}

start_node_backend() {
  echo "🖥️  启动后端 (Node.js :3001)..."
  cd "$PROJECT_DIR/node-server"
  PID=$(lsof -ti:3001 2>/dev/null) && kill -9 $PID 2>/dev/null && echo "  已停止旧进程"

  # 首次启动或数据库不存在时自动 seed
  if [ ! -f "prisma/knowledgepower.db" ]; then
    echo "  📦 初始化数据库..."
    npx prisma db push --skip-generate > /dev/null 2>&1
    npx tsx src/seeders/index.ts > "$PROJECT_DIR/logs/seed.log" 2>&1 && echo "  ✅ 种子数据已写入"
  fi

  npx tsx src/index.ts > "$PROJECT_DIR/logs/server.log" 2>&1 &
  echo "  后端 PID: $! (日志: logs/server.log)"
  sleep 3

  export API_TARGET="http://localhost:3001"
}

# ====== 前端启动 ======

start_frontend() {
  echo "🌐  启动前端 (Vite :8082)..."
  cd "$PROJECT_DIR/web"
  PID=$(lsof -ti:8082 2>/dev/null) && kill -9 $PID 2>/dev/null
  API_TARGET="${API_TARGET:-http://localhost:8080}"
  API_TARGET="$API_TARGET" npm run dev > "$PROJECT_DIR/logs/web.log" 2>&1 &
  echo "  前端 PID: $! (日志: logs/web.log, 代理目标: $API_TARGET)"
  sleep 3
}

# ====== 主流程 ======

if [ "$MODE" != "frontend" ]; then
  case "$BACKEND" in
    node|Node|NODE)
      start_node_backend
      ;;
    java|Java|JAVA|*)
      start_java_backend
      ;;
  esac
fi

start_frontend

echo ""
echo "✅ KnowledgePower 启动完成！"
echo "  前端:     http://localhost:8082"
echo "  后端:     ${API_TARGET:-http://localhost:8080}"
echo ""
echo "  后端切换: ./start.sh java   (Java + MySQL)"
echo "            ./start.sh node   (Node.js + SQLite)"
echo "  单前端:   ./start.sh java frontend"
echo ""
echo "  停止: kill \$(lsof -ti:8080,3001,8082 2>/dev/null) 2>/dev/null"