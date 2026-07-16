"""Milvus 向量存储操作封装"""
import json
import os
from typing import Optional
from pymilvus import (
    connections, CollectionSchema, FieldSchema, DataType,
    Collection, utility, IndexType
)

MILVUS_HOST = os.environ.get("MILVUS_HOST", "localhost")
MILVUS_PORT = os.environ.get("MILVUS_PORT", "19530")
COLLECTION_NAME = os.environ.get("MILVUS_COLLECTION", "zd_rag")
EMBEDDING_DIM = int(os.environ.get("EMBEDDING_DIM", "768"))

def get_connection():
    """获取 Milvus 连接（单例模式）"""
    if not connections.has_connection("default"):
        connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)
    return connections.get_connection_addr("default")

def ensure_collection(dim: int = EMBEDDING_DIM):
    """创建 collection（如不存在）"""
    get_connection()
    if utility.has_collection(COLLECTION_NAME):
        return Collection(COLLECTION_NAME)

    schema = CollectionSchema(
        fields=[
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="source", dtype=DataType.VARCHAR, max_length=256),
            FieldSchema(name="chapter", dtype=DataType.VARCHAR, max_length=128),
            FieldSchema(name="chunk_idx", dtype=DataType.INT64),
            FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=8192),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=dim),
        ],
        description="知识动力 RAG 知识库"
    )
    collection = Collection(COLLECTION_NAME, schema)

    # 创建索引
    index_params = {
        "metric_type": "IP",
        "index_type": "IVF_FLAT",
        "params": {"nlist": 256}
    }
    collection.create_index("embedding", index_params)
    collection.load()

    print(f"  ✓ 创建 collection: {COLLECTION_NAME} (dim={dim})")
    return collection

def insert_chunks(chunks: list[dict], embeddings: list[list[float]]):
    """批量写入向量"""
    if not chunks:
        return
    collection = ensure_collection(len(embeddings[0]))
    entities = [
        [c["source"] for c in chunks],
        [c.get("chapter", "") for c in chunks],
        [c["chunk_idx"] for c in chunks],
        [c["text"] for c in chunks],
        embeddings,
    ]
    mr = collection.insert(entities)
    collection.flush()
    print(f"  ✓ 写入 {len(chunks)} 个 chunk")

def search(query_vector: list[float], top_k: int = 5) -> list[dict]:
    """向量检索"""
    collection = ensure_collection(len(query_vector))
    collection.load()
    results = collection.search(
        data=[query_vector],
        anns_field="embedding",
        param={"nprobe": 16},
        limit=top_k,
        output_fields=["source", "chapter", "chunk_idx", "text"],
    )
    hits = []
    for hits_row in results:
        for hit in hits_row:
            hits.append({
                "source": hit.entity.get("source"),
                "chapter": hit.entity.get("chapter"),
                "chunk_idx": hit.entity.get("chunk_idx"),
                "text": hit.entity.get("text"),
                "score": hit.score,
            })
    return hits

def delete_by_source(source: str):
    """按来源文档删除"""
    collection = Collection(COLLECTION_NAME)
    collection.delete(f'source == "{source}"')
    collection.flush()
    print(f"  ✓ 删除 {source} 的向量")

def get_stats() -> dict:
    """获取集合统计"""
    get_connection()
    if not utility.has_collection(COLLECTION_NAME):
        return {"count": 0, "sources": []}
    collection = Collection(COLLECTION_NAME)
    collection.load()
    count = collection.num_entities
    # 查所有 distinct source
    results = collection.query(expr="id >= 0", output_fields=["source"], limit=10000)
    sources = list(set(r["source"] for r in results if r.get("source")))
    return {"count": count, "sources": sorted(sources)}
