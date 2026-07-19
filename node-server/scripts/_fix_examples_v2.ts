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
        // Fix answer — 硬编码正确的值
        if (ex.title?.includes('例1')) {
          const orig = ex.answer;
          ex.answer = '$x^2+y^2=13$，$x^3+y^3=35$';
          if (orig !== ex.answer) { console.log(`  FIX answer[${ex.title}]: ${orig}`); changed = true; }
        }
        if (ex.title?.includes('例2')) {
          const orig = ex.answer;
          ex.answer = '$x^2+\\frac{1}{x^2}=7$，$x^4+\\frac{1}{x^4}=47$';
          if (orig !== ex.answer) { console.log(`  FIX answer[${ex.title}]: ${orig}`); changed = true; }
        }
        if (ex.title?.includes('例3')) {
          // 已经正确了 $5\sqrt{2}$
        }
        if (ex.title?.includes('例4')) {
          // 纯中文，不动
        }
        // Fix steps - 只包裹有公式的
        if (ex.steps) {
          ex.steps = ex.steps.map((s: string) => {
            if (s.includes('²') || s.includes('=0') || s.includes('√')) {
              const ns = s
                .replace(/²/g, '^2')
                .replace(/³/g, '^3')
                .replace(/⁴/g, '^4')
                .replace(/·/g, ' \\cdot ')
                .replace(/(\d+)\/([a-zA-Z])\^(\d+)/g, '\\frac{$1}{$2^$3}')
                .replace(/(\d+)\/([a-zA-Z])/g, '\\frac{$1}{$2}');
              // 不是每步都能包 $...$，有中文的步不包
              if (ns.match(/^[\d\^\(\)\+\-\*xyspatv √\\.]+$/)) {
                return '$' + ns + '$';
              }
            }
            return s;
          });
        }
      }
    }
    // 修复 variant 的 answer
    if (sec.type === 'variant' && sec.items) {
      for (const v of sec.items) {
        if (v.answer === '-2') {
          v.answer = '$-2$';
          changed = true;
        }
      }
    }
  }
  if (changed) {
    await p.knowledgeNode.update({ where: { id: "MATH-02-019" }, data: { contentJson: JSON.stringify(cj) } });
    console.log("\n✅ Saved");
  }
  await p.$disconnect();
}
main();
