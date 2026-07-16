/**
 * RAG 检索服务 — 通过 Milvus RESTful API 进行向量检索
 * 不依赖 milvus-sdk-node（避免原生编译问题）
 * 对应 Python 侧的 vector_store/__init__.py
 */
import axios from 'axios';
import { getAiConfig } from '../config.js';

const MILVUS_REST = process.env.MILVUS_REST_URL || 'http://localhost:9091/api/v1';
const MILVUS_GRPC = process.env.MILVUS_GRPC_URL || 'localhost:19530';  // gRPC 端口，REST API 走 9091
const COLLECTION = process.env.MILVUS_COLLECTION || 'zd_rag';

interface RagHit {
  source: string;
  chapter: string;
  chunk_idx: number;
  text: string;
  score: number;
}

/**
 * 获取 Ollama embedding
 */
async function getEmbedding(text: string): Promise<number[]> {
  const cfg = getAiConfig();
  const resp = await axios.post(`${cfg.ollamaBaseUrl}/api/embed`, {
    model: cfg.embeddingModel,
    input: text,
  }, { timeout: 30000 });
  return resp.data.embeddings?.[0] || [];
}

/**
 * 搜索 Milvus 向量库
 */
export async function searchRag(query: string, topK?: number, minScore?: number): Promise<RagHit[]> {
  const cfg = getAiConfig();
  if (!cfg.ragEnabled) return [];

  const k = topK || cfg.ragTopK || 5;
  const minS = minScore ?? cfg.ragMinScore ?? 0.65;

  // 1. 获取 query embedding
  let queryVector: number[];
  try {
    queryVector = await getEmbedding(query);
  } catch (e) {
    console.warn('[rag] Ollama embedding 失败:', (e as Error).message);
    return [];
  }
  if (!queryVector.length) return [];

  // 2. 调 Milvus REST API 检索
  try {
    const resp = await axios.post(`${MILVUS_REST}/search`, {
      collection_name: COLLECTION,
      vector: queryVector,
      topk: k,
      params: { nprobe: 16 },
      metric_type: 'IP',
      output_fields: ['source', 'chapter', 'chunk_idx', 'text'],
    }, { timeout: 10000 });

    const results = resp.data?.results || [];
    return results
      .filter((r: any) => r.score >= minS)
      .map((r: any) => ({
        source: r.source || '',
        chapter: r.chapter || '',
        chunk_idx: r.chunk_idx || 0,
        text: r.text || '',
        score: r.score,
      }));
  } catch (e) {
    console.warn('[rag] Milvus 检索失败:', (e as Error).message);
    return [];
  }
}

/**
 * 检查 Milvus 健康状态
 */
export async function checkMilvusHealth(): Promise<boolean> {
  try {
    const resp = await axios.get(`${MILVUS_REST}/health`, { timeout: 5000 });
    return resp.status === 200;
  } catch {
    return false;
  }
}

/**
 * 获取知识库统计
 */
export async function getRagStats(): Promise<{ count: number; sources: string[] }> {
  try {
    const resp = await axios.post(`${MILVUS_REST}/query`, {
      collection_name: COLLECTION,
      expr: 'id >= 0',
      output_fields: ['source'],
      limit: 10000,
    }, { timeout: 10000 });

    const results = resp.data?.results || [];
    const sources = [...new Set(results.map((r: any) => r.source).filter(Boolean))] as string[];
    return { count: results.length, sources: sources.sort() };
  } catch {
    return { count: 0, sources: [] };
  }
}
