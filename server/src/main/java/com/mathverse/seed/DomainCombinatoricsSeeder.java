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
 * 领域六：排列组合与统计
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DomainCombinatoricsSeeder {

    private final KnowledgeNodeService nodeService;
    private final KnowledgeRelationService relationService;

    public void seed() {
        List<KnowledgeNode> nodes = new ArrayList<>();
        List<KnowledgeRelation> relations = new ArrayList<>();

        // ══════════════════════════════
        //  知识点
        // ══════════════════════════════

        nodes.add(KnowledgeNode.builder()
                .id("MATH-06-001").title("计数原理").subtitle("分类加法与分步乘法")
                .domain("排列组合与统计").level("高中").difficulty(2).sortOrder(100)
                .visualType("static").milestoneType(null)
                .summary("分类加法计数原理 + 分步乘法计数原理 = 排列组合的两大基石")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"两大原理","content":"分类加法计数原理：做一件事有 $n$ 类方案，每类有 $m_i$ 种方法，总方法数为 $m_1+m_2+...+m_n$。\\n分步乘法计数原理：做一件事需分 $n$ 步，每步有 $m_i$ 种方法，总方法数为 $m_1\\\\times m_2\\\\times...\\\\times m_n$。"},
                    {"type":"keypoints","title":"核心区别","items":[
                        "分类加法：「或」的关系——要么这样，要么那样",
                        "分步乘法：「且」的关系——先这样，再那样",
                        "分类：任何一类都能独立完成目标",
                        "分步：所有步骤全部完成才算完成"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"从北京到上海，有 3 趟火车、2 趟飞机，共几种交通方式？","steps":["这是分类（或的关系）","3+2=5"],"answer":"5 种"},
                        {"question":"上衣有 4 件，裤子有 3 条，共几种穿搭？","steps":["这是分步（先穿上衣再穿裤子）","4×3=12"],"answer":"12 种"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-06-002").title("排列").subtitle("有序选取")
                .domain("排列组合与统计").level("高中").difficulty(3).sortOrder(200)
                .visualType("static").milestoneType(null)
                .summary("排列：从 n 个不同元素中取 m 个，顺序重要。符号 A(n,m)")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"从 $n$ 个不同元素中取 $m$ 个排成一列，叫排列。同排列数公式：$$A_n^m=n(n-1)(n-2)\\\\cdots(n-m+1)=\\\\frac{n!}{(n-m)!}$$"},
                    {"type":"keypoints","title":"重要概念","items":[
                        "全排列：$A_n^n=n!$（$n$ 个元素全部排列）",
                        "$0!=1$（规定）",
                        "排列的核心：顺序不同→结果不同"
                    ]},
                    {"type":"keypoints","title":"典型问题","items":[
                        "组队排序：3 人排成一排拍照，共有 $A_3^3=6$ 种",
                        "选派排列：10 人中选 3 人分别任班长、学委、体委",
                        "相邻问题：用「捆绑法」",
                        "不相邻问题：用「插空法」"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"5 名同学排成一排，甲不站两端，有多少种排法？","steps":["全部排列：A₅₅=120","甲在左端：A₄₄=24","甲在右端：A₄₄=24","120-24-24=72"],"answer":"72 种"},
                        {"question":"1-6 组成无重复数字的三位数，有多少个？","steps":["百位 6 种选择（1-6）","十位 5 种","个位 4 种","6×5×4=120"],"answer":"120 个"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-06-003").title("组合").subtitle("无序选取")
                .domain("排列组合与统计").level("高中").difficulty(3).sortOrder(300)
                .visualType("static").milestoneType(null)
                .summary("组合：从 n 个不同元素中取 m 个，顺序不重要。符号 C(n,m)")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"从 $n$ 个不同元素中取 $m$ 个组成一组（不计顺序），叫组合。组合数公式：$$C_n^m=\\\\frac{A_n^m}{A_m^m}=\\\\frac{n!}{m!(n-m)!}$$"},
                    {"type":"keypoints","title":"排列与组合的区别","items":[
                        "排列：顺序重要（排座位、冠亚季军）",
                        "组合：顺序不重要（选委员、买彩票号码）",
                        "排列 ÷ 全排列 = 组合：$C_n^m=A_n^m/m!$"
                    ]},
                    {"type":"keypoints","title":"组合的性质","items":[
                        "$C_n^m=C_n^{n-m}$（对称性）",
                        "$C_n^0=C_n^n=1$",
                        "$C_n^1=n$",
                        "帕斯卡公式：$C_{n+1}^m=C_n^m+C_n^{m-1}$"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"从 8 人中选 3 人组成小组，共几种选法？","steps":["顺序不重要，是组合问题","C₈³=8×7×6/(3×2×1)=56"],"answer":"56 种"},
                        {"question":"一副扑克牌（52 张）中抽 5 张，有多少种可能？","steps":["C₅₂⁵=52×51×50×49×48/120","=2,598,960"],"answer":"约 260 万种"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-06-004").title("二项式定理").subtitle("(a+b)ⁿ 展开的密码")
                .domain("排列组合与统计").level("高中").difficulty(3).sortOrder(400)
                .visualType("static").milestoneType(null)
                .summary("二项式定理揭示了 (a+b)ⁿ 展开式的系数规律——杨辉三角")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定理","content":"$$(a+b)^n=\\\\sum_{k=0}^n C_n^k a^{n-k}b^k$$ $$=C_n^0 a^n+C_n^1 a^{n-1}b+C_n^2 a^{n-2}b^2+\\\\cdots+C_n^n b^n$$"},
                    {"type":"keypoints","title":"杨辉三角（帕斯卡三角）","items":[
                        "第 0 行：1",
                        "第 1 行：1  1",
                        "第 2 行：1  2  1",
                        "第 3 行：1  3  3  1",
                        "第 4 行：1  4  6  4  1",
                        "每个数是上方两数之和"
                    ]},
                    {"type":"keypoints","title":"展开式特征","items":[
                        "共 $n+1$ 项",
                        "第 $k+1$ 项：$T_{k+1}=C_n^k a^{n-k}b^k$",
                        "系数 $C_n^k$ 具有对称性",
                        "所有系数之和：$C_n^0+C_n^1+...+C_n^n=2^n$"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"求 (x+2)⁴ 的展开式","steps":["C₄⁰x⁴+C₄¹x³·2+C₄²x²·4+C₄³x·8+C₄⁴·16","=x⁴+8x³+24x²+32x+16"],"answer":"x⁴+8x³+24x²+32x+16"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-06-005").title("概率").subtitle("随机世界中的确定性规律")
                .domain("排列组合与统计").level("高中").difficulty(3).sortOrder(500)
                .visualType("static").milestoneType(null)
                .summary("概率描述随机事件发生的可能性，取值 0 到 1 之间")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"事件 $A$ 的概率 $P(A)$ 是 $A$ 发生可能性大小的度量。古典概型：$P(A)=\\\\frac{\\\\text{事件}A\\\\text{包含的结果数}}{\\\\text{全部可能结果数}}$"},
                    {"type":"keypoints","title":"概率的性质","items":[
                        "$0\\\\leq P(A)\\\\leq 1$",
                        "$P(\\\\Omega)=1$（必然事件的概率为 1）",
                        "$P(\\\\varnothing)=0$（不可能事件的概率为 0）",
                        "$P(\\\\overline{A})=1-P(A)$（对立事件）"
                    ]},
                    {"type":"keypoints","title":"概率的运算","items":[
                        "互斥事件：$P(A\\\\cup B)=P(A)+P(B)$",
                        "任意事件：$P(A\\\\cup B)=P(A)+P(B)-P(A\\\\cap B)$",
                        "独立事件：$P(A\\\\cap B)=P(A)\\\\cdot P(B)$",
                        "条件概率：$P(B|A)=\\\\frac{P(A\\\\cap B)}{P(A)}$"
                    ]},
                    {"type":"keypoints","title":"常见分布","items":[
                        "两点分布（伯努利）：只有两个结果",
                        "二项分布：$n$ 次独立重复试验（$X\\\\sim B(n,p)$）",
                        "正态分布：钟形曲线（$X\\\\sim N(\\\\mu,\\\\sigma^2)$）"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"抛两枚硬币，至少一个正面的概率","steps":["全部可能：{正正,正反,反正,反反} 4 种","至少一个正面：{正正,正反,反正} 3 种","P=3/4"],"answer":"0.75"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-06-006").title("统计").subtitle("用数据看世界")
                .domain("排列组合与统计").level("高中").difficulty(2).sortOrder(600)
                .visualType("static").milestoneType(null)
                .summary("统计是从数据中提取信息的科学，核心是描述和推断")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"统计是收集、整理、分析数据的科学，用于从部分推断整体。"},
                    {"type":"keypoints","title":"描述统计","items":[
                        "均值（平均数）：$\\\\overline{x}=\\\\frac{1}{n}\\\\sum_{i=1}^n x_i$",
                        "中位数：数据排序后中间位置的数",
                        "众数：出现频率最高的数",
                        "方差：$\\\\sigma^2=\\\\frac{1}{n}\\\\sum(x_i-\\\\overline{x})^2$",
                        "标准差：$\\\\sigma=\\\\sqrt{\\\\sigma^2}$"
                    ]},
                    {"type":"keypoints","title":"抽样方法","items":[
                        "简单随机抽样：每个个体等概率被抽中",
                        "系统抽样：等间隔抽取",
                        "分层抽样：按比例从各层抽取"
                    ]},
                    {"type":"keypoints","title":"数据可视化","items":[
                        "条形图：分类数据比较",
                        "直方图：数值型数据分布",
                        "散点图：两个变量的关系",
                        "箱线图：数据的五数概括（最/大四分位/中位/四分位/最小）"
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-06-099").title("排列组合与统计 · 全景总结").subtitle("计数、概率与推断")
                .domain("排列组合与统计").level("高中").difficulty(1).sortOrder(999)
                .visualType("static").milestoneType("domain_end")
                .summary("排列组合是计数工具，概率是随机世界的语言，统计是从数据中发现规律")
                .contentJson("""
                {"sections":[
                    {"type":"keypoints","title":"知识脉络","items":[
                        "计数原理（两大基石）→ 排列（有序）→ 组合（无序）→ 二项式定理",
                        "古典概型 → 概率运算 → 随机变量 → 常见分布",
                        "数据收集 → 描述统计 → 统计推断"
                    ]},
                    {"type":"keypoints","title":"核心洞察","items":[
                        "排列组合是为概率服务的「计数工具」",
                        "概率是理论，统计是实践——概率推理想，统计说现实",
                        "大数定律：试验次数越多，频率越接近概率"
                    ]}
                ]}""")
                .status(1).build());

        for (KnowledgeNode node : nodes) nodeService.save(node);
        log.info("→ 创建 {} 个「排列组合与统计」知识点节点", nodes.size());

        // ══════════════════════════════
        //  关系
        // ══════════════════════════════

        relations.add(relation("MATH-06-001", "MATH-06-002", "next", 1, "计数原理是排列基础"));
        relations.add(relation("MATH-06-002", "MATH-06-001", "prerequisite", 1, ""));

        relations.add(relation("MATH-06-002", "MATH-06-003", "next", 2, "从有序到无序"));
        relations.add(relation("MATH-06-003", "MATH-06-001", "prerequisite", 1, ""));

        relations.add(relation("MATH-06-003", "MATH-06-004", "next", 3, "从组合数到二项式系数"));
        relations.add(relation("MATH-06-004", "MATH-06-003", "prerequisite", 1, ""));

        relations.add(relation("MATH-06-001", "MATH-06-005", "next", 4, "计数是概率的基础"));
        relations.add(relation("MATH-06-005", "MATH-06-002", "prerequisite", 1, "古典概型需要排列组合"));
        relations.add(relation("MATH-06-005", "MATH-06-003", "prerequisite", 1, ""));

        relations.add(relation("MATH-06-005", "MATH-06-006", "next", 5, "概率与统计密不可分"));
        relations.add(relation("MATH-06-006", "MATH-06-005", "prerequisite", 1, ""));

        // 跨领域
        relations.add(relation("MATH-07-001", "MATH-06-002", "reference", 1, "数列与排列的关联"));
        relations.add(relation("MATH-03-004", "MATH-06-005", "reference", 1, "方程组中的概率问题"));

        // 全景总结
        relations.add(relation("MATH-06-099", "MATH-06-001", "summary_of", 1, ""));
        relations.add(relation("MATH-06-099", "MATH-06-002", "summary_of", 2, ""));
        relations.add(relation("MATH-06-099", "MATH-06-003", "summary_of", 3, ""));
        relations.add(relation("MATH-06-099", "MATH-06-004", "summary_of", 4, ""));
        relations.add(relation("MATH-06-099", "MATH-06-005", "summary_of", 5, ""));
        relations.add(relation("MATH-06-099", "MATH-06-006", "summary_of", 6, ""));

        for (KnowledgeRelation r : relations) relationService.save(r);
        log.info("→ 创建 {} 条「排列组合与统计」知识点关系", relations.size());
    }

    private KnowledgeRelation relation(String from, String to, String type, int sort, String desc) {
        return KnowledgeRelation.builder()
                .fromNodeId(from).toNodeId(to)
                .relationType(type).sortOrder(sort).description(desc)
                .build();
    }
}
