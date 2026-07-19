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
import { seedModelQuestions } from './model-questions.js';
import { seedModelQuestionsMath } from './model-questions-math.js';
import { seedModelQuestionsChemistry } from './model-questions-chemistry.js';
import { seedModelQuestionsPhysics } from './model-questions-physics.js';

// 数学
import { seedNumberDomain } from './domains/math-01-number.js';
import { seedAlgebraDomain } from './domains/math-02-algebra.js';
import { seedEquationDomain } from './domains/math-03-equation.js';
import { seedFunctionDomain } from './domains/math-04-function.js';
import { seedGeometryDomain } from './domains/math-05-geometry.js';
import { seedCombinatoricsDomain } from './domains/math-06-combinatorics.js';
import { seedSequenceDomain } from './domains/math-07-sequence.js';
import { seedSetDomain } from './domains/math-09-set.js';
import { seedGeometryModels } from './domains/math-geometry-models.js';
import { seedFunctionModels } from './domains/math-function-models.js';
import { seedAlgebraModels } from './domains/math-algebra-models.js';
import { seedEquationModels } from './domains/math-equation-models.js';
import { seedSequenceModels } from './domains/math-sequence-models.js';
import { seedCombinatoricsModels } from './domains/math-combinatorics-models.js';
import { seedNumberModels } from './domains/math-number-models.js';
import { seedDomainSummaries } from './domains/math-domain-summaries.js';
import { seedFunctionSupplement } from './domains/math-04-function-supplement.js';

// ===== 新增数学模型（穿针引线、多项式除法、绝对值最值等）=====
import { seedCrossingThreadingModel } from './domains/math-03-crossing-threading.js';
import { seedPolynomialDivisionModel } from './domains/math-02-polynomial-division.js';
import { seedAbsoluteValueMaxminModel } from './domains/math-03-absolute-value-maxmin.js';
import { seedParameterInequalityModel } from './domains/math-03-parameter-inequality.js';
import { seedSymmetricExpressionsModel } from './domains/math-02-symmetric-expressions.js';
import { seedEquationRootsCountModel } from './domains/math-04-equation-roots-count.js';
import { seedDiscriminantRangeModel } from './domains/math-02-discriminant-range.js';
import { seedConstructFunctionModel } from './domains/math-04-construct-function.js';
import { seedHyperbolaFunctionModel } from './domains/math-03-hyperbola-function.js';
import { seedMainVariableModel } from './domains/math-02-main-variable.js';

// 物理模型
import { seedPhysicsMechanicsModels } from './domains/physics-mechanics-models.js';
import { seedPhysicsOtherModels } from './domains/physics-other-models.js';

// 化学模型 + 新领域
import { seedChemistryModels } from './domains/chemistry-models.js';

// 生物模型
import { seedBioModels } from './domains/bio-models.js';

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
import { seedEnglishVocabularyDomain } from './domains/eng-02-vocabulary.js';
import { seedEnglishTenseDomain } from './domains/eng-03-tense.js';
import { seedEnglishSyntaxDomain } from './domains/eng-04-syntax.js';
import { seedEnglishReadingDomain } from './domains/eng-05-reading.js';
import { seedEnglishWritingDomain } from './domains/eng-06-writing.js';

// 历史
import { seedChineseHistoryDomain } from './domains/history-01-china.js';
import { seedModernChinaHistoryDomain } from './domains/history-02-modern-china.js';
import { seedWorldAncientHistoryDomain } from './domains/history-03-world-ancient.js';
import { seedWorldModernHistoryDomain } from './domains/history-04-world-modern.js';

// 政治
import { seedPoliticsDomain } from './domains/politics-01-fundamentals.js';
import { seedPoliticsExpansion } from './domains/politics-02-expansion.js';

// 地理
import { seedGeographyDomain } from './domains/geography-01-fundamentals.js';
import { seedRegionalGeographyDomain } from './domains/geo-02-regional.js';
import { seedMappingGeographyDomain } from './domains/geo-03-mapping.js';
import { seedSustainabilityGeographyDomain } from './domains/geo-04-sustainability.js';

// 计算机
import { seedCSBasicsDomain } from './domains/cs-01-basics.js';
import { seedCSProgrammingDomain } from './domains/cs-02-programming.js';
import { seedCSDataStructureDomain } from './domains/cs-03-data-structure.js';
import { seedCSAlgorithmDomain } from './domains/cs-04-algorithm.js';
import { seedCSNetworkDomain } from './domains/cs-05-network.js';
import { seedCSDatabaseDomain } from './domains/cs-06-database.js';
import { seedCSOSDomain } from './domains/cs-07-os.js';

