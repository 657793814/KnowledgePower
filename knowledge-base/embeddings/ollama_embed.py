"""Ollama Embedding 调用"""
import requests
import numpy as np

OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "nomic-embed-text"


def get_embedding(text: str, model: str = DEFAULT_MODEL) -> list[float]:
    """调 Ollama embedding API 获取单个文本的向量"""
    resp = requests.post(
        f"{OLLAMA_BASE_URL}/api/embed",
        json={"model": model, "input": text},
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()
    embeddings = data.get("embeddings", [])
    if not embeddings:
        raise ValueError(f"Ollama embedding 返回空: {data}")
    return embeddings[0]


def get_embeddings_batch(
    texts: list[str],
    model: str = DEFAULT_MODEL,
    batch_size: int = 10,
) -> list[list[float]]:
    """批量获取 embedding（支持自动分批）"""
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/api/embed",
            json={"model": model, "input": batch},
            timeout=60,
        )
        resp.raise_for_status()
        data = resp.json()
        batch_embeddings = data.get("embeddings", [])
        all_embeddings.extend(batch_embeddings)

        import sys
        print(f"    embedding {min(i + batch_size, len(texts))}/{len(texts)}", end="\r")
        sys.stdout.flush()

    print()
    return all_embeddings
