/**
 * KnowledgePower Node Server — Express 入口
 * 替代 Java Spring Boot 后端
 */
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { fail } from './utils/response.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import userRouter from './routes/user.js';
import knowledgeNodesRouter from './routes/knowledgeNodes.js';
import knowledgeRelationsRouter from './routes/knowledgeRelations.js';
import knowledgeGraphRouter from './routes/knowledgeGraph.js';
import knowledgeSearchRouter from './routes/knowledgeSearch.js';
import examRouter from './routes/exam.js';
import aiRouter from './routes/ai.js';
import insightRouter from './routes/insight.js';
import uploadRouter from './routes/upload.js';
import prisma from './db.js';
import { initializeDatabase } from './init-db.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// 统一响应中间件 (可选，保留以保持一致性)
// 实际使用 ok()/fail() 工具函数

// 请求日志（类似 Java 的 ApiLogInterceptor）
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    // eslint-disable-next-line no-console
    console[level](`[REQ] ${req.method} ${req.path} → ${res.statusCode} (${elapsed}ms)`);
  });
  next();
});

// 路由
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/knowledge/nodes', knowledgeNodesRouter);
app.use('/knowledge/relations', knowledgeRelationsRouter);
app.use('/knowledge/graph', knowledgeGraphRouter);
app.use('/knowledge/search', knowledgeSearchRouter);
app.use('/exam', examRouter);
app.use('/ai', aiRouter);
app.use('/insight', insightRouter);
app.use('/upload', uploadRouter);

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 兜底
app.use((_req, res) => {
  fail(res, 404, '接口不存在');
});

// 全局错误处理
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err);
  const status = err.status || 500;
  const msg = err.message || '服务器内部错误';
  res.status(status >= 400 ? status : 500).json({ code: status, msg, data: null });
});

// 启动
initializeDatabase().then(() => {
  app.listen(config.port, () => {
    console.log(`🧮 KnowledgePower Node Server 启动成功 → http://localhost:${config.port}`);
  });
});

// 优雅退出
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
