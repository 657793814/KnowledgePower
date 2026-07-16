#!/usr/bin/env python3
"""
知识动力 PDF → Milvus 向量化流水线

用法:
    python ingest.py                          # 全量处理
    python ingest.py --update-only            # 仅处理新/变动的 PDF
    python ingest.py --source "xxx.pdf"       # 单文件处理
    python ingest.py --stats                  # 查看当前知识库统计

配置文件: ../config/ai-config.json (可选的 Ollama 参数)
"""
import argparse
import hashlib
import json
import os
import sys
import time
from pathlib import Path

# 确保能导入同级模块
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from parsers.pdf_parser import extract_text, extract_text_with_pages
from parsers.chunker import split_document
from embeddings.ollama_embed import get_embeddings_batch
from vector_store import ensure_collection, insert_chunks, delete_by_source, get_stats


# 教材资料目录
PDF_DIR = os.path.expanduser("/Users/liuzuodong/Documents/教材资料")
MANIFEST_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ingest-manifest.json")


def load_manifest() -> dict:
    if os.path.exists(MANIFEST_PATH):
        with open(MANIFEST_PATH) as f:
            return json.load(f)
    return {}


def save_manifest(manifest: dict):
    os.makedirs(os.path.dirname(MANIFEST_PATH), exist_ok=True)
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)


def file_hash(filepath: str) -> str:
    """计算文件 SHA256（用于检测变动）"""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def process_pdf(filepath: str, source_name: str) -> int:
    """处理单个 PDF 文件，返回 chunk 数"""
    print(f"\n  📄 {source_name}")

    # 1. 提取文本
    full_text = extract_text(filepath)
    if not full_text.strip():
        print(f"  ⚠️  空内容，跳过")
        return 0

    # 2. 分块
    chunks = split_document(
        source=source_name,
        text=full_text,
        chunk_size=256,
        chunk_overlap=32,
    )
    if not chunks:
        print(f"  ⚠️  分块后为空，跳过")
        return 0

    # 3. 向量化
    texts = [c["text"] for c in chunks]
    print(f"  🧮 向量化 {len(texts)} 个 chunk...")
    embeddings = get_embeddings_batch(texts)

    # 4. 写入 Milvus
    insert_chunks(chunks, embeddings)
    return len(chunks)


def main():
    parser = argparse.ArgumentParser(description="知识动力 PDF 向量化流水线")
    parser.add_argument("--update-only", action="store_true", help="仅处理新/变动的 PDF")
    parser.add_argument("--source", type=str, help="仅处理单个文件（文件名）")
    parser.add_argument("--stats", action="store_true", help="查看知识库统计")
    args = parser.parse_args()

    # 仅查看统计
    if args.stats:
        stats = get_stats()
        print(f"\n📊 知识库统计")
        print(f"   总向量数: {stats['count']}")
        print(f"   文档数:   {len(stats['sources'])}")
        for s in stats['sources']:
            print(f"     - {s}")
        return

    # 检查 PDF 目录
    pdf_dir = Path(PDF_DIR)
    if not pdf_dir.exists():
        print(f"❌ PDF 目录不存在: {PDF_DIR}")
        sys.exit(1)

    pdf_files = sorted(pdf_dir.glob("*.pdf"))
    if not pdf_files:
        print(f"❌ 未找到 PDF 文件")
        sys.exit(1)

    print(f"📚 找到 {len(pdf_files)} 个 PDF 文件")
    print(f"🗄️ 目标: Milvus collection 'zd_rag'")
    print()

    # 确保 collection 存在
    ensure_collection()

    # 读取 manifest
    manifest = load_manifest()
    if not manifest:
        manifest = {"files": {}}

    # 检查 Milvus 现有 sources
    existing_sources = set(get_stats()["sources"])

    total_chunks = 0
    total_files = 0
    skipped = 0

    for pdf_path in pdf_files:
        fname = pdf_path.name

        # 过滤单文件模式
        if args.source and args.source not in fname:
            continue

        # 检查是否已处理（update-only 模式）
        current_hash = file_hash(str(pdf_path))
        prev_hash = manifest["files"].get(fname, {}).get("hash")

        if args.update_only and current_hash == prev_hash:
            skipped += 1
            continue

        # 如果文件名变了但内容变了，先清旧数据
        if fname in existing_sources:
            print(f"  📌 文档已存在，重新处理: {fname}")
            delete_by_source(fname)

        # 处理
        try:
            chunk_count = process_pdf(str(pdf_path), fname)
            if chunk_count > 0:
                total_chunks += chunk_count
                total_files += 1
                # 更新 manifest
                manifest["files"][fname] = {
                    "hash": current_hash,
                    "chunks": chunk_count,
                    "processed_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                }
        except Exception as e:
            print(f"  ❌ 处理失败: {e}")

    # 保存 manifest
    save_manifest(manifest)

    print(f"\n✅ 完成!")
    print(f"   处理: {total_files} 个文件, {total_chunks} 个 chunk")
    if skipped:
        print(f"   跳过: {skipped} 个（已是最新）")

    # 最终统计
    stats = get_stats()
    print(f"   Milvus 总向量: {stats['count']}")


if __name__ == "__main__":
    main()
