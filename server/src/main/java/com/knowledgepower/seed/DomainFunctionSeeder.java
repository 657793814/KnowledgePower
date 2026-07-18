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
 * 领域四：函数
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DomainFunctionSeeder {

    private final KnowledgeNodeService nodeService;
    private final KnowledgeRelationService relationService;

    public void seed() {
        List<KnowledgeNode> nodes = new ArrayList<>();
        List<KnowledgeRelation> relations = new ArrayList<>();

        // ══════════════════════════════
        //  知识点
        // ══════════════════════════════

        nodes.add(KnowledgeNode.builder()
                .id("MATH-04-001").title("函数基础概念").subtitle("变量之间的依赖关系")
                .domain("函数").level("初中").difficulty(1).sortOrder(100)
                .visualType("canvas").milestoneType(null)
                .summary("函数是两个变量之间的映射关系：y=f(x)，每个输入 x 有唯一确定的输出 y")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"一般地，在一个变化过程中，有两个变量 $x$ 和 $y$，如果对于 $x$ 的每一个值，$y$ 都有唯一确定的值与之对应，那么 $y$ 是 $x$ 的函数，记作 $y=f(x)$。"},
                    {"type":"keypoints","title":"三要素","items":[
                        "定义域：自变量 $x$ 的取值范围",
                        "值域：因变量 $y$ 的取值范围（$y$ 的所有可能取值）",
                        "对应法则：$f$ 表示自变量到因变量的映射规则"
                    ]},
                    {"type":"keypoints","title":"表示方法","items":[
                        "解析法：$y=f(x)$ 用公式表示",
                        "列表法：列出 $x$ 与 $y$ 的对应值表",
                        "图像法：在坐标系中画出函数图像"
                    ]},
                    {"type":"analogy","title":"💡 类比理解","content":"函数就像一台机器：你输入一个 x（投入原材料），机器按规则 f 加工，输出一个 y（成品）。一台好机器，同样的输入永远得到同样的输出。这就是「唯一确定」的含义。"}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-04-002").title("一次函数").subtitle("最简单的线性关系：y=kx+b")
                .domain("函数").level("初中").difficulty(2).sortOrder(200)
                .visualType("canvas").milestoneType(null)
                .summary("一次函数的图像是一条直线，k 控制斜率（陡峭和方向），b 控制截距（上下偏移）")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"形如 $y=kx+b$（$k\\neq0$）的函数叫一次函数。当 $b=0$ 时叫正比例函数 $y=kx$。"},
                    {"type":"keypoints","title":"图像 — 直线","items":[
                        "$k>0$：直线从左下到右上（上升）",
                        "$k<0$：直线从左上到右下（下降）",
                        "$|k|$ 越大越「陡」，越小越「平」",
                        "$b$：直线与 $y$ 轴交点的纵坐标"
                    ]},
                    {"type":"keypoints","title":"性质","items":[
                        "定义域和值域都是全体实数 $\\mathbb{R}$",
                        "图像经过点 $(0,b)$ 和 $(-\\frac{b}{k},0)$",
                        "增减性：$k>0$ 时 $y$ 随 $x$ 增大而增大",
                        "正比例函数 $y=kx$ 的图像过原点"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"一次函数 y=2x+3，求与坐标轴交点","steps":["令 x=0：y=3 → (0,3)","令 y=0：2x+3=0 → x=-1.5 → (-1.5,0)"],"answer":"(0,3) 和 (-1.5,0)"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-04-003").title("反比例函数").subtitle("y=k/x，两个量成反比")
                .domain("函数").level("初中").difficulty(2).sortOrder(300)
                .visualType("canvas").milestoneType(null)
                .summary("反比例函数 y=k/x（k≠0），图像是双曲线，x 和 y 成反比")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"形如 $y=\\frac{k}{x}$（$k\\neq0$）的函数叫反比例函数。"},
                    {"type":"keypoints","title":"图像 — 双曲线","items":[
                        "$k>0$：图像在一、三象限",
                        "$k<0$：图像在二、四象限",
                        "$x$ 轴和 $y$ 轴是渐近线（无限接近但永不相交）",
                        "$|k|$ 越大，图像离原点越远"
                    ]},
                    {"type":"keypoints","title":"性质","items":[
                        "定义域：$x\\neq0$",
                        "值域：$y\\neq0$",
                        "图像关于原点中心对称",
                        "图像关于 $y=x$ 和 $y=-x$ 轴对称",
                        "增减性：在各自象限内，$k>0$ 时递减，$k<0$ 时递增"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"反比例函数 y=6/x，x>0 时 y 随 x 增大如何变化？","steps":["k=6>0，在第一象限","x 增大时 6/x 减小","y 随 x 增大而减小"],"answer":"y 随 x 增大而减小"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-04-004").title("二次函数").subtitle("y=ax²+bx+c，开口向上的山脉或向下的山谷")
                .domain("函数").level("初中").difficulty(3).sortOrder(400)
                .visualType("canvas").milestoneType(null)
                .summary("二次函数的图像是抛物线，a 决定开口方向，顶点决定位置，对称轴贯穿")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"形如 $y=ax^2+bx+c$（$a\\neq0$）的函数叫二次函数。顶点式：$y=a(x-h)^2+k$"},
                    {"type":"visualization","title":"参数对图像的影响","content":"调节 a、h、k 观察抛物线变化：a 控制开口，h 左右平移，k 上下平移",
                        "visual":{"type":"canvas","component":"function-transform","config":{"mode":"quadratic"}}},
                    {"type":"animation","title":"🎬 函数平移动画","content":"观察 y=x² 平移为 y=(x-2)²+3 的完整过程","animation":"function-shift","config":{}},
                    {"type":"keypoints","title":"核心要素","items":[
                        "顶点：$(-\\frac{b}{2a}, \\frac{4ac-b^2}{4a})$",
                        "对称轴：$x=-\\frac{b}{2a}$",
                        "$a>0$ 开口向上，$a<0$ 开口向下",
                        "$|a|$ 越大开口越小，$|a|$ 越小开口越大",
                        "与 $y$ 轴交点：$(0,c)$"
                    ]},
                    {"type":"keypoints","title":"与一元二次方程的关系","items":[
                        "$y=ax^2+bx+c$ 与 $x$ 轴的交点即 $ax^2+bx+c=0$ 的解",
                        "$\\Delta=b^2-4ac>0$ → 两个交点",
                        "$\\Delta=0$ → 一个交点（顶点在 $x$ 轴上）",
                        "$\\Delta<0$ → 无交点"
                    ]},
                    {"type":"strategy","title":"思维训练·解题策略","items":[
                        "遇到二次函数，先确定开口方向（$a>0$ 向上，$a<0$ 向下）",
                        "顶点坐标 $(-\\frac{b}{2a},\\frac{4ac-b^2}{4a})$ —— 这是标准化的解题入口",
                        "配方是万能方法：$y=ax^2+bx+c\\rightarrow y=a(x-h)^2+k$",
                        "$|a|$ 越大开口越小 → 二次项系数决定图像『胖瘦』",
                        "求与 $x$ 轴交点 → 令 $y=0$ 解一元二次方程",
                        "💡 核心心法：二次函数的问题，大部分都能通过配方变成顶点式来解决"
                    ]},
                    {"type":"common-mistakes","title":"易错点辨析","items":[
                        {"mistake":"二次函数 $y=ax^2+bx+c$ 中，顶点横坐标是 $\\frac{b}{2a}$","correct":"顶点横坐标是 $-\\frac{b}{2a}$（注意负号！）"},
                        {"mistake":"$a$ 越大开口越大","correct":"$|a|$ 越大开口反而越小，$|a|$ 越小开口越大"},
                        {"mistake":"平移时 $y=(x-h)^2+k$，$h>0$ 向左平移","correct":"$y=(x-h)^2$ 中 $h>0$ 向右平移——『正右负左』"}
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"求 y=x²-4x+3 的顶点坐标和对称轴","steps":["a=1,b=-4,c=3","顶点 x=-b/(2a)=4/2=2","y=2²-4×2+3=-1","顶点：(2,-1)，对称轴：x=2"],"answer":"顶点(2,-1)，对称轴 x=2"},
                        {"question":"将 y=x² 向右平移 2 个单位、向上平移 3 个单位，求新函数","steps":["左加右减，上加下减","向右平移 2：y=(x-2)²","再向上平移 3：y=(x-2)²+3"],"answer":"y=(x-2)²+3"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-04-005").title("幂函数").subtitle("y=x^α，幂的王国")
                .domain("函数").level("高中").difficulty(3).sortOrder(500)
                .visualType("static").milestoneType(null)
                .summary("幂函数 y=x^α 是形式最简单的函数类之一，α 取不同值图像各异")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"形如 $y=x^\\alpha$（$\\alpha\\in\\mathbb{R}$）的函数叫幂函数。定义域和值域取决于 $\\alpha$。"},
                    {"type":"keypoints","title":"常见幂函数图像特征","items":[
                        "$\\alpha=1$：$y=x$ 过原点，直线（一次函数）",
                        "$\\alpha=2$：$y=x^2$ 抛物线，偶函数",
                        "$\\alpha=3$：$y=x^3$ 奇函数，在 $\\mathbb{R}$ 上递增",
                        "$\\alpha=0.5$：$y=\\sqrt{x}$，定义域 $x\\geq0$",
                        "$\\alpha=-1$：$y=1/x$ 双曲线，反比例函数"
                    ]},
                    {"type":"keypoints","title":"性质","items":[
                        "所有幂函数都过点 $(1,1)$",
                        "$\\alpha>0$ 时在 $(0,\\infty)$ 上单调递增",
                        "$\\alpha<0$ 时在 $(0,\\infty)$ 上单调递减",
                        "$\\alpha$ 为奇数时是奇函数，偶数时是偶函数"
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-04-006").title("指数函数").subtitle("y=a^x，指数增长与衰减")
                .domain("函数").level("高中").difficulty(3).sortOrder(600)
                .visualType("canvas").milestoneType(null)
                .summary("指数函数 y=a^x（a>0,a≠1），a>1 时爆炸增长，0<a<1 时趋于 0")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"形如 $y=a^x$（$a>0$ 且 $a\\neq1$）的函数叫指数函数。"},
                    {"type":"keypoints","title":"图像与性质","items":[
                        "定义域：$\\mathbb{R}$；值域：$(0,\\infty)$",
                        "必过点 $(0,1)$",
                        "$a>1$：单调递增，$x\\to-\\infty$ 时 $y\\to 0$（趋近 $x$ 轴）",
                        "$0<a<1$：单调递减，$x\\to+\\infty$ 时 $y\\to 0$",
                        "底数互为倒数时图像关于 $y$ 轴对称"
                    ]},
                    {"type":"keypoints","title":"指数运算法则","items":[
                        "$a^m\\cdot a^n=a^{m+n}$",
                        "$\\frac{a^m}{a^n}=a^{m-n}$",
                        "$(a^m)^n=a^{mn}$",
                        "$(ab)^n=a^n b^n$"
                    ]},
                    {"type":"analogy","title":"💡 指数爆炸","content":"传说中国王的棋盘中放入麦粒：第1格1粒，第2格2粒，第3格4粒……每格翻倍。第64格需要约922亿亿粒麦子，比全世界几千年的总产量还多。这就是指数增长的威力。"}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-04-007").title("对数函数").subtitle("y=log_a(x)，指数的逆运算")
                .domain("函数").level("高中").difficulty(3).sortOrder(700)
                .visualType("static").milestoneType(null)
                .summary("对数函数 y=log_a(x) 是指数函数 y=a^x 的反函数")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"形如 $y=\\log_a x$（$a>0$ 且 $a\\neq1$）的函数叫对数函数。$y=\\log_a x \\iff a^y=x$。"},
                    {"type":"keypoints","title":"图像与性质","items":[
                        "定义域：$(0,\\infty)$；值域：$\\mathbb{R}$",
                        "必过点 $(1,0)$",
                        "$a>1$：单调递增",
                        "$0<a<1$：单调递减",
                        "$x$ 轴是渐近线（$x\\to0^+$ 时 $y\\to-\\infty$）",
                        "与指数函数 $y=a^x$ 关于 $y=x$ 轴对称（互为反函数）"
                    ]},
                    {"type":"keypoints","title":"对数运算法则","items":[
                        "$\\log_a(MN)=\\log_a M+\\log_a N$",
                        "$\\log_a(\\frac{M}{N})=\\log_a M-\\log_a N$",
                        "$\\log_a M^n=n\\log_a M$",
                        "换底公式：$\\log_a b=\\frac{\\log_c b}{\\log_c a}$"
                    ]},
                    {"type":"keypoints","title":"常用对数","items":[
                        "常用对数 $\\lg x = \\log_{10} x$",
                        "自然对数 $\\ln x = \\log_e x$，其中 $e\\approx2.71828$",
                        "自然常数 $e$：$\\lim_{n\\to\\infty}(1+\\frac{1}{n})^n$"
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-04-008").title("三角函数").subtitle("圆的旋转之歌：sin, cos, tan")
                .domain("函数").level("高中").difficulty(4).sortOrder(800)
                .visualType("canvas").milestoneType(null)
                .summary("三角函数是描述周期运动的数学工具，sin 和 cos 是最基本的两个")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"在直角三角形中，锐角 $\\theta$ 的三角函数定义为：$\\sin\\theta=\\frac{\\text{对边}}{\\text{斜边}}$，$\\cos\\theta=\\frac{\\text{邻边}}{\\text{斜边}}$，$\\tan\\theta=\\frac{\\text{对边}}{\\text{邻边}}=\\frac{\\sin\\theta}{\\cos\\theta}$"},
                    {"type":"visualization","title":"单位圆上的三角函数","content":"在单位圆中，角 θ 的终边与圆的交点坐标为 (cos θ, sin θ)，直观展示两者关系",
                        "visual":{"type":"canvas","component":"trig-circle","config":{"initialAngle":45}}},
                    {"type":"keypoints","title":"诱导公式","items":[
                        "$\\sin(\\pi-\\theta)=\\sin\\theta$, $\\cos(\\pi-\\theta)=-\\cos\\theta$",
                        "$\\sin(\\frac{\\pi}{2}-\\theta)=\\cos\\theta$（互余关系）",
                        "$\\sin(-\\theta)=-\\sin\\theta$（奇函数）",
                        "$\\cos(-\\theta)=\\cos\\theta$（偶函数）"
                    ]},
                    {"type":"keypoints","title":"和差公式","items":[
                        "$\\sin(\\alpha\\pm\\beta)=\\sin\\alpha\\cos\\beta\\pm\\cos\\alpha\\sin\\beta$",
                        "$\\cos(\\alpha\\pm\\beta)=\\cos\\alpha\\cos\\beta\\mp\\sin\\alpha\\sin\\beta$",
                        "$\\tan(\\alpha\\pm\\beta)=\\frac{\\tan\\alpha\\pm\\tan\\beta}{1\\mp\\tan\\alpha\\tan\\beta}$"
                    ]},
                    {"type":"keypoints","title":"基本关系（平方关系）","items":[
                        "$\\sin^2\\theta+\\cos^2\\theta=1$",
                        "$1+\\tan^2\\theta=\\sec^2\\theta$"
                    ]},
                    {"type":"keypoints","title":"图像特征","items":[
                        "$y=\\sin x$：周期 $2\\pi$，值域 $[-1,1]$，奇函数",
                        "$y=\\cos x$：周期 $2\\pi$，值域 $[-1,1]$，偶函数",
                        "$y=\\tan x$：周期 $\\pi$，值域 $\\mathbb{R}$，有垂直渐近线"
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-04-099").title("函数 · 全景总结").subtitle("从常量到变量，从具体到抽象")
                .domain("函数").level("高中").difficulty(1).sortOrder(999)
                .visualType("static").milestoneType("domain_end")
                .summary("函数是变量之间的映射关系，是整个高中数学的基石")
                .contentJson("""
                {"sections":[
                    {"type":"keypoints","title":"函数的发展脉络","items":[
                        "基础：变量与函数概念 → 具体函数类型 → 函数性质研究",
                        "初等函数：一次 → 二次 → 反比例 → 幂指对 → 三角",
                        "核心主线：「一个变量如何随另一个变量变化」"
                    ]},
                    {"type":"keypoints","title":"跨领域联系","items":[
                        "方程 → 函数：$ax^2+bx+c=0$ 的解是 $y=ax^2+bx+c$ 的零点",
                        "不等式 → 函数：利用函数图像解不等式（数形结合）",
                        "几何 → 三角函数：角度与边长的关系",
                        "导数 → 函数：导数描述函数的变化率"
                    ]}
                ]}""")
                .status(1).build());

        for (KnowledgeNode node : nodes) nodeService.save(node);
        log.info("→ 创建 {} 个「函数」知识点节点", nodes.size());

        // ══════════════════════════════
        //  关系
        // ══════════════════════════════

        relations.add(relation("MATH-04-001", "MATH-04-002", "next", 1, "学完函数概念后学具体函数"));
        relations.add(relation("MATH-04-002", "MATH-04-001", "prerequisite", 1, ""));

        relations.add(relation("MATH-04-002", "MATH-04-003", "next", 2, "从正比到反比"));
        relations.add(relation("MATH-04-003", "MATH-04-001", "prerequisite", 1, ""));

        relations.add(relation("MATH-04-002", "MATH-04-004", "next", 3, "从直线到抛物线的跃迁"));
        relations.add(relation("MATH-04-004", "MATH-04-002", "prerequisite", 1, "二次函数需要一次函数基础"));
        relations.add(relation("MATH-04-004", "MATH-03-002", "reference", 1, "二次函数与一元二次方程紧密联系"));

        relations.add(relation("MATH-04-004", "MATH-04-005", "next", 4, "从具体到一般的幂函数"));
        relations.add(relation("MATH-04-005", "MATH-04-004", "prerequisite", 1, ""));

        relations.add(relation("MATH-04-005", "MATH-04-006", "next", 5, "幂函数过渡到指数函数"));
        relations.add(relation("MATH-04-006", "MATH-04-005", "prerequisite", 1, ""));

        relations.add(relation("MATH-04-006", "MATH-04-007", "next", 6, "指数与对数互为逆运算"));
        relations.add(relation("MATH-04-007", "MATH-04-006", "prerequisite", 1, "对数函数需要理解指数函数"));

        relations.add(relation("MATH-04-007", "MATH-04-008", "next", 7, "进入周期函数的领域"));
        relations.add(relation("MATH-04-008", "MATH-04-001", "prerequisite", 1, ""));

        // 跨领域
        relations.add(relation("MATH-02-006", "MATH-04-006", "reference", 1, "指数运算规则"));
        relations.add(relation("MATH-02-007", "MATH-04-007", "reference", 1, "对数定义与运算"));
        relations.add(relation("MATH-05-002", "MATH-04-008", "reference", 1, "三角形中的三角比"));

        // 全景总结
        relations.add(relation("MATH-04-099", "MATH-04-001", "summary_of", 1, ""));
        relations.add(relation("MATH-04-099", "MATH-04-002", "summary_of", 2, ""));
        relations.add(relation("MATH-04-099", "MATH-04-003", "summary_of", 3, ""));
        relations.add(relation("MATH-04-099", "MATH-04-004", "summary_of", 4, ""));
        relations.add(relation("MATH-04-099", "MATH-04-005", "summary_of", 5, ""));
        relations.add(relation("MATH-04-099", "MATH-04-006", "summary_of", 6, ""));
        relations.add(relation("MATH-04-099", "MATH-04-007", "summary_of", 7, ""));
        relations.add(relation("MATH-04-099", "MATH-04-008", "summary_of", 8, ""));

        for (KnowledgeRelation r : relations) relationService.save(r);
        log.info("→ 创建 {} 条「函数」知识点关系", relations.size());
    }

    private KnowledgeRelation relation(String from, String to, String type, int sort, String desc) {
        return KnowledgeRelation.builder()
                .fromNodeId(from).toNodeId(to)
                .relationType(type).sortOrder(sort).description(desc)
                .build();
    }
}
