package com.knowledgepower.seed;

import com.knowledgepower.knowledge.entity.KnowledgeNode;
import com.knowledgepower.knowledge.entity.KnowledgeRelation;
import com.knowledgepower.knowledge.service.KnowledgeNodeService;
import com.knowledgepower.knowledge.service.KnowledgeRelationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 领域三:方程与不等式
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DomainEquationSeeder {

    private final KnowledgeNodeService nodeService;
    private final KnowledgeRelationService relationService;

    public void seed() {
        List<KnowledgeNode> nodes = new ArrayList<>();
        List<KnowledgeRelation> relations = new ArrayList<>();

        // ════════════════════════════════════════════════
        //  知识点
        // ════════════════════════════════════════════════

        nodes.add(KnowledgeNode.builder()
                .id("MATH-03-001").title("一元一次方程").subtitle("含有一个未知数且最高次数为 1 的方程")
                .domain("方程与不等式").level("初中").difficulty(1).sortOrder(100)
                .visualType("static").milestoneType(null)
                .summary("标准形式 ax+b=0(a≠0),解为 x=-b/a。它是方程世界的基础。")
                .contentJson("""
                {
                    "text": "一元一次方程是最简单的方程形式,是解所有复杂方程的基础。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "含有一个未知数,且未知数的最高次数为 1 的整式方程。标准形式:$ax + b = 0$($a \\neq 0$)"},
                        {"type": "keypoints", "title": "解法步骤", "items": [
                            "1 去分母(如有分数,两边同乘分母的最小公倍数)",
                            "2 去括号(使用分配律)",
                            "3 移项(将含未知数的项移到一边,常数项移到另一边)",
                            "4 合并同类项",
                            "5 系数化为 1(两边同除以未知数的系数)",
                            "解为:$x = -\\frac{b}{a}$"
                        ]},
                        {"type": "keypoints", "title": "核心概念", "items": [
                            "方程:含有未知数的等式",
                            "解(根):使方程成立的未知数的值",
                            "解方程:求方程的解的过程",
                            "同解原理:方程两边同时加减/乘除同一个非零数,解不变"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "解方程 $3x+5=14$", "steps": ["移项:$3x=14-5$", "$3x=9$", "系数为 1:$x=3$"], "answer": "$x=3$"},
                            {"question": "解方程 $\\frac{x}{2}+3=\\frac{2x}{3}$", "steps": ["去分母(×6):$3x+18=4x$", "移项:$18=4x-3x$", "$x=18$"], "answer": "$x=18$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-03-002").title("一元二次方程").subtitle("ax2+bx+c=0,两种求解方法")
                .domain("方程与不等式").level("初中").difficulty(2).sortOrder(200)
                .visualType("canvas").milestoneType(null)
                .summary("标准形式 ax2+bx+c=0(a≠0),核心是判别式 Δ=b2-4ac 决定根的个数")
                .contentJson("""
                {
                    "text": "一元二次方程是中学代数的核心内容,判别式、求根公式、韦达定理是三大支柱。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "含有一个未知数,最高次数为 2 的整式方程。标准形式:$ax^2+bx+c=0$($a\\neq0$)"},
                        {"type": "visualization", "title": "二次方程与函数图像", "content": "一元二次方程的根就是二次函数 y=ax2+bx+c 与 x 轴的交点横坐标",
                            "visual": {"type": "canvas", "component": "function-transform", "config": {"mode": "quadratic-roots"}}},
                        {"type": "keypoints", "title": "解法", "items": [
                            "1 直接开平方法:$x^2=p$ → $x=\\pm\\sqrt{p}$",
                            "2 配方法:将 $ax^2+bx+c=0$ 化为 $(x+m)^2=n$",
                            "3 公式法(万能):$x = \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$",
                            "4 因式分解法:十字相乘或提取公因式"
                        ]},
                        {"type": "keypoints", "title": "判别式 $\\Delta=b^2-4ac$", "items": [
                            "$\\Delta>0$ → 两个不相等的实数根",
                            "$\\Delta=0$ → 两个相等的实数根(重根)",
                            "$\\Delta<0$ → 没有实数根(但有两个复数根)"
                        ]},
                        {"type": "keypoints", "title": "韦达定理(根与系数的关系)", "items": [
                            "设两根为 $x_1, x_2$,则:",
                            "$x_1+x_2=-\\frac{b}{a}$",
                            "$x_1\\cdot x_2=\\frac{c}{a}$",
                            "可用于已知一根求另一根、求对称式值"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "解方程 $x^2-5x+6=0$", "steps": ["因式分解:$(x-2)(x-3)=0$", "$\\therefore x=2$ 或 $x=3$"], "answer": "$x_1=2, x_2=3$"},
                            {"question": "判别式:$x^2+2x+5=0$ 有几个实数根?", "steps": ["$\\Delta = 2^2-4\\times1\\times5$", "$=4-20=-16<0$", "没有实数根"], "answer": "0 个实数根"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-03-003").title("分式方程").subtitle("分母中含有未知数的方程")
                .domain("方程与不等式").level("初中").difficulty(2).sortOrder(300)
                .visualType("static").milestoneType(null)
                .summary("分式方程 = 分母含未知数的方程,解完后必须验根(分母不能为零)")
                .contentJson("""
                {
                    "text": "分式方程的解法核心是去分母,但必须验根,这是与整式方程最大的区别。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "分母中含有未知数的方程叫分式方程。如 $\\frac{1}{x}=2$、$\\frac{x}{x-1}=3$"},
                        {"type": "keypoints", "title": "解法步骤", "items": [
                            "1 找最简公分母(各分母的最小公倍式)",
                            "2 去分母:两边同乘最简公分母(转化为整式方程)",
                            "3 解整式方程",
                            "4 ★★★ 验根:将解代入最简公分母,若为 0 则舍去(增根)"
                        ]},
                        {"type": "keypoints", "title": "增根", "items": [
                            "增根:去分母过程中产生的使分母为 0 的解",
                            "增根不是原方程的解,必须舍去",
                            "分式方程可能有解、无解、有增根三种情况"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "解方程 $\\frac{2}{x-1}=1$", "steps": ["最简公分母:$x-1$", "两边乘 $(x-1)$:$2=x-1$", "$x=3$", "验根:$x=3$ 时 $x-1\\neq0$,✅"], "answer": "$x=3$"},
                            {"question": "解方程 $\\frac{x}{x-2}+\\frac{1}{x}=2$(选做)", "steps": ["公分母:$x(x-2)$", "$x^2+(x-2)=2x(x-2)$", "$x^2+x-2=2x^2-4x$", "$-x^2+5x-2=0$", "$x^2-5x+2=0$", "$x=\\frac{5\\pm\\sqrt{17}}{2}$", "验根:均不为 0 和 2,✅"], "answer": "$x=\\frac{5\\pm\\sqrt{17}}{2}$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-03-004").title("方程组").subtitle("多个方程联立求解")
                .domain("方程与不等式").level("初中").difficulty(2).sortOrder(400)
                .visualType("canvas").milestoneType(null)
                .summary("方程组是由多个方程联立组成的系统,解需要同时满足所有方程")
                .contentJson("""
                {
                    "text": "方程组是从「一个未知数」到「多个未知数」的跃迁,核心思想是消元。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "由两个或两个以上的方程联立组成的一组方程,解需要同时满足所有方程。"},
                        {"type": "keypoints", "title": "二元一次方程组", "items": [
                            "标准形式:$\\begin{cases}a_1x+b_1y=c_1\\a_2x+b_2y=c_2\\end{cases}$",
                            "解法一:代入消元法(把一个方程写成 $y=...$ 代入另一个)",
                            "解法二:加减消元法(两个方程相加减消去一个未知数)"
                        ]},
                        {"type": "visualization", "title": "方程组的几何意义", "content": "二元一次方程组在坐标系中是两条直线,解就是两条直线的交点坐标",
                            "visual": {"type": "canvas", "component": "function-transform", "config": {"mode": "linear-system"}}},
                        {"type": "keypoints", "title": "解的三种情况", "items": [
                            "相交 → 唯一解(两条直线交于一点)",
                            "平行 → 无解(两条直线没有交点)",
                            "重合 → 无数解(两条直线是同一条)"
                        ]},
                        {"type": "keypoints", "title": "三元一次方程组", "items": [
                            "三个方程、三个未知数",
                            "消元法:三元 → 二元 → 一元",
                            "逐步消元求解"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "解方程组 $\\begin{cases}2x+y=5\\x-y=1\\end{cases}$", "steps": ["代入法:由2得 $x=y+1$", "代入1:$2(y+1)+y=5$", "$2y+2+y=5$", "$3y=3$,$y=1$", "$x=2$"], "answer": "$\\begin{cases}x=2\\y=1\\end{cases}$"},
                            {"question": "加减法解 $\\begin{cases}3x+2y=7\\x-2y=-3\\end{cases}$", "steps": ["两式相加:$(3x+2y)+(x-2y)=7+(-3)$", "$4x=4$,$x=1$", "代入2:$1-2y=-3$,$y=2$"], "answer": "$\\begin{cases}x=1\\y=2\\end{cases}$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-03-005").title("一元一次不等式").subtitle("含不等号的代数关系")
                .domain("方程与不等式").level("初中").difficulty(2).sortOrder(500)
                .visualType("canvas").milestoneType(null)
                .summary("不等式描述的是大小关系,与方程的最大区别:乘以负数要变号")
                .contentJson("""
                {
                    "text": "不等式与方程类似,但不等号的方向感需要特别注意。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "用不等号($><\\leq\\geq$)连接两个代数式,表示大小关系的式子叫不等式。标准形式:$ax+b>0$"},
                        {"type": "keypoints", "title": "不等式的基本性质", "items": [
                            "1 两边同加/减同一个数,不等号方向不变",
                            "2 两边同乘/除同一个正数,不等号方向不变",
                            "3 ★★★ 两边同乘/除同一个负数,不等号方向反转!",
                            "4 传递性:若 $a>b$ 且 $b>c$,则 $a>c$"
                        ]},
                        {"type": "visualization", "title": "解集在数轴上的表示", "content": "不等式的解集通常在数轴上用区间表示:空心圈表示不包含端点,实心圈表示包含端点",
                            "visual": {"type": "canvas", "component": "number-line", "config": {"mode": "inequality"}}},
                        {"type": "keypoints", "title": "解集的表示", "items": [
                            "$x>a$:数轴上 a 右侧的开区间",
                            "$x\\leq b$:数轴上 b 左侧,b 点用实心圈",
                            "$a<x\\leq b$:介于 a 和 b 之间,a 开 b 闭"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "解不等式 $-2x+6>0$", "steps": ["移项:$-2x>-6$", "注意要变号!两边同除以 -2:$x<3$"], "answer": "$x<3$"},
                            {"question": "解 $3(x-1)\\leq 2x+4$", "steps": ["去括号:$3x-3 \\leq 2x+4$", "移项:$3x-2x \\leq 4+3$", "$x\\leq 7$"], "answer": "$x\\leq7$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-03-006").title("一元二次不等式").subtitle("二次函数与不等式的结合")
                .domain("方程与不等式").level("高中").difficulty(3).sortOrder(600)
                .visualType("static").milestoneType(null)
                .summary("一元二次不等式利用二次函数图像来求解,数形结合是核心方法")
                .contentJson("""
                {
                    "text": "一元二次不等式是二次函数、二次方程、二次不等式的「三合一」应用。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "含有一个未知数,最高次数为 2 的不等式。标准形式:$ax^2+bx+c>0$ 或 $<0$($a\\neq0$)"},
                        {"type": "keypoints", "title": "解法-数形结合", "items": [
                            "1 解对应的一元二次方程 $ax^2+bx+c=0$(求根)",
                            "2 根据二次函数 $y=ax^2+bx+c$ 的图像确定解集",
                            "3 $a>0$ 时抛物线开口向上,「大于取两边,小于取中间」",
                            "4 $a<0$ 时抛物线开口向下,先化为 $a>0$ 再求解"
                        ]},
                        {"type": "keypoints", "title": "解集规律($a>0$ 时)", "items": [
                            "$\\Delta>0$,两根 $x_1<x_2$:",
                            "  $ax^2+bx+c>0$ → $x<x_1$ 或 $x>x_2$(取两边)",
                            "  $ax^2+bx+c<0$ → $x_1<x<x_2$(取中间)",
                            "$\\Delta=0$:大于 0 时 $x\\neq x_0$;小于 0 时无解",
                            "$\\Delta<0$:大于 0 时恒成立;小于 0 时无解"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "解不等式 $x^2-5x+6>0$", "steps": ["解方程 $x^2-5x+6=0$", "$(x-2)(x-3)=0$,$x_1=2,x_2=3$", "$a=1>0$,「>0 取两边」", "$x<2$ 或 $x>3$"], "answer": "$x<2$ 或 $x>3$"},
                            {"question": "解不等式 $x^2-4x+3<0$", "steps": ["$x^2-4x+3=0$ 的解:$x_1=1,x_2=3$", "$a>0$,\"大于0取两边,小于0取中间\"", "解集:$1<x<3$"], "answer": "$1<x<3$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());
                
        // ===== 重要不等式 =====
        nodes.add(KnowledgeNode.builder()
                .id("MATH-03-007").title("均值不等式与基本不等式").subtitle("AM-GM：算术平均 ≥ 几何平均")
                .domain("方程与不等式").level("高中").difficulty(3).sortOrder(650)
                .visualType("static").milestoneType(null)
                .summary("基本不等式 a²+b²≥2ab 和均值不等式 (a+b)/2 ≥ √(ab) 是证明不等式的最重要工具")
                .contentJson("""
                {
                    "text": "均值不等式链是不等式证明的基石，从两个正数推广到 n 个正数均有形式。",
                    "sections": [
                        {"type": "definition", "title": "基本不等式", "content": "对于任意实数 $a,b$，有：$$a^2+b^2 \\geq 2ab$$ 当且仅当 $a=b$ 时取等。"},
                        {"type": "keypoints", "title": "重要变形", "items": [
                            "经典形式：$\\frac{a+b}{2} \\geq \\sqrt{ab}$（$a,b>0$）",
                            "$a+\\frac{1}{a} \\geq 2$（$a>0$，倒数和的经典应用）",
                            "$\\frac{b}{a}+\\frac{a}{b} \\geq 2$（$a,b>0$）",
                            "$a^2+b^2+c^2 \\geq ab+bc+ca$（三元推论）",
                            "$\\sqrt{\\frac{a^2+b^2}{2}} \\geq \\frac{a+b}{2} \\geq \\sqrt{ab} \\geq \\frac{2}{\\frac{1}{a}+\\frac{1}{b}}$（平方平均 ≥ 算术平均 ≥ 几何平均 ≥ 调和平均）"
                        ]},
                        {"type": "keypoints", "title": "一正二定三相等（使用口诀）", "items": [
                            "一正：$a,b$ 必须为正数（或变量代换后为正）",
                            "二定：$a+b$ 为定值或 $ab$ 为定值",
                            "三相等：要验证等号能否取到（$a=b$ 时）",
                            "若等号取不到，则考虑用对勾函数或其他方法"
                        ]},
                        {"type": "keypoints", "title": "推广形式", "items": [
                            "三元：$\\frac{a+b+c}{3} \\geq \\sqrt[3]{abc}$（$a,b,c>0$）",
                            "$n$ 元：$\\frac{a_1+...+a_n}{n} \\geq \\sqrt[n]{a_1...a_n}$",
                            "加权形式：$\\frac{w_1a_1+...+w_na_n}{w_1+...+w_n} \\geq a_1^{w_1}...a_n^{w_n}$"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "已知 $x>0$，求 $x+\\frac{4}{x}$ 的最小值", "steps": ["由均值不等式：$x+\\frac{4}{x} \\geq 2\\sqrt{x\\cdot\\frac{4}{x}} = 2\\sqrt{4}=4$","当 $x=\\frac{4}{x}$ 即 $x=2$ 时取等"], "answer": "最小值为 4"},
                            {"question": "已知 $x>0,y>0$，$x+y=6$，求 $xy$ 的最大值", "steps": ["由 $\\frac{x+y}{2} \\geq \\sqrt{xy}$，得 $3 \\geq \\sqrt{xy}$","$xy \\leq 9$，当 $x=y=3$ 时取等"], "answer": "最大值为 9"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-03-008").title("柯西不等式与其他重要不等式").subtitle("柯西、排序、三角——不等式证明的高级工具")
                .domain("方程与不等式").level("高中").difficulty(4).sortOrder(700)
                .visualType("static").milestoneType(null)
                .summary("柯西不等式 (∑aᵢ²)(∑bᵢ²) ≥ (∑aᵢbᵢ)² 是不等式领域最重要的推广性结论")
                .contentJson("""
                {
                    "text": "除了均值不等式，柯西不等式、排序不等式等是高中数学竞赛和压轴题的常用工具。",
                    "sections": [
                        {"type": "definition", "title": "柯西不等式", "content": "对于任意实数 $a_1,...,a_n$ 和 $b_1,...,b_n$，有：$$(a_1^2+a_2^2+...+a_n^2)(b_1^2+b_2^2+...+b_n^2) \\geq (a_1b_1+...+a_nb_n)^2$$ 当且仅当各对应项成比例时取等。"},
                        {"type": "keypoints", "title": "柯西不等式的常用形式", "items": [
                            "二维形式：$(a^2+b^2)(c^2+d^2) \\geq (ac+bd)^2$",
                            "向量形式：$|\\vec{a}\\cdot\\vec{b}| \\leq |\\vec{a}||\\vec{b}|$",
                            "分数形式：$\\frac{x_1^2}{y_1}+\\frac{x_2^2}{y_2} \\geq \\frac{(x_1+x_2)^2}{y_1+y_2}$（$y_i>0$）",
                            "配凑技巧：$a^2+b^2 = \\frac{a^2}{1}+\\frac{b^2}{1} \\geq \\frac{(a+b)^2}{2}$（利用分数形式柯西）"
                        ]},
                        {"type": "keypoints", "title": "排序不等式", "items": [
                            "设 $a_1 \\geq a_2 \\geq ... \\geq a_n$，$b_1 \\geq b_2 \\geq ... \\geq b_n$",
                            "同序和 $\\geq$ 乱序和 $\\geq$ 逆序和",
                            "即 $\\sum a_i b_i \\geq \\sum a_i b_{\\sigma(i)} \\geq \\sum a_i b_{n-i+1}$",
                            "可以理解为：大配大小配小最大，大配小最小"
                        ]},
                        {"type": "keypoints", "title": "其他重要不等式", "items": [
                            "三角不等式：$|a|-|b| \\leq |a\\pm b| \\leq |a|+|b|$",
                            "权方和不等式：$\\frac{a_1^2}{b_1}+\\frac{a_2^2}{b_2}+... \\geq \\frac{(a_1+a_2+...)^2}{b_1+b_2+...}$（$b_i>0$）",
                            "绝对值不等式：$|a+b| \\leq |a|+|b|$（最基本的三角不等式）",
                            "舒尔不等式：$a^3+b^3+c^3+3abc \\geq a^2(b+c)+b^2(c+a)+c^2(a+b)$（竞赛级）"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "用柯西不等式证明 $(a^2+b^2)(c^2+d^2) \\geq (ac+bd)^2$", "steps": ["由柯西不等式直接可得", "等号当 $\\frac{a}{c}=\\frac{b}{d}$ 时成立"], "answer": "$(a^2+b^2)(c^2+d^2) \\geq (ac+bd)^2$"},
                            {"question": "已知 $x,y>0$，$x+2y=3$，求 $\\frac{1}{x}+\\frac{1}{y}$ 的最小值", "steps": ["$(x+2y)(\\frac{1}{x}+\\frac{1}{y}) \\geq (1+\\sqrt{2})^2$","$\\frac{1}{x}+\\frac{1}{y} \\geq \\frac{(1+\\sqrt{2})^2}{3}$"], "answer": "最小值 $\\frac{3+2\\sqrt{2}}{3}$"}
                        ]}
                    ]
                }
                """)
                .status(1).build());

        // ===== 小结节点 =====
        nodes.add(KnowledgeNode.builder()
                .id("MATH-03-099").title("方程与不等式 · 全景总结")
                .subtitle("从方程到不等式,从一元到多元")
                .domain("方程与不等式").level("高中").difficulty(1).sortOrder(999)
                .visualType("static").milestoneType("domain_end")
                .summary("方程与不等式的核心思想:找等量关系用方程,找大小关系用不等式")
                .contentJson("""
                {
                    "text": "方程与不等式是描述现实世界中等量关系和不等量关系的数学工具。",
                    "sections": [
                        {"type": "definition", "title": "知识脉络", "content": "一元一次方程 → 一元二次方程 → 分式方程 → 方程组(多元)\\n一元一次不等式 → 一元二次不等式 → 均值不等式 → 柯西不等式等"},
                        {"type": "keypoints", "title": "核心洞察", "items": [
                            "方程是「找到那个数」,不等式是「找到范围」",
                            "一元二次方程 + 二次函数 + 一元二次不等式 = 「三合一」",
                            "判别式 $\\Delta$ 贯穿整个领域,决定根/解的情况",
                            "分式方程必须验根!这是最大的易错点",
                            "乘以负数要变不等号--不等式的灵魂规则"
                        ]},
                        {"type": "keypoints", "title": "易错点", "items": [
                            "分式方程忘记验根 → 产生增根",
                            "不等式乘负数忘记变号",
                            "一元二次不等式忘记 $a$ 的正负",
                            "方程组解完只代回一个方程验证(要用两个方程都验证)"
                        ]}
                    ]
                }
                """)
                .status(1).build());

        // 批量存入数据库
        for (KnowledgeNode node : nodes) {
            nodeService.save(node);
        }
        log.info("→ 创建 {} 个「方程与不等式」知识点节点", nodes.size());

        // ════════════════════════════════════════════════
        //  知识点关系
        // ════════════════════════════════════════════════

        // 主链:一元一次方程 → 一元二次方程 → 分式方程
        relations.add(relation("MATH-03-001", "MATH-03-002", "next", 1, "掌握一元一次方程后学一元二次"));
        relations.add(relation("MATH-03-002", "MATH-03-001", "prerequisite", 1, "一元二次方程需要方程基本概念"));

        relations.add(relation("MATH-03-002", "MATH-03-003", "next", 2, "二次方程之后学增根概念"));
        relations.add(relation("MATH-03-003", "MATH-03-002", "prerequisite", 1, "分式方程需要解整式方程的能力"));

        relations.add(relation("MATH-03-002", "MATH-03-004", "next", 3, "从一元到多元的跃迁"));
        relations.add(relation("MATH-03-004", "MATH-03-001", "prerequisite", 1, "方程组的基础是解一元方程"));

        // 不等式分支:从方程到不等式
        relations.add(relation("MATH-03-001", "MATH-03-005", "next", 4, "方程熟悉后学不等式"));
        relations.add(relation("MATH-03-005", "MATH-03-001", "prerequisite", 1, "解不等式的方法与方程相似"));

        relations.add(relation("MATH-03-002", "MATH-03-006", "next", 5, "二次方程对应二次不等式"));
        relations.add(relation("MATH-03-006", "MATH-03-002", "prerequisite", 1, "解一元二次不等式需要二次方程求根"));

        // 不等式高级分支：均值不等式 → 柯西不等式
        relations.add(relation("MATH-03-006", "MATH-03-007", "next", 6, "解不等式后学证明不等式"));
        relations.add(relation("MATH-03-007", "MATH-03-005", "prerequisite", 1, "均值不等式需要不等式基本概念"));

        relations.add(relation("MATH-03-007", "MATH-03-008", "next", 7, "从均值不等式到柯西不等式"));
        relations.add(relation("MATH-03-008", "MATH-03-007", "prerequisite", 1, "柯西不等式需要不等式的综合基础"));

        // 跨领域引用
        // 式 → 方程：因式分解对解二次方程至关重要
        relations.add(relation("MATH-02-003", "MATH-03-002", "reference", 1, "因式分解法解一元二次方程"));
        // 分式 → 分式方程
        relations.add(relation("MATH-02-004", "MATH-03-003", "reference", 1, "分式的概念是分式方程的基础"));
        // 实数 → 方程（平方根法）
        relations.add(relation("MATH-01-004", "MATH-03-002", "reference", 1, "平方根是直接开平方法的基础"));
        // 均值不等式 → 二次函数最值
        relations.add(relation("MATH-03-007", "MATH-04-004", "reference", 1, "均值不等式求二次式最值"));

        // 小节 → 所有节点
        relations.add(relation("MATH-03-099", "MATH-03-001", "summary_of", 1, "涵盖一元一次方程"));
        relations.add(relation("MATH-03-099", "MATH-03-002", "summary_of", 2, "涵盖一元二次方程"));
        relations.add(relation("MATH-03-099", "MATH-03-003", "summary_of", 3, "涵盖分式方程"));
        relations.add(relation("MATH-03-099", "MATH-03-004", "summary_of", 4, "涵盖方程组"));
        relations.add(relation("MATH-03-099", "MATH-03-005", "summary_of", 5, "涵盖一元一次不等式"));
        relations.add(relation("MATH-03-099", "MATH-03-006", "summary_of", 6, "涵盖一元二次不等式"));
        relations.add(relation("MATH-03-099", "MATH-03-007", "summary_of", 7, "涵盖均值不等式"));
        relations.add(relation("MATH-03-099", "MATH-03-008", "summary_of", 8, "涵盖柯西不等式"));

        // 批量存入关系
        for (KnowledgeRelation relation : relations) {
            relationService.save(relation);
        }
        log.info("→ 创建 {} 条「方程与不等式」知识点关系", relations.size());
    }

    private KnowledgeRelation relation(String from, String to, String type, int sort, String desc) {
        return KnowledgeRelation.builder()
                .fromNodeId(from).toNodeId(to)
                .relationType(type).sortOrder(sort).description(desc)
                .build();
    }
}
