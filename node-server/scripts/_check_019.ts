import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const n = await p.knowledgeNode.findUnique({ where: { id: "MATH-02-019" } });
  if (!n?.contentJson) return;
  const cj = JSON.parse(n.contentJson);
  for (const sec of cj.sections || []) {
    if (sec.type === 'recognition' || sec.type === 'model-principle') {
      console.log(`=== ${sec.type} ===`);
      if (sec.content) console.log("content:", sec.content.substring(0, 200));
      if (sec.items) {
        sec.items.forEach((it: any, i: number) => {
          console.log(`  item[${i}]:`, it);
        });
      }
      if (sec.formulas) {
        sec.formulas.forEach((f: string, i: number) => {
          console.log(`  formula[${i}]:`, f);
        });
      }
    }
  }
  await p.$disconnect();
}
main();
