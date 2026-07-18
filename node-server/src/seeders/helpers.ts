/**
 * KnowledgePower 种子数据 — 共享工具函数
 */
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function sn(
  id: string, title: string, subtitle: string | null,
  subject: string, domain: string, level: string,
  difficulty: number, sortOrder: number, visualType: string | null, summary: string,
  contentJson: string, milestoneType: string | null = null
) {
  // upsert 支持幂等运行
  const existing = await prisma.knowledgeNode.findUnique({ where: { id } });
  if (existing) {
    await prisma.knowledgeNode.update({
      where: { id },
      data: { title, subtitle, subject, domain, level, difficulty, sortOrder, visualType, summary, contentJson, milestoneType, status: 1 },
    });
    return;
  }
  await prisma.knowledgeNode.create({
    data: { id, title, subtitle, subject, domain, level, difficulty, sortOrder, visualType, summary, contentJson, milestoneType, status: 1 },
  });
}

export async function sr(from: string, to: string, type: string, sortOrder: number, description?: string) {
  // upsert 防止幂等运行时重复插入
  const existing = await prisma.knowledgeRelation.findFirst({
    where: {
      fromNodeId: from,
      toNodeId: to,
      relationType: type,
    },
  });
  if (existing) {
    await prisma.knowledgeRelation.update({
      where: { id: existing.id },
      data: { sortOrder, description: description || null },
    });
    return;
  }
  await prisma.knowledgeRelation.create({
    data: { fromNodeId: from, toNodeId: to, relationType: type, sortOrder, description: description || null },
  });
}

export function q(
  nodeId: string, subject: string, domain: string, level: string, qtype: string, diff: number,
  title: string, answer: string, explanation: string, options?: string | null
) {
  // 自动将数组格式 ["A. xxx","B. xxx"] 转为对象格式 {"A":"xxx","B":"xxx"}
  let normalized = options || null;
  if (normalized) {
    try {
      const parsed = JSON.parse(normalized);
      if (Array.isArray(parsed)) {
        const obj: Record<string, string> = {};
        for (const item of parsed) {
          const match = item.match(/^([A-Da-d])[.．、]\s*(.+)/);
          if (match) obj[match[1].toUpperCase()] = match[2];
        }
        if (Object.keys(obj).length > 0) normalized = JSON.stringify(obj);
      }
    } catch {}
  }
  return { nodeId, subject, domain, level, questionType: qtype, difficulty: diff, title, options: normalized, answer, explanation };
}

// ==================== 内容构建器 ====================

interface Section {
  type: string;
  title?: string;
  content?: string;
  items?: string[] | { mistake: string; correct: string }[];
  formulas?: string[];
  steps?: string[];
  result?: string;
  visual?: any;
  solution?: string;
}

interface Example {
  title: string;
  question: string;
  hint?: string;
  steps?: string[];
  answer: string;
  solution?: string;
}

interface VisualConfig {
  type: string;
  [key: string]: any;
}

/**
 * 构建 contentJson
 */
export function buildContent(
  sections: Section[],
  examples?: Example[],
  visual?: VisualConfig
): string {
  const obj: any = {};
  if (sections.length > 0) obj.sections = sections;
  if (examples && examples.length > 0) obj.examples = examples;
  if (visual) obj.visualization = visual;
  return JSON.stringify(obj);
}

/**
 * 快捷：构建教材级详细内容
 */