async function main() {
  console.log('========================================');
  console.log('  KnowledgePower 种子数据初始化');
  console.log('========================================\n');

  // sn/sr 已使用 upsert 模式，可幂等运行
  const beforeCount = await prisma.knowledgeNode.count();
  console.log(`当前知识点数: ${beforeCount}，开始增量种子数据...`);

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

  // ===== 集合 =====
  await seedSetDomain();

  // ===== 数的世界模型（24点、巧算等） =====
  console.log('\n📐 数的世界模型\n' + '='.repeat(20));
  await seedNumberModels();

  // ===== 几何模型 =====
  console.log('\n📐 几何模型\n' + '='.repeat(20));
  await seedGeometryModels();

  // ===== 函数模型 =====
  console.log('\n📐 函数模型\n' + '='.repeat(20));
  await seedFunctionModels();

  // ===== 代数模型 =====
  console.log('\n📐 代数模型\n' + '='.repeat(20));
  await seedAlgebraModels();

  // ===== 方程模型 =====
  console.log('\n📐 方程模型\n' + '='.repeat(20));
  await seedEquationModels();

  // ===== 数列模型 =====
  console.log('\n📐 数列模型\n' + '='.repeat(20));
  await seedSequenceModels();

  // ===== 排列组合模型 =====
  console.log('\n📐 排列组合模型\n' + '='.repeat(20));
  await seedCombinatoricsModels();

  // ===== 新增数学模型（穿针引线、多项式除法、绝对值最值等）=====
  console.log('\n📐 新增数学模型（11个）\n' + '='.repeat(20));
  await seedCrossingThreadingModel();       // MATH-03-016 穿针引线法
  await seedPolynomialDivisionModel();      // MATH-02-018 多项式除法
  await seedAbsoluteValueMaxminModel();     // MATH-03-017 绝对值最值
  await seedParameterInequalityModel();     // MATH-03-018 含参不等式
  await seedSymmetricExpressionsModel();    // MATH-02-019 整体代入与对称式
  await seedEquationRootsCountModel();      // MATH-04-021 方程根的个数
  await seedDiscriminantRangeModel();       // MATH-02-020 判别式法求值域
  await seedConstructFunctionModel();       // MATH-04-022 构造函数法
  await seedHyperbolaFunctionModel();       // MATH-03-019 对勾函数
  await seedMainVariableModel();            // MATH-02-021 主元法

  // ===== 物理模型 =====
  console.log('\n⚡ 物理模型\n' + '='.repeat(20));
  await seedPhysicsMechanicsModels();
  await seedPhysicsOtherModels();

  // ===== 化学模型 =====
  console.log('\n🧪 化学模型\n' + '='.repeat(20));
  await seedChemistryModels();

  // ===== 生物模型 =====
  console.log('\n🧬 生物模型\n' + '='.repeat(20));
  await seedBioModels();

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
  await seedEnglishVocabularyDomain();
  await seedEnglishTenseDomain();
  await seedEnglishSyntaxDomain();
  await seedEnglishReadingDomain();
  await seedEnglishWritingDomain();

  // ===== 历史 =====
  console.log('\n📜 历史\n' + '='.repeat(20));
  await seedChineseHistoryDomain();
  await seedModernChinaHistoryDomain();
  await seedWorldAncientHistoryDomain();
  await seedWorldModernHistoryDomain();

  // ===== 政治 =====
  console.log('\n🏛️ 政治\n' + '='.repeat(20));
  await seedPoliticsDomain();
  await seedPoliticsExpansion();

  // ===== 地理 =====
  console.log('\n🌍 地理\n' + '='.repeat(20));
  await seedGeographyDomain();
  await seedRegionalGeographyDomain();
  await seedMappingGeographyDomain();
  await seedSustainabilityGeographyDomain();

  // ===== 计算机 =====
  console.log('\n💻 计算机\n' + '='.repeat(20));
  await seedCSBasicsDomain();
  await seedCSProgrammingDomain();
  await seedCSDataStructureDomain();
  await seedCSAlgorithmDomain();
  await seedCSNetworkDomain();
  await seedCSDatabaseDomain();
  await seedCSOSDomain();

  // ===== 题库 =====
  console.log('\n📝 题库\n' + '='.repeat(20));
  await seedQuestions();

  // ===== 模型专题题目 =====
  console.log('\n🏷️ 模型专题题目\n' + '='.repeat(20));
  await seedModelQuestions();

  // ===== 数学模型专题题目（38个模型，每个10+题）=====
  console.log('\n🏷️ 数学模型专题题目（38个模型）\n' + '='.repeat(20));
  await seedModelQuestionsMath();

  // ===== 化学模型专题题目 =====
  console.log('\n🧪 化学模型专题题目\n' + '='.repeat(20));
  await seedModelQuestionsChemistry();

  // ===== 物理模型专题题目 =====
  console.log('\n⚡ 物理模型专题题目\n' + '='.repeat(20));
  await seedModelQuestionsPhysics();

  // ===== 数学领域总结根结点 =====
  console.log('\n➕ 函数补充知识点\n' + '='.repeat(20));
  await seedFunctionSupplement();

  console.log('\n📋 数学领域总结根结点\n' + '='.repeat(20));
  await seedDomainSummaries();

  // ===== 统计 =====
  const nodeCount = await prisma.knowledgeNode.count();
  const relCount = await prisma.knowledgeRelation.count();
  const questionCount = await prisma.examQuestion.count();
  console.log(`\n✅ 完成！知识点: ${nodeCount}, 关系: ${relCount}, 题目: ${questionCount}`);
}

main()
  .catch(e => { console.error('❌ 初始化失败:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
