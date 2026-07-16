#!/bin/bash
# 知识动力 PDF 向量化入口
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SCRIPT_DIR/knowledge-base"

# 检查 Python 环境
PYTHON=$(command -v python3 || command -v python)
if [ -z "$PYTHON" ]; then
  echo "❌ 未找到 Python3"
  exit 1
fi

# Install deps if needed
if [ ! -d "venv" ]; then
  echo "📦 创建 Python venv..."
  $PYTHON -m venv venv
fi
source venv/bin/activate

echo "📦 检查依赖..."
pip install -q -r requirements.txt 2>/dev/null

# Run
ARGS="$@"
if [ -z "$ARGS" ]; then
  echo "📚 全量处理所有 PDF..."
  $PYTHON ingest.py
else
  echo "📚 运行: $PYTHON ingest.py $ARGS"
  $PYTHON ingest.py $ARGS
fi
