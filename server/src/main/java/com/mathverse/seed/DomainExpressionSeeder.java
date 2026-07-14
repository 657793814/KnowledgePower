package com.mathverse.seed;

import com.mathverse.knowledge.entity.KnowledgeNode;
import com.mathverse.knowledge.entity.KnowledgeRelation;
import com.mathverse.knowledge.service.KnowledgeNodeService;
import com.mathverse.knowledge.service.KnowledgeRelationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 领域二：式——代数式与运算
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DomainExpressionSeeder {

    private final KnowledgeNodeService nodeService;
    private final KnowledgeRelationService relationService;

    public void seed() {
        List<KnowledgeNode> nodes = new ArrayList<>();
        List<KnowledgeRelation> relations = new ArrayList<>();

        // ===== 知识点 =====

        nodes.add(KnowledgeNode.builder()
                .id("MATH-02-001").title("整式").subtitle("单项式与多项式的世界")
                .domain("式").level("初中").difficulty(1).sortOrder(210)
                .visualType("static").milestoneType(null)
                .summary("整式由单项式和多项式组成，是代数式的基础。单项式：2x、3xy²；多项式：2x+3y")
                .contentJson("""
                {
                    "text": "整式是代数式的基本形式，由单项式和多项式组成。",
                    "sections": [
                        {"type": "definition", "title": "整式定义", "content": "整式是只包含加法、减法、乘法和正整数指数幂的代数式。$2x+3$ 是整式，$\\\\frac{1}{x}$ 不是整式。"},
                        {"type": "keypoints", "title": "单项式", "items": [
                            "系数 × 字母的幂的乘积，如 $3x^2y$",
                            "系数：数字部分（3）",
                            "次数：所有字母指数之和（2+1=3）",
                            "单独一个数或字母也是单项式"
                        ]},
                        {"type": "keypoints", "title": "多项式", "items": [
                            "多个单项式的和：$2x^2+3x-5$",
                            "项：每个单项式是一项",
                            "次数：最高次项的次数",
                            "常数项：不含字母的项"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "识别 $3x^2y - 2xy + 5$ 的项和次数", "steps": ["项：$3x^2y$、$-2xy$、$5$", "最高次项：$3x^2y$（次数 2+1=3）", "多项式次数：3"], "answer": "3次三项式"},
                            {"question": "单项式 $-5a^2b^3$ 的系数和次数", "steps": ["系数：-5", "次数：2+3=5"], "answer": "-5，5次"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-02-002").title("整式运算").subtitle("加减乘除与乘方")
                .domain("式").level("初中").difficulty(1).sortOrder(220)
                .visualType("static").milestoneType(null)
                .summary("整式加减的核心是合并同类项，乘除运用分配律和指数律")
                .contentJson("""
                {
                    "text": "整式的运算规则：加减靠合并同类项，乘除靠分配律。",
                    "sections": [
                        {"type": "definition", "title": "同类项", "content": "所含字母相同且相同字母的指数也相同的项。$3x^2y$ 和 $-2x^2y$ 是同类项。"},
                        {"type": "keypoints", "title": "运算法则", "items": [
                            "加法/减法：合并同类项，系数相加减，字母部分不变",
                            "乘法：系数乘系数，同底数幂相乘指数相加",
                            "除法：系数除系数，同底数幂相除指数相减",
                            "乘方：积的乘方 = 乘方的积"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "计算 $(3x^2+2x-1)+(x^2-3x+4)$", "steps": ["去括号：$3x^2+2x-1+x^2-3x+4$", "合并同类项：$(3+1)x^2+(2-3)x+(-1+4)$", "=$4x^2-x+3$"], "answer": "$4x^2-x+3$"},
                            {"question": "计算 $(2x+1)(x-3)$", "steps": ["分配：$2x\\\\cdot x + 2x\\\\cdot(-3) + 1\\\\cdot x + 1\\\\cdot(-3)$", "=$2x^2-6x+x-3$", "=$2x^2-5x-3$"], "answer": "$2x^2-5x-3$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-02-003").title("因式分解").subtitle("提取公因式与公式法")
                .domain("式").level("初中").difficulty(2).sortOrder(230)
                .visualType("static").milestoneType(null)
                .summary("因式分解是把多项式写成整式乘积的形式，是整式乘法的逆过程")
                .contentJson("""
                {
                    "text": "因式分解的四种基本方法，是代数变形的核心工具。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "把一个多项式化为几个整式的积的形式，称为因式分解。$x^2-1=(x+1)(x-1)$"},
                        {"type": "keypoints", "title": "四种方法", "items": [
                            "① 提取公因式法：$ma+mb+mc=m(a+b+c)$",
                            "② 公式法（平方差）：$a^2-b^2=(a+b)(a-b)$",
                            "③ 公式法（完全平方）：$a^2\\\\pm2ab+b^2=(a\\\\pm b)^2$",
                            "④ 十字相乘法：$x^2+(p+q)x+pq=(x+p)(x+q)$"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "因式分解 $6x^2y+9xy^2$", "steps": ["公因式：$3xy$", "=$3xy(2x+3y)$"], "answer": "$3xy(2x+3y)$"},
                            {"question": "因式分解 $x^2-5x+6$", "steps": ["找两个数积=6，和=-5：-2和-3", "=$(x-2)(x-3)$"], "answer": "$(x-2)(x-3)$"},
                            {"question": "因式分解 $4x^2-12x+9$", "steps": ["=$ (2x)^2-2\\\\cdot2x\\\\cdot3+3^2$", "=$(2x-3)^2$"], "answer": "$(2x-3)^2$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-02-004").title("分式").subtitle("分母不为零的分数式")
                .domain("式").level("初中").difficulty(2).sortOrder(310)
                .visualType("static").milestoneType(null)
                .summary("分式是分母含字母的代数式，分母不能为零。分式运算与分数类似")
                .contentJson("""
                {
                    "text": "分式是两个整式的比值，核心约束是分母不为零。",
                    "sections": [
                        {"type": "definition", "title": "分式定义", "content": "形如 $\\\\frac{A}{B}$（$B$ 含字母且 $B\\\\neq 0$）的式子叫分式。如 $\\\\frac{1}{x}$、$\\\\frac{x+1}{x-2}$"},
                        {"type": "keypoints", "title": "分式基本性质", "items": [
                            "分子分母同乘（或同除）一个不为零的整式，分式的值不变",
                            "$\\\\frac{A}{B}=\\\\frac{A\\\\times C}{B\\\\times C}$（$C\\\\neq 0$）",
                            "约分：分子分母同除公因式",
                            "通分：取各分母的最简公分母"
                        ]},
                        {"type": "keypoints", "title": "分式运算", "items": [
                            "加减法：先通分，分母不变分子相加减",
                            "乘法：分子乘分子，分母乘分母，先约分",
                            "除法：乘以除式的倒数",
                            "结果必须化为最简分式"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "化简 $\\\\frac{x^2-1}{x^2+2x+1}$", "steps": ["分子：$x^2-1=(x+1)(x-1)$", "分母：$x^2+2x+1=(x+1)^2$", "原式=$\\\\frac{(x+1)(x-1)}{(x+1)^2}=\\\\frac{x-1}{x+1}$"], "answer": "$\\\\frac{x-1}{x+1}$"},
                            {"question": "计算 $\\\\frac{1}{x-1}+\\\\frac{1}{x+1}$", "steps": ["通分：$\\\\frac{x+1}{(x-1)(x+1)}+\\\\frac{x-1}{(x-1)(x+1)}$", "=$\\\\frac{2x}{x^2-1}$"], "answer": "$\\\\frac{2x}{x^2-1}$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-02-005").title("根式").subtitle("平方根与立方根")
                .domain("式").level("初中").difficulty(2).sortOrder(410)
                .visualType("static").milestoneType(null)
                .summary("根式是开方运算的产物：$\\\\sqrt{a}$ 表示 a 的平方根，$\\\\sqrt[3]{a}$ 表示立方根")
                .contentJson("""
                {
                    "text": "根式计算和化简是中学代数的基本功。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "如果 $x^n=a$（$n$ 为正整数），则 $x$ 是 $a$ 的 $n$ 次方根。写为 $x=\\\\sqrt[n]{a}$。"},
                        {"type": "keypoints", "title": "根式的性质", "items": [
                            "$(\\\\sqrt{a})^2 = a$（$a\\\\geq 0$）",
                            "$\\\\sqrt{a^2}=|a|$（注意绝对值！）",
                            "$\\\\sqrt{ab}=\\\\sqrt{a}\\\\cdot\\\\sqrt{b}$（$a,b\\\\geq 0$）",
                            "$\\\\sqrt{\\\\frac{a}{b}}=\\\\frac{\\\\sqrt{a}}{\\\\sqrt{b}}$（$a\\\\geq 0,b>0$）",
                            "最简根式：被开方数不含开得尽的因数和分母"
                        ]},
                        {"type": "keypoints", "title": "分母有理化", "items": [
                            "把分母中的根号去掉",
                            "$\\\\frac{1}{\\\\sqrt{a}}=\\\\frac{\\\\sqrt{a}}{a}$",
                            "$\\\\frac{1}{\\\\sqrt{a}+\\\\sqrt{b}}=\\\\frac{\\\\sqrt{a}-\\\\sqrt{b}}{a-b}$（共轭法）"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "化简 $\\\\sqrt{50}$", "steps": ["$\\\\sqrt{50}=\\\\sqrt{25\\\\times 2}$", "$=5\\\\sqrt{2}$"], "answer": "$5\\\\sqrt{2}$"},
                            {"question": "有理化 $\\\\frac{2}{\\\\sqrt{3}-1}$", "steps": ["$\\\\frac{2(\\\\sqrt{3}+1)}{(\\\\sqrt{3}-1)(\\\\sqrt{3}+1)}$", "=$\\\\frac{2(\\\\sqrt{3}+1)}{3-1}$", "=$\\\\sqrt{3}+1$"], "answer": "$\\\\sqrt{3}+1$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-02-006").title("指数式").subtitle("a^n 与科学记数法")
                .domain("式").level("初中").difficulty(2).sortOrder(510)
                .visualType("static").milestoneType(null)
                .summary("指数是乘方的简写：$a^n=a\\\\times a\\\\times\\\\cdots\\\\times a$（n个a相乘）")
                .contentJson("""
                {
                    "text": "从整数指数到分数指数，指数不断扩展。",
                    "sections": [
                        {"type": "definition", "title": "指数定义", "content": "$a^n$（$n$ 为正整数）表示 $n$ 个 $a$ 相乘。$a$ 为底数，$n$ 为指数。"},
                        {"type": "keypoints", "title": "指数律（同底数幂）", "items": [
                            "$a^m \\\\cdot a^n = a^{m+n}$（同底数幂相乘）",
                            "$a^m \\\\div a^n = a^{m-n}$（$a\\\\neq 0$）",
                            "$(a^m)^n = a^{mn}$（幂的乘方）",
                            "$(ab)^n = a^n b^n$（积的乘方）",
                            "$a^0 = 1$（$a\\\\neq 0$）",
                            "$a^{-n} = \\\\frac{1}{a^n}$（$a\\\\neq 0$）"
                        ]},
                        {"type": "keypoints", "title": "科学记数法", "items": [
                            "将一个数写成 $a\\\\times 10^n$（$1\\\\leq |a| < 10$）",
                            "大数：$1230000 = 1.23\\\\times 10^6$",
                            "小数：$0.000045 = 4.5\\\\times 10^{-5}$"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "计算 $2^3 \\\\times 2^4$", "steps": ["同底数幂相乘，指数相加", "$=2^{3+4}=2^7=128$"], "answer": "$128$"},
                            {"question": "计算 $(x^2y^3)^2 \\\\div (xy)^3$", "steps": ["$(x^4y^6)\\\\div(x^3y^3)$", "$=x^{4-3}y^{6-3}=xy^3$"], "answer": "$xy^3$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-02-007").title("对数式").subtitle("log 的诞生")
                .domain("式").level("高中").difficulty(3).sortOrder(610)
                .visualType("static").milestoneType(null)
                .summary("对数是幂的逆运算：$\\\\log_a b = c \\\\iff a^c = b$")
                .contentJson("""
                {
                    "text": "对数是指数的逆运算，把乘方变成加减法，大大简化计算。",
                    "sections": [
                        {"type": "definition", "title": "对数定义", "content": "如果 $a^c=b$（$a>0,a\\\\neq 1,b>0$），则称 $c$ 是以 $a$ 为底 $b$ 的对数，记作 $\\\\log_a b = c$。"},
                        {"type": "keypoints", "title": "对数律", "items": [
                            "$\\\\log_a a = 1$，$\\\\log_a 1 = 0$",
                            "$\\\\log_a(MN) = \\\\log_a M + \\\\log_a N$（乘变加）",
                            "$\\\\log_a\\\\frac{M}{N} = \\\\log_a M - \\\\log_a N$（除变减）",
                            "$\\\\log_a M^n = n\\\\log_a M$（指变乘）",
                            "$\\\\log_a b = \\\\frac{\\\\log_c b}{\\\\log_c a}$（换底公式）"
                        ]},
                        {"type": "keypoints", "title": "常用对数与自然对数", "items": [
                            "$\\\\lg x = \\\\log_{10} x$（常用对数）",
                            "$\\\\ln x = \\\\log_e x$（自然对数，$e\\\\approx 2.718$）",
                            "$\\\\log_a b = \\\\frac{\\\\lg b}{\\\\lg a}$（换底为常用对数）"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "计算 $\\\\log_2 8 + \\\\log_2 4$", "steps": ["$\\\\log_2 8=3$（因为 $2^3=8$）", "$\\\\log_2 4=2$（因为 $2^2=4$）", "=$3+2=5$"], "answer": "$5$"},
                            {"question": "用对数律化简 $\\\\lg\\\\frac{100x}{y^2}$", "steps": ["$=\\\\lg 100 + \\\\lg x - \\\\lg y^2$", "$=2 + \\\\lg x - 2\\\\lg y$"], "answer": "$2 + \\\\lg x - 2\\\\lg y$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        // ===== 小结节点 =====
        nodes.add(KnowledgeNode.builder()
                .id("MATH-02-099").title("式的世界 · 全景总结")
                .subtitle("从整式到对数的完整旅程")
                .domain("式").level("高中").difficulty(1).sortOrder(999)
                .visualType("static").milestoneType("domain_end")
                .summary("式从整式出发，经过因式分解、分式、根式，扩展到指数和对数")
                .contentJson("""
                {
                    "text": "从整式到对数，式的世界展示着代数变形的力量。",
                    "sections": [
                        {"type": "definition", "title": "式的扩张脉络", "content": "整式（单项式→多项式→因式分解）→ 分式（分母含字母）→ 根式（平方根/立方根）→ 指数式（a^n）→ 对数式（log_a b）"},
                        {"type": "keypoints", "title": "核心洞察", "items": [
                            "因式分解是整式乘法/除法的桥梁",
                            "分式的所有规则与分数一一对应",
                            "指数与对数互为逆运算",
                            "根式、指数、对数本质上是同一件事的不同写法"
                        ]},
                        {"type": "keypoints", "title": "易错点", "items": [
                            "因式分解要分解到不能再分为止",
                            "分式方程必须验根（分母不能为零）",
                            "$\\\\sqrt{a^2}=|a|$ 不是 $a$",
                            "$\\\\log_a(MN) \\\\neq \\\\log_a M \\\\cdot \\\\log_a N$"
                        ]}
                    ]
                }
                """)
                .status(1).build());

        // 批量存入数据库
        for (KnowledgeNode node : nodes) {
            nodeService.save(node);
        }
        log.info("→ 创建 {} 个「式」知识点节点", nodes.size());

        // ===== 知识点关系 =====

        // 主链：整式 → 分式（需要分母概念）
        relations.add(relation("MATH-02-001", "MATH-02-002", "next", 1, "学会整式再学运算"));
        relations.add(relation("MATH-02-002", "MATH-02-001", "prerequisite", 1, "先理解整式是什么"));
        // 整式 → 因式分解
        relations.add(relation("MATH-02-002", "MATH-02-003", "next", 2, "整式运算后学因式分解"));
        relations.add(relation("MATH-02-003", "MATH-02-002", "prerequisite", 1, "需要先会整式乘法"));
        // 因式分解 → 分式（约分需要因式分解）
        relations.add(relation("MATH-02-003", "MATH-02-004", "next", 3, "因式分解是分式约分的基础"));
        relations.add(relation("MATH-02-004", "MATH-02-003", "prerequisite", 1, "分式约分需要因式分解"));
        // 分式 → 根式
        relations.add(relation("MATH-02-004", "MATH-02-005", "next", 4, "分式之后接触根式运算"));
        relations.add(relation("MATH-02-005", "MATH-02-004", "prerequisite", 1, "分式化简是根式的基础"));
        // 根式 → 指数式
        relations.add(relation("MATH-02-005", "MATH-02-006", "next", 5, "根式与指数式相通"));
        relations.add(relation("MATH-02-006", "MATH-02-005", "prerequisite", 1, "理解根式后才能学分数指数"));
        // 指数式 → 对数式
        relations.add(relation("MATH-02-006", "MATH-02-007", "next", 6, "指数之后学对数"));
        relations.add(relation("MATH-02-007", "MATH-02-006", "prerequisite", 1, "对数是指数的逆运算"));

        // 从第一章的实数 → 根式（cross-domain reference）
        relations.add(relation("MATH-01-004", "MATH-02-005", "reference", 1, "实数的平方根引出根式"));
        relations.add(relation("MATH-02-006", "MATH-01-004", "reference", 1, "指数运算涉及实数"));

        // 小节 → 所有节点
        relations.add(relation("MATH-02-099", "MATH-02-001", "summary_of", 1, "涵盖整式"));
        relations.add(relation("MATH-02-099", "MATH-02-002", "summary_of", 2, "涵盖整式运算"));
        relations.add(relation("MATH-02-099", "MATH-02-003", "summary_of", 3, "涵盖因式分解"));
        relations.add(relation("MATH-02-099", "MATH-02-004", "summary_of", 4, "涵盖分式"));
        relations.add(relation("MATH-02-099", "MATH-02-005", "summary_of", 5, "涵盖根式"));
        relations.add(relation("MATH-02-099", "MATH-02-006", "summary_of", 6, "涵盖指数式"));
        relations.add(relation("MATH-02-099", "MATH-02-007", "summary_of", 7, "涵盖对数式"));

        // 批量存入关系
        for (KnowledgeRelation relation : relations) {
            relationService.save(relation);
        }
        log.info("→ 创建 {} 条「式」知识点关系", relations.size());
    }

    private KnowledgeRelation relation(String from, String to, String type, int sort, String desc) {
        return KnowledgeRelation.builder()
                .fromNodeId(from).toNodeId(to)
                .relationType(type).sortOrder(sort).description(desc)
                .build();
    }
}
