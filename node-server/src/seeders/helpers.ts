/**
 * MathVerse 种子数据 — 共享工具函数
 */
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function sn(
  id: string, title: string, subtitle: string | null,
  subject: string, domain: string, level: string,
  difficulty: number, sortOrder: number, visualType: string | null, summary: string,
  contentJson: string, milestoneType: string | null = null
) {
  await prisma.knowledgeNode.create({
    data: { id, title, subtitle, subject, domain, level, difficulty, sortOrder, visualType, summary, contentJson, milestoneType, status: 1 },
  });
}

export async function sr(from: string, to: string, type: string, sortOrder: number, description?: string) {
  await prisma.knowledgeRelation.create({
    data: { fromNodeId: from, toNodeId: to, relationType: type, sortOrder, description: description || null },
  });
}

export function q(
  nodeId: string, subject: string, domain: string, level: string, qtype: string, diff: number,
  title: string, answer: string, explanation: string, options?: string | null
) {
  return { nodeId, subject, domain, level, questionType: qtype, difficulty: diff, title, options: options || null, answer, explanation };
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
