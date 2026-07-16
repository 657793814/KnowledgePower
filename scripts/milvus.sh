#!/bin/bash
# 知识动力 — Milvus 启动/停止/状态管理
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MILVUS_NAME="milvus"

case "${1:-status}" in
  start)
    if docker ps --filter name=$MILVUS_NAME --format "{{.Names}}" | grep -q $MILVUS_NAME; then
      echo "✅ Milvus 已在运行"
    else
      echo "🚀 启动 Milvus..."
      docker rm -f $MILVUS_NAME 2>/dev/null || true
      docker run -d --name $MILVUS_NAME \
        -p 19530:19530 \
        -p 9091:9091 \
        milvusdb/milvus:v2.5.4 \
        milvus run standalone
      echo "⏳ 等待就绪..."
      for i in {1..60}; do
        if curl -sf http://localhost:9091/api/v1/health > /dev/null 2>&1; then
          echo "✅ Milvus 已就绪 ($((i*2))秒)"
          break
        fi
        sleep 2
      done
    fi
    ;;
  stop)
    docker stop $MILVUS_NAME 2>/dev/null && echo "🛑 Milvus 已停止" || echo "Milvus 未运行"
    ;;
  status)
    if docker ps --filter name=$MILVUS_NAME --format "{{.Names}}" | grep -q $MILVUS_NAME; then
      echo "✅ Milvus 运行中"
      curl -s http://localhost:9091/api/v1/health 2>/dev/null | head -1
    else
      echo "❌ Milvus 未运行"
    fi
    ;;
  ingest)
    cd "$SCRIPT_DIR"
    echo "📚 运行 PDF 向量化..."
    bash scripts/ingest.sh "${@:2}"
    ;;
  *)
    echo "用法: $0 {start|stop|status|ingest}"
    exit 1
    ;;
esac
