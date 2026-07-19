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
        // Fix answer field
        if (ex.answer && !ex.answer.startsWith('$')) {
          const orig = ex.answer;
          if (orig.includes('²') || orig.includes('1/x')) {
            // Convert Unicode superscripts to LaTeX and wrap
            ex.answer = '$' + orig
              .replace(/²/g, '^2')
              .replace(/³/g, '^3')
              .replace(/⁴/g, '^4')
              .replace(/√(\d+)/g, '\\\\sqrt{$1}')
                .replace(/√\(([^)]*)\)/g, (_,c) => '\\\\sqrt{' + c + '}')
              .replace(/(\d+)\/([a-zA-Z])/g, '\\\\frac{$1}{$2}')
            + '$';
            console.log(`  FIX answer: "${orig}" -> "${ex.answer}"`);
            changed = true;
          }
        }
        // Fix steps
        if (ex.steps) {
          ex.steps = ex.steps.map((s: string) => {
            if (s.includes('²') && !s.includes('$') && s.includes('=')) {
              const ns = '$' + s
                .replace(/²/g, '^2')
                .replace(/³/g, '^3')
                .replace(/⁴/g, '^4')
                .replace(/·/g, ' \\\\cdot ')
                .replace(/(\d+)\/([a-zA-Z0-9])/g, '\\\\frac{$1}{$2}')
              + '$';
              console.log(`  FIX step: "${s.substring(0,30)}..." -> "${ns.substring(0,40)}..."`);
              changed = true;
              return ns;
            }
            return s;
          });
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
