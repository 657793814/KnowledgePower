/**
 * 📐 数学 — 构造函数法解题经典模型总结
 * 挂靠 domain=函数, visual_type=model
 */
import { sn, sr, modelContent } from '../helpers.js';
import type { Example } from '../helpers.js';

export async function seedConstructFunctionModel() {
  console.log('  → 构造函数法解题模型（1个）');

  // ===================================================================
  // MATH-04-022 构造函数法解题
  // ===================================================================
  await sn('MATH-04-022', '构造函数法解题模型', '通过构造辅助函数证明不等式和研究函数性质', 'math', '函数', '高中', 5, 422, 'model',
    '构造辅助函数是解决不等式证明、单调性研究、最值问题的核心方法',
    modelContent({
      definition: '构造函数法是通过构造一个合适的辅助函数，利用函数的性质（单调性、极值、凹凸性等）来解决问题。常见类型：直接构造（移项差函数）、同构变形（两边化成相同结构）、取对数构造、换元构造。这是高中数学和竞赛中最常用的思想方法之一。',
      recognition: [
        '要证明不等式 f(x)>g(x)，考虑构造 h(x)=f(x)-g(x)',
        '方程两边结构相似，考虑同构变形',
        '含指数和对数的混合不等式，考虑取对数',
        '复杂表达式可通过换元简化结构',
      ],
      principle: '核心思想：将问题转化为研究某个函数的性质。常用构造函数模板：e^x-x（最小值1）、ln x-x+1（最大值0）、x/e^x（最大值1/e）、sin x/x（在(0,π)递减）。关键步骤：构造→求导→定单调→找极值→得出结论。',
      principleFormulas: [
        'e^x\\geq x+1（等号当x=0时取到）',
        '\\ln x\\leq x-1（等号当x=1时取到）',
        'x>e^{x-1}（x>0时）',
        '\\frac{\\ln x}{x}\\leq \\frac{1}{e}',
      ],
      standardSteps: [
        { title: '① 分析结构', content: '观察待证不等式或待解方程的结构特点，确定构造方向' },
        { title: '② 选择构造方式', content: '直接构造差函数 / 同构变形 / 取对数 / 换元' },
        { title: '③ 求导分析', content: '计算导数，确定单调区间和极值点' },
        { title: '④ 得出结论', content: '根据函数性质得出不等式成立或方程有解的结论' },
      ],
      examples: [{
        title: '例1：直接构造——经典不等式',
        question: '证明：$e^x\\geq x+1$（$x\\in\\mathbb{R}$）',
        hint: '构造 f(x)=e^x-x-1，求最小值',
        steps: [
          '设 $f(x)=e^x-x-1$',
          '$f\'(x)=e^x-1$，令 f\'(x)=0 得 x=0',
          'x<0 时 f\'(x)<0（递减），x>0 时 f\'(x)>0（递增）',
          'f(0)=e^0-0-1=0 是最小值',
          '$\\therefore f(x)\\geq 0$，即 $e^x\\geq x+1$',
        ],
        answer: '得证，当且仅当 x=0 时取等号',
      }, {
        title: '例2：同构变形',
        question: '证明：当 $x>0$ 时，$x^x>e^{x-1}$',
        hint: '两边取对数化为 x ln x > x-1',
        steps: [
          '两边取对数：$x\\ln x>x-1$',
          '构造 $f(x)=x\\ln x-x+1$',
          '$f\'(x)=\\ln x+1-1=\\ln x$',
          'x∈(0,1) 时 f\'(x)<0（递减），x>1 时 f\'(x)>0（递增）',
          'f(1)=0-1+1=0 是最小值',
          '$\\therefore f(x)\\geq 0$，即 $x\\ln x\\geq x-1$',
        ],
        answer: '得证',
      }, {
        title: '例3：取对数构造',
        question: '比较大小：$2^3$ 与 $3^2$',
        hint: '化为比较 3ln2 与 2ln3，即比较 ln2/2 与 ln3/3',
        steps: [
          '构造 $f(x)=\\frac{\\ln x}{x}$',
          '$f\'(x)=\\frac{1-\\ln x}{x^2}$',
          'x>e 时 f\'(x)<0（递减），x<e 时 f\'(x)>0（递增）',
          'f(2)=ln2/2≈0.347，f(3)=ln3/3≈0.366',
          'f(2)<f(3)，即 ln2/2<ln3/3',
          '$\\Rightarrow 3\\ln 2<2\\ln 3 \\Rightarrow 2^3<3^2$',
        ],
        answer: '$2^3<3^2$（即 8<9）',
      }],
      variants: [{
        title: '变式：含参不等式恒成立',
        question: '若 $e^x-ax\\geq 0$ 对一切 x≥0 恒成立，求 a 的范围',
        steps: [
          '分离参数：$a\\leq\\frac{e^x}{x}$（x>0）',
          '构造 $f(x)=\\frac{e^x}{x}$',
          '$f\'(x)=\\frac{xe^x-e^x}{x^2}=\\frac{e^x(x-1)}{x^2}$',
          'x=1 时 f(x) 取最小值 e',
          '$a\\leq e$',
        ],
        answer: '$(-\\infty,e]$',
      }],
      commonMistakes: [
        { mistake: '构造函数后不会求导或求错导', correct: '熟练基本求导公式：(e^x)\'=e^x,(ln x)\'=1/x,(x^n)\'=nx^(n-1)' },
        { mistake: '忽略定义域', correct: '构造函数后要确认定义域，如 ln x 要求 x>0' },
        { mistake: '同构变形找不到共同结构', correct: '多练习常见同构形式：xe^x、e^x/x、ln x/x 等' },
      ],
      tips: [
        '💡 记住几个经典构造函数：e^x-x、ln x/x、x/e^x',
        '💡 同构变形的关键是找到"相同的外壳"',
        '💡 含参问题优先考虑分离参数再构造',
        '💡 取对数是处理幂指函数的万能钥匙',
      ],
    })
  );

  // ===================================================================
  // 关联关系
  // ===================================================================
  await sr('MATH-04-022', 'MATH-07-017', 'model_uses', 10, '构造函数依赖导数工具');
  await sr('MATH-04-022', 'MATH-07-018', 'reference', 20, '导数构造函数技巧是直接相关模型');
  await sr('MATH-04-022', 'MATH-03-015', 'related', 30, '不等式证明是构造函数法的主要应用场景');

}

// 独立运行
const isMain = process.argv[1] && process.argv[1].endsWith('math-04-construct-function.ts');
if (isMain) {
  seedConstructFunctionModel()
    .then(() => { console.log('✅ 构造函数法解题模型种子完成'); process.exit(0); })
    .catch(e => { console.error('❌', e); process.exit(1); });
}
