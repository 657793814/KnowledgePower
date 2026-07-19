import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  // 1) MATH-02-019 完整内容
  const node = await p.knowledgeNode.findUnique({ where: { id: "MATH-02-019" } });
  console.log("=== MATH-02-019 ===");
  console.log("summary:", JSON.stringify(node?.summary));
  console.log("contentJson:", JSON.stringify(node?.contentJson));
  
  // 2) 扫描所有 knowledge_node 中裸露的数学表达式
  const all = await p.knowledgeNode.findMany({ where: { deleted: 0 } });
  
  let plainFrac = 0;  // 1/4, 2/3 等形式
  let plainSub = 0;   // S_n, a_1 等下标
  let plainSup = 0;   // x^2 等上标
  let plainSqrt = 0;  // √ 非 LaTeX
  
  for (const n of all) {
    if (!n.contentJson && !n.summary) continue;
    const s = (n.contentJson || '') + ' ' + (n.summary || '');
    
    // 去除 $...$ 内的内容
    const clean = s.replace(/\$[^$]*\$/g, '<<M>>');
    
    // 检查裸露的分数模式（如 "1/4" 在数学上下文中）
    // 找类似 a=1/4, S=2/3 这样的模式
    const fracMatches = clean.match(/(?<![a-zA-Z])\d+\/\d+(?![a-zA-Z])/g);
    if (fracMatches) {
      for (const f of fracMatches) {
        if (!f.includes('0/') && !f.includes('/0')) {
          plainFrac++;
          if (plainFrac <= 5) console.log(`frac: [${n.id}] ${f}`);
        }
      }
    }
    
    // 裸露的 S_n 样式（字母_数字）
    const subMatches = clean.match(/(?<![a-zA-Z$])[a-zA-Z]_\d+(?![a-zA-Z])/g);
    if (subMatches) {
      plainSub += subMatches.length;
    }
    
    // 裸露的 x^2 样式
    const supMatches = clean.match(/\d+\.\d+|\b[a-zA-Z]\^\d+\b/g);
    if (supMatches) {
      const filtered = supMatches.filter(x => x.includes('^'));
      plainSup += filtered.length;
    }
  }
  
  console.log("\n=== 数据层裸露统计 ===");
  console.log(`plain fractions (1/4 style): ${plainFrac}`);
  console.log(`plain subscripts (S_n style): ${plainSub}`);
  console.log(`plain superscripts (x^2 style): ${plainSup}`);
  
  await p.$disconnect();
}
main();
