/**
 * 配置加载 — 本地文件 + 环境变量混合模式
 * AI 配置优先从 config/ai-config.json 读取，支持热重载
 */
import dotenv from 'dotenv';
import { readFileSync, watch, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// 兼容 esbuild bundle（没有 import.meta）和 tsx 开发的两种场景
let __dirname: string;
try {
  __dirname = dirname(fileURLToPath(import.meta.url));
} catch {
  __dirname = process.cwd();
}

// ===== AI 配置类型 =====
export interface AiConfig {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  maxContextChars: number;
  temperature: number;
  topP: number;
  ragEnabled: boolean;
  ragTopK: number;
  ragMinScore: number;
  embeddingModel: string;
  embeddingDim: number;
  ollamaBaseUrl: string;
}

// 可通过环境变量 ZD_CONFIG_PATH 覆盖配置路径（打包后场景）
const AI_CONFIG_PATH = process.env.ZD_CONFIG_PATH || join(__dirname, '../../config/ai-config.json');

let aiConfig: AiConfig;

function loadAiConfig(): AiConfig {
  const defaults: AiConfig = {
    provider: 'openai',
    baseUrl: 'https://apihub.agnes-ai.com/v1',
    apiKey: '',
    model: 'agnes-2.0-flash',
    maxTokens: 4096,
    maxContextChars: 3000,
    temperature: 0.7,
    topP: 0.9,
    ragEnabled: false,
    ragTopK: 5,
    ragMinScore: 0.65,
    embeddingModel: 'nomic-embed-text',
    embeddingDim: 768,
    ollamaBaseUrl: 'http://localhost:11434',
  };

  if (existsSync(AI_CONFIG_PATH)) {
    try {
      const raw = readFileSync(AI_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed };
    } catch (e) {
      console.warn('[config] ai-config.json 解析失败，使用默认值:', e);
    }
  }
  return defaults;
}

// 初始加载
aiConfig = loadAiConfig();

// 文件变化热重载
if (existsSync(dirname(AI_CONFIG_PATH))) {
  try {
    watch(AI_CONFIG_PATH, () => {
      aiConfig = loadAiConfig();
      console.log('[config] AI 配置已热重载');
    });
  } catch {
    // 某些环境下 watch 不可用，忽略
  }
}

export function getAiConfig(): AiConfig {
  return { ...aiConfig };
}

export function setAiConfig(partial: Partial<AiConfig>): AiConfig {
  const updated = { ...aiConfig, ...partial };
  try {
    writeFileSync(AI_CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    aiConfig = updated;
  } catch (e) {
    console.error('[config] 保存 AI 配置失败:', e);
    throw e;
  }
  return { ...updated };
}

// ===== 去除 AI 配置的 .env 引用 =====
export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    url: process.env.DATABASE_URL || 'file:./prisma/knowledgepower.db',
  },
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minio',
    secretKey: process.env.MINIO_SECRET_KEY || 'minio123',
    bucket: process.env.MINIO_BUCKET || 'zdknowledge',
    publicEndpoint: process.env.MINIO_PUBLIC_ENDPOINT || 'http://localhost:9000',
  },
};
