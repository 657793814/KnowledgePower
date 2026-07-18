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
 * 领域七：数列与导数
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DomainSequenceSeeder {

    private final KnowledgeNodeService nodeService;
    private final KnowledgeRelationService relationService;

    public void seed() {
        List<KnowledgeNode> nodes = new ArrayList<>();
        List<KnowledgeRelation> relations = new ArrayList<>();

        // ══════════════════════════════
        //  知识点
        // ══════════════════════════════

        nodes.add(KnowledgeNode.builder()
                .id("MATH-07-001").title("数列的概念").subtitle("按顺序排列的一列数")
                .domain("数列与导数").level("高中").difficulty(2).sortOrder(100)
                .visualType("canvas").milestoneType(null)
                .summary("数列是按一定次序排列的数，通项公式 aₙ 是核心")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"按一定次序排列的一列数叫数列，记作 $\\{a_n\\}$。$a_n$ 叫通项公式，表示第 $n$ 项的值。"},
                    {"type":"keypoints","title":"分类","items":[
                        "有穷数列：项数有限",
                        "无穷数列：项数无限",
                        "递增数列：$a_{n+1}>a_n$",
                        "递减数列：$a_{n+1}<a_n$",
                        "常数列：各项都相等",
                        "摆动数列：值正负交替"
                    ]},
                    {"type":"keypoints","title":"表示方法","items":[
                        "通项公式：$a_n=f(n)$（直接写出第 n 项）",
                        "递推公式：$a_{n+1}=f(a_n)$（用前一项表示后一项）",
                        "例：$a_n=2n-1$ → 1,3,5,7,9,...",
                        "例：$a_1=1,a_{n+1}=a_n+2$ → 也是 1,3,5,7,9,..."
                    ]},
                    {"type":"visualization","title":"数列可视化","content":"数列在坐标系中是一系列离散的点（n 为横坐标，aₙ 为纵坐标）",
                        "visual":{"type":"canvas","component":"sequence-visual","config":{"mode":"demo"}}},
                    {"type":"example","title":"示例","items":[
                        {"question":"写出数列 1,4,9,16,25,... 的通项","steps":["a₁=1², a₂=2², a₃=3², a₄=4²","aₙ=n²"],"answer":"aₙ=n²"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-07-002").title("等差数列").subtitle("每次增加相同的数")
                .domain("数列与导数").level("高中").difficulty(2).sortOrder(200)
                .visualType("canvas").milestoneType(null)
                .summary("等差数列是每一项与前一 项之差为常数的数列")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"从第 2 项起，每一项与它的前一项的差等于同一个常数 $d$（公差），这样的数列叫等差数列：$$a_n=a_1+(n-1)d$$"},
                    {"type":"keypoints","title":"求和公式","items":[
                        "高斯求和：$S_n=\\frac{n(a_1+a_n)}{2}$",
                        "一般形式：$S_n=na_1+\\frac{n(n-1)}{2}d$",
                        "高斯小时候：1+2+...+100=(1+100)×100/2=5050"
                    ]},
                    {"type":"keypoints","title":"等差中项","items":[
                        "三个数成等差数列 $\\iff 2b=a+c$",
                        "等差数列中：$a_n=\\frac{a_{n-1}+a_{n+1}}{2}$",
                        "等差数列中任意连续三项都成等差"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"在等差数列 {aₙ} 中，a₁=3，d=2，求 a₁₀ 和 S₁₀","steps":["a₁₀=3+(10-1)×2=3+18=21","S₁₀=10×(3+21)/2=120"],"answer":"a₁₀=21, S₁₀=120"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-07-003").title("等比数列").subtitle("每次乘以相同的数")
                .domain("数列与导数").level("高中").difficulty(2).sortOrder(300)
                .visualType("static").milestoneType(null)
                .summary("等比数列是每一项与前一 项之比为常数的数列")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"从第 2 项起，每一项与它的前一项的比等于同一个常数 $q$（公比），这样的数列叫等比数列：$$a_n=a_1 q^{n-1}$$"},
                    {"type":"keypoints","title":"求和公式","items":[
                        "$q\\neq1$ 时：$S_n=a_1\\frac{1-q^n}{1-q}$",
                        "$q=1$ 时：$S_n=na_1$（常数列）",
                        "记忆：分子是「1 减 q 的 n 次方」，分母是「1 减 q」"
                    ]},
                    {"type":"keypoints","title":"等比中项","items":[
                        "三个数成等比数列 $\\iff b^2=ac$",
                        "等比数列中：$a_n^2=a_{n-1}\\cdot a_{n+1}$"
                    ]},
                    {"type":"keypoints","title":"与指数函数的关系","items":[
                        "等比数列的通项 $a_n=a_1 q^{n-1}$ 是指数函数形式",
                        "$a_n$ 是 $n$ 的指数型函数",
                        "等比增长对应指数增长"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"在等比数列 {aₙ} 中，a₁=2，q=3，求 a₅ 和 S₅","steps":["a₅=2×3⁴=2×81=162","S₅=2×(1-3⁵)/(1-3)","=2×(1-243)/(-2)=(-484)/(-2)=242"],"answer":"a₅=162, S₅=242"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-07-004").title("数列求和").subtitle("常用数列的求和技巧")
                .domain("数列与导数").level("高中").difficulty(3).sortOrder(400)
                .visualType("static").milestoneType(null)
                .summary("裂项相消、错位相减、分组求和——数列求和的三大方法")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"求和的意义","content":"数列求和就是求 $S_n=a_1+a_2+...+a_n$。除了等差等比公式外，还有多种常用技巧。"},
                    {"type":"keypoints","title":"裂项相消法","items":[
                        "适用于 $a_n=\\frac{1}{n(n+1)}$ 形式",
                        "$\\frac{1}{n(n+1)}=\\frac{1}{n}-\\frac{1}{n+1}$",
                        "前后项相互抵消，简洁优雅"
                    ]},
                    {"type":"keypoints","title":"错位相减法","items":[
                        "适用于等差×等比=混合型数列",
                        "例：$a_n=n\\cdot2^n$",
                        "方法：写出 $S_n$，乘以公比后错位相减"
                    ]},
                    {"type":"keypoints","title":"分组求和法","items":[
                        "适用于一个数列可以分成两个独立的数列",
                        "分别求和后再相加即可"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"求 $\\frac{1}{1\\times2}+\\frac{1}{2\\times3}+...$","steps":["=1-1/2+1/2-1/3+1/3-1/4+...","=1-1/(n+1)","=n/(n+1)"],"answer":"n/(n+1)"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-07-005").title("导数概念").subtitle("函数的变化率")
                .domain("数列与导数").level("高中").difficulty(4).sortOrder(500)
                .visualType("canvas").milestoneType(null)
                .summary("导数描述函数在某一点的变化率——几何意义是该点切线的斜率")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"函数 $y=f(x)$ 在 $x=x_0$ 处的导数定义为：$$f'(x_0)=\\lim_{\\Delta x\\to 0}\\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$$"},
                    {"type":"keypoints","title":"几何意义","items":[
                        "导数 $f'(x_0)$ = 曲线在点 $(x_0,f(x_0))$ 处切线的斜率",
                        "切线方程：$y-f(x_0)=f'(x_0)(x-x_0)$",
                        "导数 > 0 → 函数在此处递增（向上走）",
                        "导数 < 0 → 函数在此处递减（向下走）",
                        "导数 = 0 → 可能是极值点（平缓的地方）"
                    ]},
                    {"type":"keypoints","title":"可导与连续","items":[
                        "可导 → 一定连续",
                        "连续 → 不一定可导（如尖点、折点）",
                        "极值点必要条件：$f'(x_0)=0$（驻点）"
                    ]},
                    {"type":"analogy","title":"💡 导数=瞬时速度","content":"开车时里程表显示的是行驶距离，速度表显示的是「单位时间行驶的距离」—即速度是距离的导数。瞬时速度就是纳米级时间内的平均速度，这正是导数的思想：极限。"}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-07-006").title("导数计算").subtitle("基本函数的求导法则")
                .domain("数列与导数").level("高中").difficulty(4).sortOrder(600)
                .visualType("static").milestoneType(null)
                .summary("掌握基本初等函数的导数公式和四则运算法则")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"基本导数公式","content":"$$(C)'=0$$ $$(x^n)'=nx^{n-1}$$ $$(e^x)'=e^x$$ $$(\\ln x)'=\\frac{1}{x}$$ $$(\\sin x)'=\\cos x$$ $$(\\cos x)'=-\\sin x$$"},
                    {"type":"keypoints","title":"四则运算法则","items":[
                        "$(u\\pm v)'=u'\\pm v'$",
                        "$(uv)'=u'v+uv'$（乘积法则）",
                        "$(\\frac{u}{v})'=\\frac{u'v-uv'}{v^2}$（商的法则）"
                    ]},
                    {"type":"keypoints","title":"复合函数求导（链式法则）","items":[
                        "$y=f(g(x))$，令 $u=g(x)$",
                        "$\\frac{dy}{dx}=\\frac{dy}{du}\\cdot\\frac{du}{dx}$",
                        "外层导数 × 内层导数",
                        "例：$(\\sin 2x)'=2\\cos 2x$"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"求 f(x)=3x²+ln x 的导数","steps":["(3x²)'=6x","(ln x)'=1/x","f'(x)=6x+1/x"],"answer":"f'(x)=6x+1/x"},
                        {"question":"求 f(x)=x·sin x 的导数","steps":["乘积法则：(x)'sin x + x(sin x)'","=1·sin x + x·cos x","=sin x + x cos x"],"answer":"f'(x)=sin x+x cos x"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-07-007").title("导数应用").subtitle("用导数研究函数")
                .domain("数列与导数").level("高中").difficulty(4).sortOrder(700)
                .visualType("static").milestoneType(null)
                .summary("导数可以判断单调性、求极值最值、证明不等式——是研究函数的利器")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"导数的应用框架","content":"求出导数 → 找导数为零的点（驻点）→ 判断单调性 → 确定极值 → 综合应用"},
                    {"type":"keypoints","title":"单调性判定","items":[
                        "在区间 $(a,b)$ 内，$f'(x)>0$ → $f(x)$ 单调递增",
                        "在区间 $(a,b)$ 内，$f'(x)<0$ → $f(x)$ 单调递减"
                    ]},
                    {"type":"keypoints","title":"极值与最值","items":[
                        "极值点必要条件：$f'(x_0)=0$",
                        "极值点充分条件（一阶导变号法）：",
                        "  $f'(x)$ 从左正后负 → 极大值",
                        "  $f'(x)$ 从左负后正 → 极小值",
                        "最值 = 区间内所有极值 + 端点值中的最大/最小"
                    ]},
                    {"type":"keypoints","title":"实际应用","items":[
                        "优化问题：最大利润、最小成本",
                        "物理：速度、加速度",
                        "几何：切线、曲率",
                        "不等式证明：构造函数用导数判断单调性"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"求 f(x)=x³-3x 的极值","steps":["f'(x)=3x²-3=3(x²-1)","f'(x)=0 → x=±1","f'(x) 在 x=-1 左侧正右侧负 → 极大","f'(x) 在 x=1 左侧负右侧正 → 极小","极大值 f(-1)=2，极小值 f(1)=-2"],"answer":"极大值 2（x=-1），极小值 -2（x=1）"}
                    ]}
                ]}""")
                .status(1).build());

        // ===== 常用放缩方法 =====
        nodes.add(KnowledgeNode.builder()
                .id("MATH-07-008").title("常见放缩方法").subtitle("切线放缩、数列放缩、不等式放缩")
                .domain("数列与导数").level("高中").difficulty(5).sortOrder(750)
                .visualType("static").milestoneType(null)
                .summary("放缩法是证明不等式和数列极限的利器，核心是 e^x ≥ x+1 和 ln x ≤ x-1 两个切线不等式")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"什么是放缩","content":"放缩法是一种估计算法：把复杂的表达式放大或缩小到一个容易处理的范围，通过比较间接证明不等式或判定极限。"},
                    {"type":"keypoints","title":"两大切线放缩（导数压轴题的核心）","items":[
                        "指数放缩：$e^x \\geq x+1$（当 $x=0$ 时取等）",
                        "对数放缩：$\\ln x \\leq x-1$（当 $x=1$ 时取等）",
                        "推论：$\\ln(x+1) \\leq x$，$e^x \\geq ex$（取 $x=1$ 处切线）",
                        "记忆法：指数图像在切线之上，对数图像在切线之下",
                        "推广：$e^x \\geq 1+x+\\frac{x^2}{2}+...$（泰勒展开放缩）"
                    ]},
                    {"type":"keypoints","title":"常用放缩不等式","items":[
                        "$\\sin x < x < \\tan x$（$x>0$）—— 三角函数放缩",
                        "$\\frac{x}{1+x} \\leq \\ln(1+x) \\leq x$（$x>-1$）—— 对数放缩加强",
                        "$e^x \\geq 1+x+\\frac{x^2}{2}$（更高阶逼近）",
                        "$\\frac{1}{n+1} < \\ln(1+\\frac{1}{n}) < \\frac{1}{n}$"
                    ]},
                    {"type":"keypoints","title":"数列放缩技巧","items":[
                        "裂项放缩：$\\frac{1}{n^2} < \\frac{1}{n-1} - \\frac{1}{n} = \\frac{1}{n(n-1)}$",
                        "等比放缩：$\\frac{1}{2^n-1} < \\frac{1}{2^{n-1}}$（放大分母）",
                        "先放缩后求和：$a_n < b_n$ 且 $\\sum b_n$ 收敛，则 $\\sum a_n$ 收敛",
                        "放缩的度——既不放大到爆炸，也不缩小到无意义",
                        "常用策略：保留前几项不动，从某项开始放缩"
                    ]},
                    {"type":"keypoints","title":"放缩的极限应用——夹逼准则","items":[
                        "若 $a_n \\leq b_n \\leq c_n$ 且 $\\lim a_n = \\lim c_n = L$，则 $\\lim b_n = L$",
                        "例：$\\lim_{n\\to\\infty}\\frac{\\sin n}{n} = 0$（因为 $-\\frac{1}{n} \\leq \\frac{\\sin n}{n} \\leq \\frac{1}{n}$）"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"证明 $e^x \\geq x+1$（x∈R）","steps":["设 f(x)=e^x-(x+1)","f'(x)=e^x-1","f'(x)=0 → x=0","f(0)=0 是最小值","∴ e^x ≥ x+1"],"answer":"构造函数利用导数证明"},
                        {"question":"用放缩比较 $\\ln 2$ 的大小范围","steps":["由 $\\frac{1}{n+1} < \\ln(1+\\frac{1}{n}) < \\frac{1}{n}$","取 n=1：$\\frac{1}{2} < \\ln 2 < 1$","取 n=2：$\\frac{1}{3} < \\ln\\frac{3}{2} < \\frac{1}{2}$，叠加可得更精确估计"],"answer":"$0.5 < \\ln 2 < 1$"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-07-099").title("数列与导数 · 全景总结").subtitle("从离散到连续")
                .domain("数列与导数").level("高中").difficulty(1).sortOrder(999)
                .visualType("static").milestoneType("domain_end")
                .summary("数列研究离散量的变化规律，导数研究连续量的变化率")
                .contentJson("""
                {"sections":[
                    {"type":"keypoints","title":"知识脉络","items":[
                        "数列概念 → 等差数列 → 等比数列 → 数列求和",
                        "导数概念 → 导数计算 → 导数应用",
                        "数列是离散的「函数」，导数是连续的「变化率」",
                        "放缩方法：切线放缩 → 数列放缩 → 夹逼准则"
                    ]},
                    {"type":"keypoints","title":"核心洞察","items":[
                        "等差数列 ≈ 线性函数（常数变化率）",
                        "等比数列 ≈ 指数函数（自身成比例增长）",
                        "导数是微积分的核心，是现代数学的基石",
                        "数列与导数的桥梁：差分 → 导数",
                        "切线放缩 e^x≥x+1 和 ln x≤x-1 是导数压轴题的基石"
                    ]},
                    {"type":"keypoints","title":"跨领域联系","items":[
                        "数列 → 函数（通项公式即特殊函数）",
                        "导数 → 函数（研究函数性质的工具）",
                        "等比数列 → 指数函数/对数函数",
                        "极值优化 → 不等式证明（跨领域应用）"
                    ]}
                ]}""")
                .status(1).build());

        for (KnowledgeNode node : nodes) nodeService.save(node);
        log.info("→ 创建 {} 个「数列与导数」知识点节点", nodes.size());

        // ══════════════════════════════
        //  关系
        // ══════════════════════════════

        relations.add(relation("MATH-07-001", "MATH-07-002", "next", 1, "学数列概念后学等差"));
        relations.add(relation("MATH-07-002", "MATH-07-001", "prerequisite", 1, ""));

        relations.add(relation("MATH-07-002", "MATH-07-003", "next", 2, "从加法关系到乘法关系"));
        relations.add(relation("MATH-07-003", "MATH-07-002", "prerequisite", 1, ""));

        relations.add(relation("MATH-07-002", "MATH-07-004", "next", 3, "掌握基本数列后的求和技巧"));
        relations.add(relation("MATH-07-004", "MATH-07-002", "prerequisite", 1, ""));
        relations.add(relation("MATH-07-004", "MATH-07-003", "prerequisite", 1, ""));

        relations.add(relation("MATH-07-001", "MATH-07-005", "next", 4, "从离散的数列到连续的变化率"));
        relations.add(relation("MATH-07-005", "MATH-07-001", "prerequisite", 1, ""));

        relations.add(relation("MATH-07-005", "MATH-07-006", "next", 5, "概念理解后学计算方法"));
        relations.add(relation("MATH-07-006", "MATH-07-005", "prerequisite", 1, ""));

        relations.add(relation("MATH-07-006", "MATH-07-007", "next", 6, "学完计算学应用"));
        relations.add(relation("MATH-07-007", "MATH-07-005", "prerequisite", 1, ""));
        relations.add(relation("MATH-07-007", "MATH-07-006", "prerequisite", 1, ""));

        // 放缩方法：导数与数列的交叉应用
        relations.add(relation("MATH-07-007", "MATH-07-008", "next", 7, "导数应用后的高级技巧"));
        relations.add(relation("MATH-07-008", "MATH-07-007", "prerequisite", 1, "放缩需要导数基础"));
        relations.add(relation("MATH-07-004", "MATH-07-008", "prerequisite", 1, "数列求和是数列放缩的基础"));
        // 跨领域：不等式
        relations.add(relation("MATH-03-007", "MATH-07-008", "reference", 1, "均值不等式与放缩相通"));

        // 跨领域引用
        relations.add(relation("MATH-04-004", "MATH-07-005", "reference", 1, "二次函数的导数（幂函数求导）"));
        relations.add(relation("MATH-04-006", "MATH-07-003", "reference", 1, "等比数列与指数函数"));
        relations.add(relation("MATH-04-007", "MATH-07-006", "reference", 1, "对数函数求导"));

        // 全景总结
        relations.add(relation("MATH-07-099", "MATH-07-001", "summary_of", 1, ""));
        relations.add(relation("MATH-07-099", "MATH-07-002", "summary_of", 2, ""));
        relations.add(relation("MATH-07-099", "MATH-07-003", "summary_of", 3, ""));
        relations.add(relation("MATH-07-099", "MATH-07-004", "summary_of", 4, ""));
        relations.add(relation("MATH-07-099", "MATH-07-005", "summary_of", 5, ""));
        relations.add(relation("MATH-07-099", "MATH-07-006", "summary_of", 6, ""));
        relations.add(relation("MATH-07-099", "MATH-07-007", "summary_of", 7, ""));
        relations.add(relation("MATH-07-099", "MATH-07-008", "summary_of", 8, ""));

        for (KnowledgeRelation r : relations) relationService.save(r);
        log.info("→ 创建 {} 条「数列与导数」知识点关系", relations.size());
    }

    private KnowledgeRelation relation(String from, String to, String type, int sort, String desc) {
        return KnowledgeRelation.builder()
                .fromNodeId(from).toNodeId(to)
                .relationType(type).sortOrder(sort).description(desc)
                .build();
    }
}
