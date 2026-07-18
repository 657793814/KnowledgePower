/**
 * 📐 数学 — 双曲线/对勾函数性质经典模型总结
 * 挂靠 domain=方程与不等式, visual_type=model
 */
import { sn, sr, modelContent } from '../helpers.js';
import type { Example } from '../helpers.js';

export async function seedHyperbolaFunctionModel() {
  console.log('  → 对勾函数模型（1个）');

  // ===================================================================
  // MATH-03-019 双曲线/对勾函数性质
  // ===================================================================
  await sn('MATH-03-019', '双曲线/对勾函数性质模型', 'f(x)=ax+b/x 的图像、单调区间与最值', 'math', '函数', '初中', 3, 319, 'model',
    '形如 f(x)=ax+b/x (a,b>0) 的函数图像性质和最值问题，又称"对勾函数"或"耐克函数"',
    modelContent({
      definition: '对勾函数 f(x)=ax+b/x（a,b>0,x≠0）的图像呈双曲线形状，过一三象限，有两条渐近线（x=0 和 y=ax）。在 x>0 时，最小值在 x=√(b/a) 处取到，最小值为 2√(ab)。在 x<0 时，最大值在 x=-√(b/a) 处取到，最大值为 -2√(ab)。该函数连接了基本不等式和反比例函数的核心思想。',
      recognition: [
        '函数形式为 f(x)=ax+b/x 或 f(x)=x+a/x',
        '求最值问题时，优先考虑基本不等式或对勾函数性质',
        '含绝对值的变式 f(x)=x+a/|x|',
        '定义域受限时的最值（闭区间上）',
      ],
      principle: '对勾函数 f(x)=ax+b/x（a,b>0）：定义域 x≠0。f\'(x)=a-b/x²=(ax²-b)/x²。令 f\'(x)=0 得 x=±√(b/a)。x>0 时，(0,√(b/a)) 递减，(√(b/a),+∞) 递增，最小值 2√(ab)。x<0 时，(-√(b/a),0) 递增，(-∞,-√(b/a)) 递减，最大值 -2√(ab)。',
      principleFormulas: [
        'f(x)=ax+\\frac{b}{x}（a,b>0），f\'(x)=a-\\frac{b}{x^2}',
        'x>0 时最小值：f(\\sqrt{\\frac{b}{a}})=2\\sqrt{ab}',
        'x<0 时最大值：f(-\\sqrt{\\frac{b}{a}})=-2\\sqrt{ab}',
        '基本不等式：ax+\\frac{b}{x}\\geq 2\\sqrt{ab}（x>0,a,b>0）',
        '变式：f(x)=x+\\frac{a}{|x|} 的图像关于 y 轴对称部分',
      ],
      standardSteps: [
        { title: '① 确定参数符号', content: '确认 a,b 的正负，决定图像形状和单调性' },
        { title: '② 求导找临界点', content: 'f\'(x)=0 的解 x=±√(b/a) 是极值点' },
        { title: '③ 分析单调区间', content: 'x>0 和 x<0 分别讨论递增递减区间' },
        { title: '④ 求最值', content: '极值点代入得最值；闭区间上还需比较端点值' },
        { title: '⑤ 注意定义域', content: 'x≠0，且题目可能限制 x 的范围' },
      ],
      examples: [{
        title: '例1：基础最值',
        question: '求 $f(x)=x+\\frac{4}{x}$ 在 $x>0$ 时的最小值',
        hint: '直接用基本不等式或对勾函数性质',
        steps: [
          '$a=1,b=4$，$\\sqrt{b/a}=2$',
          'x>0 时最小值在 x=2 处取到',
          '$f(2)=2+4/2=4$',
          '或用基本不等式：$x+4/x\\geq 2\\sqrt{x\\cdot 4/x}=4$',
        ],
        answer: '最小值：4（当 x=2 时取到）',
      }, {
        title: '例2：含绝对值的变式',
        question: '求 $f(x)=x+\\frac{1}{|x|}$ 的单调区间',
        hint: '分 x>0 和 x<0 两种情况讨论',
        steps: [
          'x>0：f(x)=x+1/x，f\'(x)=1-1/x²',
          'x>1 时 f\'(x)>0（递增），0<x<1 时 f\'(x)<0（递减）',
          'x<0：f(x)=x-1/x，f\'(x)=1+1/x²>0（恒递增）',
        ],
        answer: 'x∈(0,1)递减，x∈(1,+∞)递增，x∈(-∞,0)递增',
      }, {
        title: '例3：闭区间上的最值',
        question: '求 $f(x)=2x+\\frac{8}{x}$ 在 [1,4] 上的最值',
        hint: '先找极值点是否在区间内，再比较端点',
        steps: [
          '$a=2,b=8$，$\\sqrt{b/a}=\\sqrt{4}=2$，在 [1,4] 内',
          'f(2)=4+4=8（极小值）',
          'f(1)=2+8=10',
          'f(4)=8+2=10',
          '最大值 10，最小值 8',
        ],
        answer: '最大值：10（x=1或4），最小值：8（x=2）',
      }, {
        title: '例4：参数讨论',
        question: '已知 $f(x)=ax+\\frac{1}{x}$ 在 [1,+∞) 上最小值为 2，求 a',
        hint: '极值点 √(1/a) 可能在 [1,+∞) 内也可能不在',
        steps: [
          '$\\sqrt{1/a}$ 在 [1,+∞) 内 ⇔ 1/a≥1 ⇔ 0<a≤1',
          '若 0<a≤1：最小值 f(√(1/a))=2√a=2，得 a=1',
          '若 a>1：极值点在 [0,1) 内，[1,+∞) 上 f\'(x)>0 递增',
          '最小值 f(1)=a+1=2，得 a=1 ✓',
        ],
        answer: 'a=1',
      }],
      variants: [{
        title: '变式：f(x)=ax+b/|x| 的图像',
        question: '画出 $f(x)=x+\\frac{2}{|x|}$ 的草图并求最小值',
        steps: [
          'x>0：f(x)=x+2/x，最小值 2√2（x=√2）',
          'x<0：f(x)=x-2/x，f\'(x)=1+2/x²>0（递增）',
          'x→-∞ 时 f(x)→-∞，无最小值',
          'x>0 时最小值为 2√2',
        ],
        answer: 'x>0 时最小值 2√2；x<0 时无下界',
      }],
      commonMistakes: [
        { mistake: '忘记 x≠0 的定义域限制', correct: '对勾函数在 x=0 处无定义，图像分为两支' },
        { mistake: '闭区间最值只算极值点', correct: '闭区间上最值要比较极值点和端点的函数值' },
        { mistake: 'a,b 异号时还套用公式', correct: 'a,b 同号才有对勾函数性质；异号时单调性完全不同' },
      ],
      tips: [
        '💡 记住口诀："右勾左双，最小在根号下"',
        '💡 闭区间最值三步：极值点→端点→比较',
        '💡 含绝对值变式要分段讨论',
        '💡 基本不等式和对勾函数本质相同，选更顺手的用',
      ],
    })
  );

  // ===================================================================
  // 关联关系
  // ===================================================================
  await sr('MATH-03-019', 'MATH-03-013', 'model_uses', 10, '对勾函数最值依赖基本不等式');
  await sr('MATH-03-019', 'MATH-04-018', 'reference', 20, '一次与反比例综合是对勾函数的基础');
  await sr('MATH-03-019', 'MATH-04-020', 'related', 30, '图像变换帮助理解对勾函数的变形');

}

// 独立运行
const isMain = process.argv[1] && process.argv[1].endsWith('math-03-hyperbola-function.ts');
if (isMain) {
  seedHyperbolaFunctionModel()
    .then(() => { console.log('✅ 对勾函数模型种子完成'); process.exit(0); })
    .catch(e => { console.error('❌', e); process.exit(1); });
}