export function richContent(
  def: string,
  keypoints: string[],
  formulas: string[] = [],
  examples: Example[] = [],
  examFocus?: string,
  strategy?: string[],
  commonMistakes?: { mistake: string; correct: string }[],
  extended?: string,
  analogy?: string,
  derivation?: { title?: string; content?: string; steps?: string[]; formulas?: string[]; result?: string },
  visual?: { type: string; [key: string]: any },
): string {
  const sections: Section[] = [];

  // 定义
  sections.push({ type: 'definition', title: '📖 核心定义', content: def, formulas: formulas.length > 0 ? formulas : undefined });

  // 公式
  if (formulas.length > 0) {
    sections.push({ type: 'formula', title: '公式与定理', formulas, content: formulas.join('；') });
  }

  // 要点
  if (keypoints.length > 0) {
    sections.push({ type: 'keypoints', title: '核心要点', items: keypoints });
  }

  // 推导证明
  if (derivation) {
    sections.push({ type: 'derivation', title: derivation.title || '📐 推导证明', content: derivation.content, steps: derivation.steps, formulas: derivation.formulas, result: derivation.result });
  }

  // 类比
  if (analogy) {
    sections.push({ type: 'analogy', title: '类比理解', content: analogy });
  }

  // 示例
  if (examples.length > 0) {
    sections.push({ type: 'example', title: '典型例题', items: examples as any });
  }

  // 考点
  if (examFocus) {
    sections.push({ type: 'exam-focus', title: '考点分析', content: examFocus });
  }

  // 解题思路
  if (strategy && strategy.length > 0) {
    sections.push({ type: 'strategy', title: '解题思路', items: strategy });
  }

  // 易错点
  if (commonMistakes && commonMistakes.length > 0) {
    sections.push({ type: 'common-mistakes', title: '易错点辨析', items: commonMistakes });
  }

  // 可视化
  if (visual) {
    sections.push({ type: 'visualization', title: '直观理解', content: def.substring(0, 100), visual });
  }

  // 拓展
  if (extended) {
    sections.push({ type: 'extended', title: '拓展延伸', content: extended });
  }

  return JSON.stringify({ sections });
}

// ==================== 模型/题型总结构建器 ====================

interface ModelContentOpts {
  /** 模型定义 */
  definition: string;
  /** 识别特征：看到什么样的条件/图形可以想到这个模型 */
  recognition: string[];
  /** 核心原理（公式、定理基础） */
  principle: string;
  principleFormulas?: string[];
  /** 解题通法：分步标准解法 */
  standardSteps?: { title: string; content: string }[];
  /** 典型例题 */
  examples: Example[];
  /** 变式拓展 */
  variants?: Example[];
  /** 易错点 */
  commonMistakes?: { mistake: string; correct: string }[];
  /** 应用场景与技巧 */
  tips?: string[];
  /** 拓展延伸 */
  extended?: string;
}

/**
 * 构建题型/模型总结的 contentJson
 */
export function modelContent(opts: ModelContentOpts): string {
  const sections: Section[] = [];

  // 模型定义
  sections.push({ type: 'model-intro', title: '🎯 模型定义', content: opts.definition });

  // 核心原理
  sections.push({
    type: 'model-principle',
    title: '⚙️ 核心原理',
    content: opts.principle,
    formulas: opts.principleFormulas,
  });

  // 识别方法
  if (opts.recognition.length > 0) {
    sections.push({ type: 'recognition', title: '🔍 识别方法', items: opts.recognition });
  }

  // 解题通法
  if (opts.standardSteps && opts.standardSteps.length > 0) {
    sections.push({
      type: 'standard-steps',
      title: '📝 解题通法',
      items: opts.standardSteps.map(s => `${s.title}：${s.content}`),
    });
  }

  // 典型例题
  if (opts.examples.length > 0) {
    sections.push({ type: 'example', title: '📌 典型例题', items: opts.examples as any });
  }

  // 变式拓展
  if (opts.variants && opts.variants.length > 0) {
    sections.push({ type: 'variant', title: '🔁 变式拓展', items: opts.variants as any });
  }

  // 易错点
  if (opts.commonMistakes && opts.commonMistakes.length > 0) {
    sections.push({ type: 'common-mistakes', title: '⚠️ 易错提醒', items: opts.commonMistakes });
  }

  // 小技巧
  if (opts.tips && opts.tips.length > 0) {
    sections.push({ type: 'tips', title: '💡 技巧总结', items: opts.tips });
  }

  // 拓展延伸
  if (opts.extended) {
    sections.push({ type: 'extended', title: '🧠 拓展延伸', content: opts.extended });
  }

  return JSON.stringify({ sections });
}
