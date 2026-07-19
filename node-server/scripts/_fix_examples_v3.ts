import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const n = await p.knowledgeNode.findUnique({ where: { id: "MATH-02-019" } });
  if (!n?.contentJson) return;
  const cj = JSON.parse(n.contentJson);
  let changed = false;
  for (const sec of cj.sections || []) {
    if ((sec.type === 'example' || sec.type === 'variant') && sec.items) {
      for (const ex of sec.items) {
        // ——— 正确硬编码，不做机械替换 ———
        if (ex.title === '例1：基础二次对称式') {
          ex.answer = '$x^2+y^2=13$，$x^3+y^3=35$';
          changed = true;
        }
        if (ex.title === '例2：倒数型对称式') {
          ex.answer = '$x^2+\\frac{1}{x^2}=7$，$x^4+\\frac{1}{x^4}=47$';
          changed = true;
        }
        if (ex.title === '变式：递推法求高次') {
          ex.answer = '$-2$';
          changed = true;
        }
      }
    }
  }
  if (changed) {
    await p.knowledgeNode.update({ where: { id: "MATH-02-019" }, data: { contentJson: JSON.stringify(cj) } });
    console.log("✅ Saved");
  }
  await p.$disconnect();
}
main();
