/**
 * 📐 数学 — 判别式法求值域经典模型总结
 * 挂靠 domain=式, visual_type=model
 */
import { sn, sr, modelContent } from '../helpers.js';
// Example 类型已在 helpers.js 中定义，无需额外导入

export async function seedDiscriminantRangeModel() {
  console.log('  → 判别式法求值域模型（1个）');

  // ===================================================================
  // MATH-02-020 判别式法求值域
  // ===================================================================
  await sn('MATH-02-020', '判别式法求值域模型', '将分式函数化为二次方程用 Δ≥0 求值域', 'math', '式', '高中', 4, 220, 'model',
    '将函数 y=f(x) 化为关于 x 的二次方程，利用 Δ≥0 求 y 的取值范围',
    modelContent({
      definition: '判别式法是求分式型函数值域的重要方法。将 y=f(x) 去分母整理成关于 x 的一元二次方程 Ay²+Bx+C=0 的形式，利用方程有实根的条件 Δ≥0 求出 y 的范围。注意：①二次项系数可能为 y 的函数，需讨论是否为 0；②Δ≥0 是必要条件，需验证边界值能否取到。',
      recognition: [
        '函数形式为 y=(ax²+bx+c)/(dx²+ex+f)',
        '分子分母都是二次式，且分母恒正或可讨论符号',
        '求值域问题，优先考虑判别式法',
        '含根号的函数可通过换元转化为有理分式',
      ],
      principle: '将 y=(ax²+bx+c)/(dx²+ex+f) 变形为 (dy²-a)y²+(ey-b)y+(fy-c)=0。视 y 为参数，x 为变量，此方程有实根 ⇔ Δ≥0。解出 y 的范围即为值域。关键：当二次项系数为 0 时退化为一次方程，需单独讨论。',
      principleFormulas: [
        'y=\\frac{ax^2+bx+c}{dx^2+ex+f} \\Rightarrow (dy^2-a)x^2+(ey-b)x+(fy-c)=0',
        '\\Delta=(ey-b)^2-4(dy^2-a)(fy-c)\\geq 0',
        '解此关于 y 的不等式即得值域',
        '注意检验二次项系数为 0 的情况',
      ],
      standardSteps: [
        { title: '① 去分母', content: '将 y=(ax²+bx+c)/(dx²+ex+f) 两边乘分母，整理成关于 x 的二次方程' },
        { title: '② 计算判别式', content: 'Δ=(ey-b)²-4(dy²-a)(fy-c)≥0' },
        { title: '③ 解不等式', content: '将 Δ≥0 化为关于 y 的不等式，求解 y 的范围' },
        { title: '④ 检验边界', content: '验证使二次项系数为 0 的 y 值是否能取到（代入原方程看是否有实数 x）' },
        { title: '⑤ 写出值域', content: '综合以上结果写出最终值域' },
      ],
      examples: [{
        title: '例1：基础题型',
        question: '求 $y=\\frac{x^2-x+2}{x^2+x+1}$ 的值域',
        hint: '去分母整理成关于 x 的二次方程，用 Δ≥0',
        steps: [
          '$y(x^2+x+1)=x^2-x+2$',
          '$(y-1)x^2+(y+1)x+(y-2)=0$',
          '$\\Delta=(y+1)^2-4(y-1)(y-2)\\geq 0$',
          '$y^2+2y+1-4(y^2-3y+2)\\geq 0$',
          '$-3y^2+14y-7\\geq 0$',
          '$3y^2-14y+7\\leq 0$',
          '解得 $\\frac{7-2\\sqrt{7}}{3}\\leq y\\leq \\frac{7+2\\sqrt{7}}{3}$',
          '检验 y=1：$(1-1)x^2+2x-1=0$，x=1/2 有实根 ✓',
        ],
        answer: '$[\\frac{7-2\\sqrt{7}}{3},\\frac{7+2\\sqrt{7}}{3}]$',
      }, {
        title: '例2：简单分式',
        question: '求 $y=\\frac{2x+1}{x^2+1}$ 的值域',
        hint: '去分母后整理成关于 x 的二次方程',
        steps: [
          '$y(x^2+1)=2x+1$',
          '$yx^2-2x+(y-1)=0$',
          '$\\Delta=4-4y(y-1)\\geq 0$',
          '$4-4y^2+4y\\geq 0$',
          '$y^2-y-1\\leq 0$',
          '$\\frac{1-\\sqrt{5}}{2}\\leq y\\leq \\frac{1+\\sqrt{5}}{2}$',
          '检验 y=0：-2x-1=0，x=-1/2 ✓',
        ],
        answer: '$[\\frac{1-\\sqrt{5}}{2},\\frac{1+\\sqrt{5}}{2}]$',
      }, {
        title: '例3：含参情况',
        question: '求 $y=\\frac{x^2+ax+1}{x+1}$ 的值域（a 为参数）',
        hint: '去分母后是一次方程还是二次方程取决于 x+1≠0',
        steps: [
          '$y(x+1)=x^2+ax+1$',
          '$x^2+(a-y)x+(1-y)=0$',
          '$\\Delta=(a-y)^2-4(1-y)\\geq 0$',
          '$y^2+(4-2a)y+(a^2-4)\\geq 0$',
          '解此不等式得 y 的范围',
        ],
        answer: '根据 a 的值确定具体范围',
      }],
      variants: [{
        title: '变式：分母可能为 0 的情况',
        question: '求 $y=\\frac{x^2+1}{x^2-1}$ 的值域',
        steps: [
          '$y(x^2-1)=x^2+1$',
          '$(y-1)x^2-(y+1)=0$',
          '$\\Delta=0+4(y-1)(y+1)\\geq 0$',
          '$y^2-1\\geq 0$，即 y≤-1 或 y≥1',
          '但 y=1 时方程退化：0·x²-2=0，无解 ✗',
          '$\\therefore$ 值域为 $(-\\infty,-1]\\cup(1,+\\infty)$',
        ],
        answer: '$(-\\infty,-1]\\cup(1,+\\infty)$',
      }],
      commonMistakes: [
        { mistake: '忘记检验二次项系数为 0 的情况', correct: '当 y 使二次项系数为 0 时，方程退化为一次，需单独验证是否有解' },
        { mistake: 'Δ≥0 求出范围后直接写答案，不验证', correct: '必须验证边界值是否真的能取到（代入原方程看 x 是否有实数解）' },
        { mistake: '分母为零的点没有排除', correct: '定义域中使分母为 0 的 x 要排除，可能影响值域' },
      ],
      tips: [
        '💡 先判断分母是否恒正，恒正则无需考虑定义域限制',
        '💡 判别式法适合分子分母都是二次式的分式函数',
        '💡 检验环节不可省——这是判别式法的陷阱所在',
        '💡 也可用导数法验证结果',
      ],
    })
  );

  // ===================================================================
  // 关联关系
  // ===================================================================
  await sr('MATH-02-020', 'MATH-02-016', 'model_uses', 10, '判别式法依赖韦达定理的思想');
  await sr('MATH-02-020', 'MATH-03-005', 'reference', 20, '一元二次方程的判别式是核心工具');
  await sr('MATH-02-020', 'MATH-02-014', 'related', 30, '配方法与判别式法都涉及二次式的分析');

}

// 独立运行
const isMain = process.argv[1] && process.argv[1].endsWith('math-02-discriminant-range.ts');
if (isMain) {
  seedDiscriminantRangeModel()
    .then(() => { console.log('✅ 判别式法求值域模型种子完成'); process.exit(0); })
    .catch(e => { console.error('❌', e); process.exit(1); });
}
