/**
 * 修复 DB 中 < 和 > 字符的问题
 * 1. 替换 $...$ 内的 < 为 \lt ，> 为 \gt
 * 2. 替换非公式文本中的 < 和 > 为全角 ＜ ＞（渲染安全）
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** 判断文本是否是 LaTeX 公式（包含反斜杠命令） */
function hasLatexCommands(s: string): boolean {
  return /\\[a-zA-Z]/.test(s);
}

/** 修复单个文本中的 < 和 > */
function fixText(text: string): string {
  if (!text) return text;
  
  // 修复 $...$ 内的 < > → \lt \gt
  let result = text.replace(/\$([^$\n]+?)\$/g, (match, latex: string) => {
    if (!hasLatexCommands(latex)) return match;
    const fixed = latex.replace(/</g, '\\lt ').replace(/>/g, '\\gt ').replace(/  +/g, ' ');
    return '$' + fixed + '$';
  });
  
  // 修复 $$...$$ 内的 < > → \lt \gt
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, (match, latex: string) => {
    const fixed = latex.replace(/</g, '\\lt ').replace(/>/g, '\\gt ').replace(/  +/g, ' ');
    return '$$' + fixed + '$$';
  });
  
  return result;
}

async function main() {
  console.log('开始修复题库中的 < 和 > 字符...\n');

  // 1. 查询所有包含 < 或 > 的题目
  const allQuestions = await prisma.examQuestion.findMany({
    where: {
      OR: [
        { title: { contains: '<' } },
        { title: { contains: '>' } },
        { explanation: { contains: '<' } },
        { explanation: { contains: '>' } },
      ],
    },
  });

  console.log(`待修复题目: ${allQuestions.length}\n`);

  let fixed = 0;
  for (const q of allQuestions) {
    const newTitle = fixText(q.title || '');
    const newExplanation = fixText(q.explanation || '');
    const hasTitleChange = newTitle !== q.title;
    const hasExplChange = newExplanation !== q.explanation;

    if (hasTitleChange || hasExplChange) {
      await prisma.examQuestion.update({
        where: { id: q.id },
        data: {
          ...(hasTitleChange ? { title: newTitle } : {}),
          ...(hasExplChange ? { explanation: newExplanation } : {}),
        },
      });
      fixed++;
      if (fixed <= 5) {
        console.log(`  修复 #${q.id}:`);
        if (hasTitleChange) console.log(`    title: ${q.title?.substring(0, 80)}`);
        if (hasExplChange) console.log(`    expl:  ${q.explanation?.substring(0, 80)}`);
      }
    }
  }

  console.log(`\n✅ 已修复 ${fixed} 道题目的 < 和 >`);
  
  // 2. 修复知识点内容
  const allNodes = await prisma.knowledgeNode.findMany({
    where: {
      OR: [
        { summary: { contains: '<' } },
        { contentJson: { contains: '<' } },
      ],
    },
  });
  
  console.log(`\n待修复知识点: ${allNodes.length}`);
  let nodeFixed = 0;
  for (const node of allNodes) {
    const newSummary = fixText(node.summary || '');
    const newContent = fixText(node.contentJson || '');
    if (newSummary !== node.summary || newContent !== node.contentJson) {
      await prisma.knowledgeNode.update({
        where: { id: node.id },
        data: {
          ...(newSummary !== node.summary ? { summary: newSummary } : {}),
          ...(newContent !== node.contentJson ? { contentJson: newContent } : {}),
        },
      });
      nodeFixed++;
    }
  }
  console.log(`  已修复 ${nodeFixed} 个知识点\n`);
  
  console.log('✅ 修复完成！');
}

main()
  .catch(e => { console.error('❌ 失败:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
