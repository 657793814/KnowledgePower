/**
 * AiService — AI 模块业务逻辑
 * 只实现 OpenAI 兼容接口（当前用的是 agnes-2.0-flash），去掉 Ollama 分支
 * 对应 Java 侧的 AiService.java
 */
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { getAiConfig } from '../config.js';
import { searchRag } from './ragService.js';

const SYSTEM_PROMPT = `你是一位富有耐心的初中高中数学导师（数学教授水平）。
你的教学风格：
1. 用通俗易懂的语言解释数学概念
2. 善用类比和生活例子
3. 多提问引导学生思考，而不是直接给答案
4. 当学生问数学题时，先给出提示，逐步引导
5. 涉及公式时用 LaTeX 格式：$公式$
6. 回答保持简洁，控制在 200-500 字`;

export function buildAiService(prisma: PrismaClient) {

  // ========== AI 知识问答 ==========

  async function ask(req: {
    nodeId?: string;
    question: string;
    context?: string;
    history?: string[];
  }) {
    try {
      const knowledgeContext = req.context || (req.nodeId ? await buildKnowledgeContext(req.nodeId) : '');
      const historyStr = req.history?.length
        ? '\n## 对话历史\n' + req.history.join('\n')
        : '';

      // RAG 检索
      let ragContext = '';
      try {
        const ragResults = await searchRag(req.question);
        if (ragResults.length > 0) {
          ragContext = '\n## 教材参考资料\n' + ragResults.map(r =>
            `[来自《${r.source}》(相似度${(r.score * 100).toFixed(0)}%)]\n${r.text}`
          ).join('\n\n---\n\n');
        }
      } catch (e) {
        // RAG 检索失败不阻塞主流程
        console.warn('[ai] RAG 检索异常:', (e as Error).message);
      }

      const userContent = `\n## 知识点上下文\n${knowledgeContext}${ragContext}${historyStr}\n\n## 学生提问\n${req.question}`;
      const answer = await callAi(userContent);

      return { answer, success: true };
    } catch (e: any) {
      console.error('[AiService] ask 失败:', e.message);
      return {
        success: false,
        error: `AI 服务暂时不可用：${e.message}`,
        answer: buildFallbackAnswer(req.question),
      };
    }
  }

  // ========== AI 错题解析 ==========

  async function explainMistake(req: {
    nodeId?: string;
    questionTitle: string;
    userAnswer: string;
    correctAnswer: string;
  }) {
    try {
      const context = req.nodeId ? await buildKnowledgeContext(req.nodeId) : '';
      const userContent = `\n## 相关知识点上下文\n${context}\n\n## 学生做错的题\n题目：${req.questionTitle}\n学生的答案：${req.userAnswer}\n正确答案：${req.correctAnswer}\n\n请做三件事：\n1. 用通俗语言解释为什么正确答案是对的\n2. 分析学生可能哪里理解错了\n3. 出一个类似的变式题让学生巩固`;
      const answer = await callAi(userContent);

      return { answer, success: true };
    } catch (e: any) {
      console.error('[AiService] explainMistake 失败:', e.message);
      return {
        success: false,
        error: 'AI 服务暂时不可用',
        answer: `💡 **知识点提示**\n\n正确答案是 ${req.correctAnswer}。建议回顾相关知识点，注意审题和计算细节。`,
      };
    }
  }

  // ========== AI 学习推荐 ==========

  async function recommend(req: {
    domainStats: { domain: string; accuracyRate: number }[];
  }) {
    try {
      const statsStr = req.domainStats
        .map(d => `- ${d.domain}：正确率 ${d.accuracyRate.toFixed(1)}%`)
        .join('\n');

      const userContent = `\n## 学生学习统计\n${statsStr}\n\n请分析学生的学习情况，给出：\n1. 哪个领域最薄弱，需要优先加强\n2. 推荐具体的学习顺序和知识点\n3. 学习建议（具体可操作）`;
      const answer = await callAi(userContent);

      return { answer, success: true };
    } catch (e: any) {
      console.error('[AiService] recommend 失败:', e.message);
      return {
        success: false,
        error: 'AI 服务暂时不可用',
        answer: buildRuleBasedRecommendation(req.domainStats),
      };
    }
  }

  // ========== AI 智能组卷 ==========

  async function generatePaper(req: {
    domainStats: { domain: string; accuracyRate: number }[];
    count: number;
  }) {
    try {
      const statsStr = req.domainStats
        .map(d => `- ${d.domain}：正确率 ${d.accuracyRate.toFixed(1)}%`)
        .join('\n');

      const userContent = `\n你是一位数学老师，需要根据学生的正确率统计，设计一份针对性试卷。\n\n## 学生学习统计\n${statsStr}\n\n试卷总题数：${req.count} 题\n\n请分析后，按以下JSON格式回复（不要包含其他内容）：\n{\n  "focusDomain": "最需要加强的领域",\n  "allocations": [\n    {"domain": "领域名", "count": 出题数, "difficulty": "easy|mixed|hard", "reason": "简要原因"}\n  ]\n}\n\n规则：\n1. 正确率低于60%的领域，出基础巩固题（easy）\n2. 正确率60-80%的领域，出混合题（mixed）\n3. 正确率高于80%的领域，出进阶题或不出（hard）\n4. 各领域题数总和不能超过 ${req.count}\n5. 优先覆盖正确率最低的领域`;
      const answer = await callAi(userContent);

      const suggestion = parsePaperSuggestion(answer);
      if (!suggestion) {
        return buildRuleBasedPaperSuggestion(req);
      }
      return { ...suggestion, suggestion: answer, success: true };
    } catch (e: any) {
      console.error('[AiService] generatePaper 失败:', e.message);
      const fallback = buildRuleBasedPaperSuggestion(req);
      return { ...fallback, success: false, suggestion: 'AI 暂时不可用，已用规则生成默认组卷' };
    }
  }

  // ========== 内部方法 ==========

  async function buildKnowledgeContext(nodeId: string): Promise<string> {
    const node = await prisma.knowledgeNode.findUnique({ where: { id: nodeId } });
    if (!node) return '';

    const parts: string[] = [];
    parts.push(`知识点：${node.title}`);
    parts.push(`所属领域：${node.domain}`);
    parts.push(`难度等级：${node.level}`);
    parts.push(`核心内容：${node.summary}`);

    // 前置知识
    const prereqs = await prisma.knowledgeRelation.findMany({
      where: { toNodeId: nodeId, relationType: 'prerequisite' },
    });
    if (prereqs.length) {
      const names = await Promise.all(
        prereqs.map(async r => {
          const pn = await prisma.knowledgeNode.findUnique({ where: { id: r.fromNodeId } });
          return pn?.title || r.fromNodeId;
        }),
      );
      parts.push(`前置知识：${names.join(' → ')}`);
    }

    // 后置知识
    const nexts = await prisma.knowledgeRelation.findMany({
      where: { fromNodeId: nodeId, relationType: 'next' },
    });
    if (nexts.length) {
      const names = await Promise.all(
        nexts.map(async r => {
          const nn = await prisma.knowledgeNode.findUnique({ where: { id: r.toNodeId } });
          return nn?.title || r.toNodeId;
        }),
      );
      parts.push(`后续知识：${names.join(' → ')}`);
    }

    // 内容摘要
    let content = node.contentJson || '';
    if (content.length > getAiConfig().maxContextChars) {
      content = content.slice(0, getAiConfig().maxContextChars) + '...';
    }
    parts.push(`详细内容：${content || '暂无'}`);

    return parts.join('\n');
  }

  /** 调用 OpenAI 兼容 API */
  async function callAi(userPrompt: string, retries = 3): Promise<string> {
    const url = `${getAiConfig().baseUrl}/chat/completions`;

    const body = {
      model: getAiConfig().model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      stream: false,
      max_tokens: getAiConfig().maxTokens,
      temperature: 0.7,
    };

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (getAiConfig().apiKey) headers['Authorization'] = `Bearer ${getAiConfig().apiKey}`;

    let lastError: any;
    let delay = 1000;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const resp = await axios.post(url, body, { headers, timeout: 60000 });

        const text = resp.data?.choices?.[0]?.message?.content || '';
        return text.replace(/\n{3,}/g, '\n\n').trim();
      } catch (e: any) {
        lastError = e;
        const status = e.response?.status;
        const isTimeout = e.code === 'ECONNABORTED';

        // 超时不重试 — 30-40 秒都等不到的 API 再等也没用
        if (isTimeout) {
          throw new Error('AI API 请求超时（远程 AI 响应较慢，请稍后重试）');
        }

        // 4xx 不重试
        if (status && status < 500) {
          throw new Error(`AI API 返回错误: ${status} - ${e.response?.data || e.message}`);
        }

        // 仅 5xx/网络错误可重试
        if (attempt < retries) {
          console.warn(`[AiService] 请求失败 (${attempt}/${retries}), ${delay}ms后重试:`, e.message);
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
        }
      }
    }

    throw new Error(`AI API 调用失败 (重试${retries}次后放弃): ${lastError?.message}`);
  }

  /** 解析 AI 组卷 JSON 回复 */
  function parsePaperSuggestion(aiResponse: string): {
    focusDomain: string;
    allocations: { domain: string; count: number; difficulty: string; reason: string }[];
  } | null {
    try {
      const start = aiResponse.indexOf('{');
      const end = aiResponse.lastIndexOf('}');
      if (start < 0 || end <= start) return null;

      const json = JSON.parse(aiResponse.slice(start, end + 1));
      return {
        focusDomain: json.focusDomain || '',
        allocations: (json.allocations || []).map((a: any) => ({
          domain: a.domain || '',
          count: a.count || 0,
          difficulty: a.difficulty || 'mixed',
          reason: a.reason || '',
        })),
      };
    } catch {
      return null;
    }
  }

  /** 基于规则的组卷降级 */
  function buildRuleBasedPaperSuggestion(req: { domainStats: { domain: string; accuracyRate: number }[]; count: number }) {
    if (!req.domainStats?.length) {
      return { focusDomain: '', allocations: [], weakCount: 0, otherCount: 0 };
    }
    const sorted = [...req.domainStats].sort((a, b) => a.accuracyRate - b.accuracyRate);

    const perDomain = Math.max(1, Math.floor(req.count / sorted.length));
    const remainder = req.count - perDomain * sorted.length;

    const allocations = sorted.map((d, i) => {
      const count = perDomain + (i < remainder ? 1 : 0);
      let difficulty: string;
      let reason: string;
      if (d.accuracyRate < 60) {
        difficulty = 'easy';
        reason = '正确率偏低，建议基础巩固';
      } else if (d.accuracyRate < 80) {
        difficulty = 'mixed';
        reason = '中等水平，查漏补缺';
      } else {
        difficulty = 'hard';
        reason = '掌握较好，试试进阶题';
      }
      return { domain: d.domain, count, difficulty, reason };
    });

    const weakCount = allocations.filter(a => a.difficulty === 'easy').reduce((s, a) => s + a.count, 0);
    const otherCount = allocations.filter(a => a.difficulty !== 'easy').reduce((s, a) => s + a.count, 0);

    return {
      focusDomain: sorted[0].domain,
      allocations,
      weakCount,
      otherCount,
    };
  }

  /** 降级回答 */
  function buildFallbackAnswer(question: string): string {
    return `💡 **关于「${question}」**\n\nAI 导师暂时离线，但你仍可以：\n1. 查看当前知识点的「定义」和「关键点」\n2. 查看知识图谱中的前后置关联\n3. 返回练习页面做几道题巩固\n\n建议查看的知识点链接已在页面上方列出。`;
  }

  /** 基于规则的学习推荐降级 */
  function buildRuleBasedRecommendation(stats: { domain: string; accuracyRate: number }[]): string {
    if (!stats?.length) {
      return '📚 **学习建议**\n\n暂时没有足够数据。先去练习几道题吧！';
    }

    const weakest = stats.reduce((a, b) => a.accuracyRate < b.accuracyRate ? a : b);
    const lines: string[] = [];

    if (weakest.accuracyRate < 60) {
      lines.push(`🔴 **当前最薄弱领域：${weakest.domain}**（正确率 ${weakest.accuracyRate.toFixed(1)}%）\n`);
      lines.push('建议优先复习该领域的知识点，多做练习题巩固。\n');
    }

    lines.push('📊 **各领域情况**');
    for (const d of stats) {
      const icon = d.accuracyRate >= 80 ? '🟢' : d.accuracyRate >= 60 ? '🟡' : '🔴';
      lines.push(`${icon} ${d.domain}：${d.accuracyRate.toFixed(1)}%`);
    }

    lines.push('\n💡 **建议**');
    lines.push('1. 薄弱领域：先看知识点定义，再做基础题');
    lines.push('2. 中等领域：做混合练习，查漏补缺');
    lines.push('3. 掌握领域：尝试综合题，保持手感');

    return lines.join('\n');
  }

  return { ask, explainMistake, recommend, generatePaper };
}
