/**
 * KnowledgePower 种子数据 — 入口
 * 运行: npx tsx src/seeders/index.ts
 * 
 * 模块化架构：每个领域独立文件，导入此入口
 * 如需仅重置某个领域：npx tsx src/seeders/domains/physics-01-mechanics.ts
 */
import { prisma } from './helpers.js';
import { seedUsers } from './users.js';
import { seedQuestions } from './questions.js';

// 数学
import { seedNumberDomain } from './domains/math-01-number.js';
import { seedAlgebraDomain } from './domains/math-02-algebra.js';
import { seedEquationDomain } from './domains/math-03-equation.js';
import { seedFunctionDomain } from './domains/math-04-function.js';
import { seedGeometryDomain } from './domains/math-05-geometry.js';
import { seedCombinatoricsDomain } from './domains/math-06-combinatorics.js';
import { seedSequenceDomain } from './domains/math-07-sequence.js';

// 物理
import { seedPhysicsMechanics } from './domains/physics-01-mechanics.js';
import { seedPhysicsThermal } from './domains/physics-02-thermal.js';
import { seedPhysicsElectromagnetism } from './domains/physics-03-electromagnetism.js';
import { seedPhysicsOptics } from './domains/physics-04-optics.js';
import { seedPhysicsAcoustics } from './domains/physics-05-acoustics.js';
import { seedPhysicsModern } from './domains/physics-06-modern.js';

// 生物
import { seedBioCell } from './domains/bio-01-cell.js';
import { seedBioGenetics } from './domains/bio-02-genetics.js';
import { seedBioHumanBody } from './domains/bio-03-human-body.js';
import { seedBioPlants } from './domains/bio-04-plants.js';
import { seedBioEcology } from './domains/bio-05-ecology.js';
import { seedBioBiotech } from './domains/bio-06-biotech.js';

// 化学
import { seedChemistryStructure } from './domains/chem-01-structure.js';
import { seedChemistryReaction } from './domains/chem-02-reaction.js';
import { seedChemistryPeriodic } from './domains/chem-03-periodic.js';
import { seedChemistrySolution } from './domains/chem-04-solution.js';
import { seedChemistryOrganic } from './domains/chem-05-organic.js';
import { seedChemistryCalculation } from './domains/chem-06-calculation.js';

// 英语
import { seedEnglishGrammarDomain } from './domains/eng-01-grammar.js';

// 历史
import { seedChineseHistoryDomain } from './domains/history-01-china.js';

// 政治
import { seedPoliticsDomain } from './domains/politics-01-fundamentals.js';

// 地理
import { seedGeographyDomain } from './domains/geography-01-fundamentals.js';

async function main() {
  console.log('========================================');
  console.log('  KnowledgePower 种子数据初始化');
  console.log('========================================\n');

  // 检查是否已有数据
  const exists = await prisma.knowledgeNode.count();
  if (exists > 0) {
    console.log(`数据库已有 ${exists} 个知识点，跳过初始化。\n如需重新初始化，先清空数据库。`);
    return;
  }

  // 用户
  await seedUsers();

  // ===== 数学 =====
  console.log('\n📐 数学\n' + '='.repeat(20));
  await seedNumberDomain();
  await seedAlgebraDomain();
  await seedEquationDomain();
  await seedFunctionDomain();
  await seedGeometryDomain();
  await seedCombinatoricsDomain();
  await seedSequenceDomain();

  // ===== 物理 =====
  console.log('\n⚡ 物理\n' + '='.repeat(20));
  await seedPhysicsMechanics();
  await seedPhysicsThermal();
  await seedPhysicsElectromagnetism();
  await seedPhysicsOptics();
  await seedPhysicsAcoustics();
  await seedPhysicsModern();

  // ===== 生物 =====
  console.log('\n🧬 生物\n' + '='.repeat(20));
  await seedBioCell();
  await seedBioGenetics();
  await seedBioHumanBody();
  await seedBioPlants();
  await seedBioEcology();
  await seedBioBiotech();

  // ===== 化学 =====
  console.log('\n🧪 化学\n' + '='.repeat(20));
  await seedChemistryStructure();
  await seedChemistryReaction();
  await seedChemistryPeriodic();
  await seedChemistrySolution();
  await seedChemistryOrganic();
  await seedChemistryCalculation();

  // ===== 英语 =====
  console.log('\n🔤 英语\n' + '='.repeat(20));
  await seedEnglishGrammarDomain();

  // ===== 历史 =====
  console.log('\n📜 历史\n' + '='.repeat(20));
  await seedChineseHistoryDomain();

  // ===== 政治 =====
  console.log('\n🏛️ 政治\n' + '='.repeat(20));
  await seedPoliticsDomain();

  // ===== 地理 =====
  console.log('\n🌍 地理\n' + '='.repeat(20));
  await seedGeographyDomain();

  // ===== 题库 =====
  console.log('\n📝 题库\n' + '='.repeat(20));
  await seedQuestions();

  // ===== 统计 =====
  const nodeCount = await prisma.knowledgeNode.count();
  const relCount = await prisma.knowledgeRelation.count();
  const questionCount = await prisma.examQuestion.count();
  console.log(`\n✅ 完成！知识点: ${nodeCount}, 关系: ${relCount}, 题目: ${questionCount}`);
}

main()
  .catch(e => { console.error('❌ 初始化失败:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
