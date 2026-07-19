/**
 * 📐 数学 — 整体代入与对称式经典模型总结
 * 挂靠 domain=式, visual_type=model
 */
import { sn, sr, modelContent } from '../helpers.js';
import type { Example } from '../helpers.js';

export async function seedSymmetricExpressionsModel() {
  console.log('  → 整体代入与对称式模型（1个）');

  // ===================================================================
  // MATH-02-019 整体代入与对称式
  // ===================================================================
  await sn('MATH-02-019', '整体代入与对称式模型', '已知基本对称式求高次对称式的值', 'math', '式', '初中', 4, 219, 'model',
    '利用降次和整体代换技巧，由 x+y 和 xy 求高次对称式的值',
    modelContent({
      definition: '对称式是指将式中任意两个字母互换，结果不变的代数式。二元基本对称式为 $s=x+y$ 和 $p=xy$。任何二元对称式都可以用 $s$ 和 $p$ 表示。核心技巧是降次公式和整体代换，避免直接展开计算。',
      recognition: [
        '题目给出 $x+y$ 和 $xy$ 的值，要求 $x^2+y^2$、$x^3+y^3$ 等高次式',
        '出现 $x+\\frac{1}{x}$ 的形式，考虑平方/立方构造',
        '轮换对称式，尝试用基本对称式表示',
        '已知两数和与积，可逆用韦达定理构造二次方程',
      ],
      principle: '基本对称式 $s=x+y$, $p=xy$。通过乘法公式和代数变形，可将高次对称式用 $s,p$ 表示。关键公式：$x^2+y^2=s^2-2p$，$x^3+y^3=s(s^2-3p)$，$x^4+y^4=s^4-4s^2p+2p^2$。对于形如 $x+\\frac{1}{x}$ 的式子，平方可得 $x^2+\\frac{1}{x^2}$，再平方可得 $x^4+\\frac{1}{x^4}$。',
      principleFormulas: [
        '$x^2+y^2=(x+y)^2-2xy=s^2-2p$',
        '$x^3+y^3=(x+y)(x^2-xy+y^2)=s(s^2-3p)$',
        '$x^4+y^4=(x^2+y^2)^2-2x^2y^2=(s^2-2p)^2-2p^2$',
        '$x^n+y^n$ 可用递推：$S_n=s\\cdot S_{n-1}-p\\cdot S_{n-2}$',
        '若 $x+\\frac{1}{x} = k$，则 $x^2+\\frac{1}{x^2}=k^2-2$',
      ],
      standardSteps: [
        { title: '① 识别对称式结构', content: '判断是基本对称式还是轮换对称式，确定已知条件和目标' },
        { title: '② 选择公式', content: '根据次数选择降次公式：二次用 s²-2p，三次用 s(s²-3p)' },
        { title: '③ 整体代入', content: '将已知的 s,p 值代入公式，避免逐个求 x,y' },
        { title: '④ 化简计算', content: '按运算顺序计算，注意符号和括号' },
        { title: '⑤ 验证（可选）', content: '用韦达定理构造方程，求出 x,y 验证结果' },
      ],
      examples: [{
        title: '例1：基础二次对称式',
        question: '已知 $x+y=5$，$xy=6$，求 $x^2+y^2$ 和 $x^3+y^3$',
        hint: '用降次公式直接代入',
        steps: [
          '$x^2+y^2=(x+y)^2-2xy=5^2-2\\cdot 6=25-12=13$',
          '$x^3+y^3=(x+y)((x+y)^2-3xy)=5(25-18)=5\\cdot 7=35$',
        ],
        answer: 'x²+y²=13，x³+y³=35',
      }, {
        title: '例2：倒数型对称式',
        question: '已知 $x+\\frac{1}{x}=3$，求 $x^2+\\frac{1}{x^2}$ 和 $x^4+\\frac{1}{x^4}$',
        hint: '先平方得 x²+1/x²，再平方得 x⁴+1/x⁴',
        steps: [
          '$x^2+\\frac{1}{x^2}=(x+\\frac{1}{x})^2-2=3^2-2=7$',
          '$x^4+\\frac{1}{x^4}=(x^2+\\frac{1}{x^2})^2-2=7^2-2=47$',
        ],
        answer: 'x²+1/x²=7，x⁴+1/x⁴=47',
      }, {
        title: '例3：含根号的对称式',
        question: '已知 $a+b=\\sqrt{2}$，$ab=-1$，求 $a^3+b^3$',
        hint: '直接用三次降次公式',
        steps: [
          '$a^3+b^3=(a+b)((a+b)^2-3ab)$',
          '$=(\\sqrt{2})(2-3(-1))=\\sqrt{2}\\cdot 5=5\\sqrt{2}$',
        ],
        answer: '$5\\sqrt{2}$',
      }, {
        title: '例4：韦达定理逆用',
        question: '已知两数之和为 5，之积为 6，求这两数',
        hint: '构造一元二次方程',
        steps: [
          '设两数为 x,y，则 x+y=5，xy=6',
          '构造方程：t²-5t+6=0',
          '(t-2)(t-3)=0',
          't=2 或 t=3',
        ],
        answer: '这两个数是 2 和 3',
      }],
      variants: [{
        title: '变式：递推法求高次',
        question: '已知 $x+\\frac{1}{x}=\\sqrt{3}$，求 $x^6+\\frac{1}{x^6}$',
        steps: [
          '$x^2+\\frac{1}{x^2}=3-2=1$',
          '$x^4+\\frac{1}{x^4}=1^2-2=-1$',
          '$x^6+\\frac{1}{x^6}=(x^2)^3+(\\frac{1}{x^2})^3$',
          '用三次公式：$1(1-3)=-2$，或用 $(x^2+\\frac{1}{x^2})(x^4-1+\\frac{1}{x^4})=1(-1-1)=-2$',
        ],
        answer: '-2',
      }],
      commonMistakes: [
        { mistake: '记错降次公式', correct: '牢记：二次用 s²-2p，三次用 s(s²-3p)，四用 (s²-2p)²-2p²' },
        { mistake: '倒数型忘了减 2', correct: 'x²+1/x²=(x+1/x)²-2，不要漏掉 -2' },
        { mistake: '含根号时计算出错', correct: '先算括号内的，再乘以外面的系数，注意 √2·5=5√2' },
      ],
      tips: [
        '💡 能整体代入就别逐个求解，节省时间',
        '💡 递推公式 $S_n = s \cdot S_{n-1} - p \cdot S_{n-2}$ 可求任意次',
        '💡 倒数型问题反复平方是常用套路',
        '💡 韦达定理逆用是"知和积求两数"的标准方法',
      ],
    })
  );

  // ===================================================================
  // 关联关系
  // ===================================================================
  await sr('MATH-02-019', 'MATH-02-016', 'model_uses', 10, '对称式依赖韦达定理');
  await sr('MATH-02-019', 'MATH-02-005', 'reference', 20, '乘法公式是对称式的基础');
  await sr('MATH-02-019', 'MATH-03-005', 'related', 30, '韦达定理逆用连接式和方程');

}

// 独立运行
const isMain = process.argv[1] && process.argv[1].endsWith('math-02-symmetric-expressions.ts');
if (isMain) {
  seedSymmetricExpressionsModel()
    .then(() => { console.log('✅ 整体代入与对称式模型种子完成'); process.exit(0); })
    .catch(e => { console.error('❌', e); process.exit(1); });
}
