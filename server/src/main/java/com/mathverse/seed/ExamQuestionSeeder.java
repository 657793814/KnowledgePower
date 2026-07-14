package com.mathverse.seed;

import com.mathverse.exam.entity.ExamQuestion;
import com.mathverse.exam.mapper.ExamQuestionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 题库种子数据 — 每个知识点 2-3 道题
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ExamQuestionSeeder {

    private final ExamQuestionMapper questionMapper;

    public void seed() {
        if (questionMapper.selectCount(null) > 0) {
            log.info("题库已有数据，跳过初始化");
            return;
        }

        List<ExamQuestion> questions = new ArrayList<>();

        // ═══ 数的世界 ═══
        questions.add(q("MATH-01-001", "数", "初中", "choice", 1,
                "下列哪个数是质数？",
                "{\"A\":\"4\",\"B\":\"6\",\"C\":\"7\",\"D\":\"9\"}",
                "C", "7 只有 1 和 7 两个因数，是质数。4、6、9 都是合数。"));
        questions.add(q("MATH-01-002", "数", "初中", "choice", 1,
                "$-5$ 的相反数是？",
                "{\"A\":\"5\",\"B\":\"-5\",\"C\":\"0\",\"D\":\"1/5\"}",
                "A", "相反数的定义：a 和 -a 互为相反数，-5 的相反数是 5。"));
        questions.add(q("MATH-01-004", "数", "初中", "choice", 2,
                "$\\\\sqrt{16}$ 的值是？",
                "{\"A\":\"4\",\"B\":\"±4\",\"C\":\"8\",\"D\":\"-4\"}",
                "A", "$\\\\sqrt{16}$ 表示 16 的算术平方根，即正的平方根，结果为 4。"));
        questions.add(q("MATH-01-005-01", "数", "高中", "choice", 3,
                "$i^2$ 等于多少？",
                "{\"A\":\"1\",\"B\":\"-1\",\"C\":\"i\",\"D\":\"-i\"}",
                "B", "虚数单位 i 的定义：$i^2=-1$。"));

        // ═══ 式 ═══
        questions.add(q("MATH-02-001", "式", "初中", "choice", 1,
                "化简 $3a+2a$ 的结果是？",
                "{\"A\":\"5a\",\"B\":\"6a\",\"C\":\"5a^2\",\"D\":\"6a^2\"}",
                "A", "合并同类项：$3a+2a=(3+2)a=5a$。"));
        questions.add(q("MATH-02-002", "式", "初中", "choice", 2,
                "$(x+3)(x-3)$ 展开后等于？",
                "{\"A\":\"x^2+9\",\"B\":\"x^2-9\",\"C\":\"x^2-6x+9\",\"D\":\"x^2+6x+9\"}",
                "B", "平方差公式：$(a+b)(a-b)=a^2-b^2$，所以 $(x+3)(x-3)=x^2-9$。"));
        questions.add(q("MATH-02-003", "式", "初中", "choice", 2,
                "多项式 $x^2-5x+6$ 因式分解为？",
                "{\"A\":\"(x+2)(x+3)\",\"B\":\"(x-2)(x-3)\",\"C\":\"(x+2)(x-3)\",\"D\":\"(x-2)(x+3)\"}",
                "B", "十字相乘：$x^2-5x+6=(x-2)(x-3)$。"));
        questions.add(q("MATH-02-007", "式", "高中", "fill", 3,
                "$\\\\log_2 8 = \\\\_\\\\_\\\\_$", null, "3", "$2^3=8$，所以 $\\\\log_2 8=3$。"));

        // ═══ 方程与不等式 ═══
        questions.add(q("MATH-03-001", "方程与不等式", "初中", "choice", 1,
                "解方程 $2x+3=11$，$x$ 等于？",
                "{\"A\":\"3\",\"B\":\"4\",\"C\":\"5\",\"D\":\"6\"}",
                "B", "$2x+3=11$ → $2x=8$ → $x=4$。"));
        questions.add(q("MATH-03-002", "方程与不等式", "初中", "choice", 2,
                "方程 $x^2-4=0$ 的解是？",
                "{\"A\":\"x=2\",\"B\":\"x=-2\",\"C\":\"x=±2\",\"D\":\"无解\"}",
                "C", "$x^2-4=0$ → $x^2=4$ → $x=\\\\pm2$。"));
        questions.add(q("MATH-03-005", "方程与不等式", "初中", "choice", 2,
                "不等式 $-2x>6$ 的解集是？",
                "{\"A\":\"x>-3\",\"B\":\"x<-3\",\"C\":\"x>3\",\"D\":\"x<3\"}",
                "B", "两边同除以 -2（注意变号！）：$x<-3$。"));
        questions.add(q("MATH-03-004", "方程与不等式", "初中", "fill", 2,
                "方程组 $\\\\begin{cases}x+y=5\\\\\\\\x-y=1\\\\end{cases}$ 的解是 $x=\\\\_\\\\_\\\\_, y=\\\\_\\\\_\\\\_$",
                null, "x=3,y=2", "两式相加得 $2x=6$ → $x=3$，代入得 $y=2$。"));

        // ═══ 函数 ═══
        questions.add(q("MATH-04-002", "函数", "初中", "choice", 2,
                "一次函数 $y=2x+3$ 与 $y$ 轴的交点坐标是？",
                "{\"A\":\"(0,3)\",\"B\":\"(3,0)\",\"C\":\"(0,-3)\",\"D\":\"(-1.5,0)\"}",
                "A", "令 $x=0$，$y=2\\\\times0+3=3$，所以交点为 $(0,3)$。"));
        questions.add(q("MATH-04-004", "函数", "初中", "choice", 3,
                "二次函数 $y=x^2-4x+3$ 的对称轴是？",
                "{\"A\":\"x=1\",\"B\":\"x=2\",\"C\":\"x=3\",\"D\":\"x=-2\"}",
                "B", "对称轴公式 $x=-\\\\frac{b}{2a}=-\\\\frac{-4}{2}=2$。"));
        questions.add(q("MATH-04-008", "函数", "高中", "fill", 3,
                "$\\\\sin 30^\\\\circ = \\\\_\\\\_\\\\_$", null, "1/2",
                "特殊角的三角函数值：$\\\\sin30^\\\\circ=\\\\frac{1}{2}$。"));

        // ═══ 几何 ═══
        questions.add(q("MATH-05-002", "几何", "初中", "choice", 1,
                "三角形内角和是？",
                "{\"A\":\"90^\\\\circ\",\"B\":\"180^\\\\circ\",\"C\":\"270^\\\\circ\",\"D\":\"360^\\\\circ\"}",
                "B", "任何三角形的内角和都是 $180^\\\\circ$。"));
        questions.add(q("MATH-05-005", "几何", "初中", "choice", 2,
                "直角三角形的两直角边分别为 3 和 4，斜边是？",
                "{\"A\":\"5\",\"B\":\"6\",\"C\":\"7\",\"D\":\"25\"}",
                "A", "勾股定理：$c^2=3^2+4^2=9+16=25$，$c=5$。"));
        questions.add(q("MATH-05-007", "几何", "初中", "fill", 2,
                "半径为 3 的圆，面积是 $\\\\_\\\\_\\\\_\\\\pi$", null, "9",
                "圆的面积公式 $S=\\\\pi r^2$，$r=3$ → $S=9\\\\pi$。答案填 9。"));

        // ═══ 排列组合与统计 ═══
        questions.add(q("MATH-06-001", "排列组合与统计", "高中", "choice", 2,
                "从 A 地到 B 地有 3 条路，从 B 到 C 有 4 条路，从 A 经 B 到 C 共有几条路？",
                "{\"A\":\"7\",\"B\":\"12\",\"C\":\"3\",\"D\":\"4\"}",
                "B", "分步乘法计数原理：$3\\\\times4=12$。"));
        questions.add(q("MATH-06-003", "排列组合与统计", "高中", "choice", 3,
                "$C_5^3$ 的值是？",
                "{\"A\":\"10\",\"B\":\"20\",\"C\":\"60\",\"D\":\"5\"}",
                "A", "$C_5^3=\\\\frac{5!}{3!2!}=\\\\frac{5\\\\times4}{2}=10$。"));

        // ═══ 数列与导数 ═══
        questions.add(q("MATH-07-002", "数列与导数", "高中", "choice", 2,
                "等差数列 $1, 4, 7, 10, \\\\dots$ 的第 10 项是？",
                "{\"A\":\"28\",\"B\":\"30\",\"C\":\"31\",\"D\":\"25\"}",
                "A", "$a_1=1, d=3$，$a_{10}=1+9\\\\times3=28$。"));
        questions.add(q("MATH-07-007", "数列与导数", "高中", "choice", 4,
                "函数 $f(x)=x^3-3x$ 的极小值是？",
                "{\"A\":\"2\",\"B\":\"-2\",\"C\":\"1\",\"D\":\"0\"}",
                "B", "$f'(x)=3x^2-3=0$ → $x=\\\\pm1$。$x=1$ 时 $f''(x)=6>0$ 为极小，$f(1)=1-3=-2$。"));

        for (ExamQuestion q : questions) {
            questionMapper.insert(q);
        }
        log.info("→ 创建 {} 道种子题目", questions.size());
    }

    private ExamQuestion q(String nodeId, String domain, String level, String type, int diff,
                            String title, String options, String answer, String explanation) {
        return ExamQuestion.builder()
                .nodeId(nodeId).domain(domain).level(level)
                .questionType(type).difficulty(diff)
                .title(title).options(options)
                .answer(answer).explanation(explanation)
                .status(1).build();
    }
}
