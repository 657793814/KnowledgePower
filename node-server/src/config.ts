/**
 * 配置加载 — 替代 Java 侧的 application.yml
 */
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    url: process.env.DATABASE_URL || 'file:./prisma/mathverse.db',
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'openai',
    baseUrl: process.env.AI_API_BASE_URL || 'https://apihub.agnes-ai.com/v1',
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'agnes-2.0-flash',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4096', 10),
    maxContextChars: parseInt(process.env.AI_MAX_CONTEXT_CHARS || '3000', 10),
  },
};
