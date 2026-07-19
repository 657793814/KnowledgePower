# 📐 LaTeX 公式完全指南

> 整合自 `docs/LaTeX-STANDARDS.md` + `doc/latex-formula-caveats.md`
> 最后更新：2026-07-19

---

## 目录

1. [标准规范](#一标准规范)
2. [渲染管线（renderFormula.ts）](#二渲染管线renderFormulats)
3. [自动检测后备机制](#三自动检测后备机制)
4. [渲染器的限制](#四渲染器的限制)
5. [踩坑记录](#五踩坑记录)
6. [最佳实践](#六最佳实践)
7. [常用 LaTeX 命令速查](#七常用-latex-命令速查)

---

## 一、标准规范

### 基本原则

**所有数学公式必须用 `$...$` 包裹。** 渲染器的 auto-detect 只是后备方案，不是标准流程。

### 行内公式（绝大多数场景）

```
✅ $y=kx+b$（$k \neq 0$）
✅ $S_n = s \cdot S_{n-1} - p \cdot S_{n-2}$
✅ $A \subseteq B \iff \forall x \in A, x \in B$
✅ $2^n$（$2^{|A|}$）
✅ $|k|$ 越大，直线越陡
```

### 分数

```
✅ $\frac{1}{4}$、$\frac{\sqrt{3}}{2}$
❌ 1/4、√3/2         ← 不渲染成上下分数形式
```

渲染器 auto-detect 会把 `1/4` → `$\frac{1}{4}$`，但只限安全上下文（句尾、括号后等）。

### 上标/下标

```
✅ $x^2$、$a_n$、$S_{n-1}$、$2^{|A|}$
✅ $x^{2} + y^{2}$（建议用 `^{}` 防歧义）
❌ x²、S_n           ← 纯文本，auto-detect 能救但不是标准
```

### Unicode 数学符号

```
✅ $\subseteq$、$\cup$、$\cap$、$\forall$、$\exists$
✅ $\to$、$\iff$、$\mapsto$
✅ $\pi$、$\alpha$、$\beta$
❌ ⊆、∪、∩、→       ← Unicode 字符，auto-detect 会转但慎用
```

### 根号

```
✅ $\sqrt{2}$、$\sqrt{a^2+b^2}$
✅ $\frac{\sqrt{3}}{2}$
❌ √2、√3/2          ← auto-detect 救但不标准
```

### 点乘/乘号

```
✅ $\cdot$（\cdot）
❌ ·（middle dot，auto-detect 转但不标准）
```

### 常用符号对照表

| 含义 | ❌ Unicode | ✅ LaTeX |
|------|-----------|---------|
| 全等 | ≌ | `\cong` |
| 相似 | ∽ | `\sim` |
| 三角形 | △ | `\triangle` |
| 角 | ∠ | `\angle` |
| 垂直 | ⊥ | `\perp` |
| 平行 | ∥ | `\parallel` |
| 近似 | ≈ | `\approx` |
| 不等于 | ≠ | `\neq` |
| 大于等于 | ≥ | `\geq` |
| 小于等于 | ≤ | `\leq` |
| 包含于 | ⊆ | `\subseteq` |
| 交集 | ∩ | `\cap` |
| 并集 | ∪ | `\cup` |
| 任意 | ∀ | `\forall` |
| 存在 | ∃ | `\exists` |
| 属于 | ∈ | `\in` |
| 映射到 | → | `\to` |
| π | π | `\pi` |
| α | α | `\alpha` |
| β | β | `\beta` |
| 圆周率 | π | `\pi` |

---

## 二、渲染管线（renderFormula.ts）

### 总体流程

```
输入文本
  ↓
1. 数据层预处理（convertUnicodeMath）
   └─ Unicode 数学符号映射（62 个）
   └─ Unicode 下标分组转换（Sₙ₋₁ → S_{n-1}）
   └─ Unicode 上标分组转换（0⁺ → 0^{+}）
   └─ Unicode 平方/立方 → ^{2}/^{3}
  ↓
2. 按 $...$ 分段（mapOutsideDollar）
   └─ 每步只处理 $...$ 外部文本，防止已包裹的 $ 被后续步骤破坏
  ↓
3. 六层后备检测依次执行（见第三节）
  ↓
4. KaTeX 渲染最终文本中的 $...$ 块
```

### 关键函数：`renderFormula(text: string): string`

- 对已用 `$...$` 包裹的内容直接传给 KaTeX 渲染
- 对未包裹的文本，依次应用 6 层后备检测
- 返回带 `$...$` 的 HTML（调用方用 `dangerouslySetInnerHTML`）

### 预览测试工具

```bash
# 快速验证渲染效果
cd web && node -e "
const { renderFormula } = require('./src/utils/renderFormula');
console.log(renderFormula('x²+1/x²=(x+1/x)²-2'));
"
```

---

## 三、自动检测后备机制

渲染器会对未用 `$...$` 包裹的内容做 6 层后备修复：

### P0：括号整体上标（2026-07-19 新增）

在 E1 分数之前先捕获 `(...)^{n}`，防止分数转换打散括号。

```
输入: (x+1/x)²-2
输出: $(x+1/x)^{2}$ -2
```

### A：Unicode 数学符号映射

将 Unicode 符号转为 LaTeX 命令（62 个字符映射表）。

```
输入: A ⊆ B ⇔ ∀x ∈ A, x ∈ B
输出: A $\subseteq$ B $\iff$ $\forall$ x $\in$ A, x $\in$ B
```

### B：Unicode 下标/上标分组转换（新增）

将 `Sₙ₋₁` 整体识别转换为 `S_{n-1}`，`0⁺` 转换为 `0^{+}`。

```
输入: Sₙ₋₁ = s · Sₙ₋₂
输出: $S_{n-1}$ = s · $S_{n-2}$
```

### C：LaTeX 命令识别

将裸写的 `\cdot`、`\cong`、`\triangle` 等包裹为 `$\cdot$`、`$\cong$`、`$\triangle$`。

```
输入: \triangle ABC \cong \triangle DEF
输出: $\triangle$ ABC $\cong$ $\triangle$ DEF
```

### D：Unicode √ 转 LaTeX

```
输入: √2、√(ab)、³√(x)
输出: $\sqrt{2}$、$\sqrt{ab}$、$\sqrt[3]{x}$
```

### E：裸露上标/下标自动包裹

```
输入: x² + y² = s² - 2p, S_n, 2^n
输出: $x^{2}$ + $y^{2}$ = $s^{2}$ - 2p, $S_n$, $2^{n}$
```

### F：分数自动识别（安全上下文）

```
输入: 若 x+1/x=k，求 x²+1/x²
输出: 若 x+ $\frac{1}{x}$ =k，求 $x^{2}$ + $\frac{1}{x^{2}}$
```

---

## 四、渲染器的限制

**auto-detect 无法处理的场景（必须数据层修）：**

| 场景 | 原因 |
|------|------|
| `x+y` | 无法区分数学与普通文本 |
| `y=kx+b` | 纯文本公式 |
| `(x+1/x)` 中 `x` 两个字体 | 单个字母无法判断是数学变量还是普通文字 |
| `f(x)=x²+2x+1` 中散装字母 | `x` 在普通文本中无法识别为数学表达式 |
| `1/(x+5)` 括号分母 | 复杂度太高，auto-detect 不处理 |

**解决方案：** 数据层直接使用 `$...$` 包裹所有公式。

---

## 五、踩坑记录

### 5.1 渲染管线 Bug 合集

#### Bug 1：相邻 `$...$` 合并 (已修复)

**现象:** `\triangle AEF \cong \triangle A'EF` → 第二个 `\triangle` 不渲染

**根因:** 自动检测包裹后产生产生 `$\cong$    $\triangle$` 相邻公式，然后这行代码

```typescript
.replace(/\$\s+\$/g, '$');  // ❌ 删除！
```

把 `$\cong$    $\triangle$` 中间的第二个 `$` 吞掉了。

**修复:** 删除此行。相邻公式独立渲染。

#### Bug 2：纯数字公式被跳过 (已修复)

**现象:** `$2217$`、`$2500$`、`$1999 + 199 + 19$` 应为 KaTeX 渲染，却显示带 `$` 的纯文本。

**根因:** 渲染管线中有两处判断：

```typescript
if (!isBlock && /^[\d.,%‰¥$€£\s·;:!?，。；：！？、……—·'"『』【】《》（）\-+]+$/.test(latex)) {
    result += '$' + latex + '$';  // ← 输出带$的纯文本！
    continue;
}
```

编写者意图是"纯数字/标点不需要 LaTeX 渲染"，但 KaTeX 渲染纯数字没有问题，这个判断反而跳过了正常的 LaTeX 内容。

**修复:** 删除两处判断逻辑，`throwOnError: false` 确保渲染失败有安全后备。

#### Bug 3：LaTeX 命令正则不完整

**现象:** 裸写的 `\cong`、`\triangle`、`\sim` 等没有自动包裹 `$...$`。

**修复:** 补齐 30+ 常用 LaTeX 命令到正则中（见第七节命令速查）。

#### Bug 4：`(x+1/x)²` 中 `)^{2}` 变成 `^{2}-2` 原始文本

**根因:** 分数转换（E1）先将 `1/x` 转为 `$\frac{1}{x}$`，括号被打散后 `)^{2}` 孤立，上标正则无法匹配。

**修复:** 新增 **P0 步骤**：在 E1 之前先捕获 `(...)^{n}` → `$(...)^{n}$`。

#### Bug 5：`y²` 不渲染

**根因:** Unicode `²` → `^{2}` 后，上标正则只匹配字母开头（`[a-zA-Z]`），`y` 匹配后加花括号时格式错误。

**修复:** E2 支持 `[a-zA-Z0-9]+` 开头 + 括号后缀 `)`。

#### Bug 6：正则 `$1` 被 JS `$$` 转义吞噬

**根因:** 字符串中 `' $' + '$1_{$2}' + '$ '` → `$$` 被 JS 解析为字面 `$`，`$1`/`$2` 引用丢失。

**修复:** 改用函数回调形式：`(_, l, d) => ' $' + l + '_{' + d + '}$ '`。

#### Bug 7：LaTeX 关键字顺序敏感

**根因:** 正则 `subset|subseteq` → `\subseteq` 被先匹配 `\subset` 吃掉。

**修复:** 全部加 `\b` 字边界，且由正则自身按长度自动优先匹配。

#### Bug 8：嵌套花括号不匹配

**根因:** `{sqrt{nested}}` 内部带花括号 → 旧正则 `{[^{}]*}` 无法匹配。

**修复:** `{[^{}]*(?:\{[^{}]*\}[^{}]*)*}` 支持一级嵌套。

#### Bug 9：`x+1/x=k` 中 `=` 后不匹配

**根因:** 分数正则 lookahead 缺 `=`，`1/x=k` 的 `x` 后面跟 `=` 不被识别。

**修复:** 分数正则 lookahead 加 `=`。

#### Bug 10：裸字母匹配 E3 太激进（已删除）

**现象:** `(x+1/x)` 中的 `(x` 被拆成 `($x$`，破坏表达式结构。

**修复:** 完全删除 E3 步骤。单个字母变量在数学表达式中无法由 auto-detect 统一处理，必须数据层用 `$x+\frac{1}{x}$` 包裹。

### 5.2 种子数据 Bug

#### Bug 11：Unicode 符号替代 LaTeX 命令

**现象:** 种子数据大量使用 Unicode 符号 `≌`、`∽`、`△` 代替 `\cong`、`\sim`、`\triangle`。

**修复:** 种子数据统一改用标准 LaTeX 命令 + 渲染器 auto-detect 覆盖 62 个 Unicode 符号映射。

#### Bug 12：seedModelQuestions 非幂等

**现象:** 种子任务重新运行时只 `skip` 已存在的题目，旧数据无法被覆盖修复。

**修复:** 改为 `findThenUpdateOrCreate` 模式，重新运行可覆盖数据。

#### Bug 13：`bulk-questions.ts` 一键清空

**文件:** `node-server/scripts/bulk-questions.ts` 第 280-282 行

```typescript
await prisma.examQuestion.deleteMany({});  // 🚨 跑这个脚本会清空所有题目！
```

**注意:** 跑之前必须确认数据已备份。

#### Bug 14：`倒数型忘了减 2` 原始公式

**现象:** 种子数据用纯 Unicode 未包裹 `$...$`：`x²+1/x²=(x+1/x)²-2`

**修复:** DB 修复为 `$x^2+\frac{1}{x^2} = (x+\frac{1}{x})^2 - 2$`。

### 5.3 前端调用 Bug

#### Bug 15：KnowledgeDetail hint 未渲染

**现象:** `{ex.hint}` 直接输出原始 LaTeX 文本（带 `$` 符号）。

**根因:** 第 136 行 `{ex.hint}` 没有调用 `renderFormula()`。

**修复:** 改用 `<span dangerouslySetInnerHTML={{ __html: renderFormula(ex.hint) }} />`。

#### Bug 16：KnowledgeDetail 题目答案未渲染

**现象:** `{q.answer}` 直接输出原始文本。

**修复:** 同理，要用 `renderFormula(q.answer)`。

#### 检查清单

| 字段 | 文件 | 状态 |
|------|------|:----:|
| `ex.hint` | KnowledgeDetail.tsx | ✅ 已修复 |
| `q.answer` | KnowledgeDetail.tsx | ✅ 已修复 |
| `ex.answer` | KnowledgeDetail.tsx | ✅ 已使用 |
| `ex.question` | KnowledgeDetail.tsx | ✅ 已使用 |
| `section.content` | KnowledgeDetail.tsx | ✅ 已使用 |
| `item.correctAnswer` | WrongBookPage.tsx | ✅ 已使用 |
| `d.correctAnswer` | PracticePage.tsx | ✅ 已使用 |
| `q.title` | PracticePage.tsx | ✅ 已使用 |

### 5.4 批量出题脚本 Bug

#### Bug 17：`generateWrongAnswers` 将枚举题号当数字替换

**现象:** 枚举型答案 `(1)3.14（3个有效数字）(2)3.142（4个有效数字）` 中的 `(1)` 被数字替换，产生无意义干扰项。

**根因:**
```typescript
const numMatch = correct.match(/(\d+(\.\d+)?)/);
// numMatch[1] = "1" —— 来自 (1) 的题号，不是答案数字！
```

**防御（两处）：**

1. `generateWrongAnswers` 顶层守卫（含 `(1)` 且长度 > 15 → 跳过）
2. `genChoiceFromExamples` 入口守卫（同上）
3. 数字提取前 strip 题号前缀 `const stripped = correct.replace(/^\(\d+\)\s*/, '').trim()`

#### 判断准则：什么是可出选择题的答案？

| 适合 | 不适合 |
|------|--------|
| `3.14`、`8×10⁶`、`x=4` | `(1)3.14（3个有效数字）(2)3.142（4个有效数字）` |
| 单一数值/表达式 | 包含 `(1)`、`(2)` 编号且长度 > 15 |

---

## 六、最佳实践

### 6.1 数据层

1. **种子数据中始终使用标准 LaTeX 命令**，不使用 Unicode 数学符号
   - ✅ `\cong` ❌ `≌`  ✅ `\triangle` ❌ `△`
2. **有公式的地方尽量用 `$...$` 包裹**，让渲染器能明确识别边界
   - ✅ `折叠后 $\triangle ABD \cong \triangle CDE$`
   - ✅ 不回显公式时用：`D. \triangle AEF \cong \triangle A'EF`（依赖自动检测）
3. **种子脚本必须幂等**，支持重复执行覆盖数据
4. **auto-detect 是后备，不是标准方案**——数据层应该主动用 `$...$`
5. **所有用到 `dangerouslySetInnerHTML` 的地方**，都要套 `renderFormula()`

### 6.2 渲染层

1. **所有通过 `dangerouslySetInnerHTML` 渲染的内容**都要经过 `renderFormula()`
2. **不要合并相邻 `$...$` 公式**，每个公式独立渲染
3. **不要让 KaTeX 跳过纯数字渲染**，KaTeX 处理纯数字没有问题
4. **`latexCommandRegex` 正则要覆盖所有可能出现在裸文本中的 LaTeX 命令**
5. **步骤顺序至关重要：** 括号整体 → 复杂命令 → 分数 → 简单上标

### 6.3 生成层

1. **带编号枚举的答案不适合出选择题**，在 `generateWrongAnswers` 或 `genChoiceFromExamples` 中过滤
2. **`generateWrongAnswers` 的正则替换要留意 `(N)` 编号前缀**，替换前先去前缀
3. **非纯数字/字母答案的干扰项生成需要更智能**，当前用简单数字替换 + 通用文字的模式比较粗糙

### 6.4 前端的 `renderFormula` 检查清单

新建页面/组件时，检查以下字段是否调用了 `renderFormula()`：

- `item.title` / `q.title`（题目标题）
- `item.content` / `section.content`（内容文本）
- `ex.question` / `ex.answer` / `ex.hint`（例题题干/答案/提示）
- `q.answer` / `q.correctAnswer` / `correctAnswer`（答案字段）
- `parse.*`（解析内容）
- 任何可能包含数学公式的纯文本字段

---

## 七、常用 LaTeX 命令速查

### 格式命令

| 命令 | 效果 | 示例 |
|------|------|------|
| `\frac{a}{b}` | 分数 | $\frac{a}{b}$ |
| `\sqrt{x}` | 平方根 | $\sqrt{x}$ |
| `\sqrt[n]{x}` | n 次根号 | $\sqrt[n]{x}$ |
| `\cdot` | 点乘 | $\cdot$ |
| `\circ` | 圆圈 | $\circ$ |

### 希腊字母

| 命令 | 效果 | 命令 | 效果 |
|------|------|------|------|
| `\alpha` | $\alpha$ | `\beta` | $\beta$ |
| `\gamma` | $\gamma$ | `\delta` | $\delta$ |
| `\epsilon` | $\epsilon$ | `\zeta` | $\zeta$ |
| `\eta` | $\eta$ | `\theta` | $\theta$ |
| `\iota` | $\iota$ | `\kappa` | $\kappa$ |
| `\lambda` | $\lambda$ | `\mu` | $\mu$ |
| `\nu` | $\nu$ | `\xi` | $\xi$ |
| `\pi` | $\pi$ | `\rho` | $\rho$ |
| `\sigma` | $\sigma$ | `\tau` | $\tau$ |
| `\upsilon` | $\upsilon$ | `\phi` | $\phi$ |
| `\chi` | $\chi$ | `\psi` | $\psi$ |
| `\omega` | $\omega$ | | |

### 大写希腊字母

| 命令 | 效果 |
|------|------|
| `\Delta` | $\Delta$ |
| `\Gamma` | $\Gamma$ |
| `\Theta` | $\Theta$ |
| `\Lambda` | $\Lambda$ |
| `\Xi` | $\Xi$ |
| `\Pi` | $\Pi$ |
| `\Sigma` | $\Sigma$ |
| `\Phi` | $\Phi$ |
| `\Psi` | $\Psi$ |
| `\Omega` | $\Omega$ |

### 函数/运算符

| 命令 | 效果 |
|------|------|
| `\sin`, `\cos`, `\tan` | 三角函数 |
| `\log`, `\ln`, `\exp` | 对数/指数 |
| `\infty` | $\infty$ |
| `\sum` | $\sum$ |
| `\prod` | $\prod$ |
| `\int` | $\int$ |
| `\oint` | $\oint$ |
| `\lim` | $\lim$ |

### 特殊符号

| 命令 | 效果 | 命令 | 效果 |
|------|------|------|------|
| `\cong` | $\cong$ | `\triangle` | $\triangle$ |
| `\sim` | $\sim$ | `\perp` | $\perp$ |
| `\angle` | $\angle$ | `\approx` | $\approx$ |
| `\neq` | $\neq$ | `\geq` | $\geq$ |
| `\leq` | $\leq$ | `\prime` | $\prime$ |
| `\rightarrow` | $\rightarrow$ | `\Rightarrow` | $\Rightarrow$ |
| `\leftarrow` | $\leftarrow$ | `\Leftarrow` | $\Leftarrow$ |
| `\subset` | $\subset$ | `\supset` | $\supset$ |
| `\subseteq` | $\subseteq$ | `\supseteq` | $\supseteq$ |
| `\cup` | $\cup$ | `\cap` | $\cap$ |
| `\vee` | $\vee$ | `\wedge` | $\wedge$ |
| `\oplus` | $\oplus$ | `\otimes` | $\otimes$ |
| `\emptyset` | $\emptyset$ | `\forall` | $\forall$ |
| `\exists` | $\exists$ | `\nabla` | $\nabla$ |
| `\partial` | $\partial$ | `\propto` | $\propto$ |
| `\dots` | $\dots$ | `\cdots` | $\cdots$ |
| `\vdots` | $\vdots$ | `\ddots` | $\ddots$ |

---

## 附录：renderFormula.ts 处理步骤最终版

最终版 `renderFormula.ts v4` 处理管线（7 步）：

| 步骤 | 名称 | 作用 | 引入原因 |
|:----:|------|------|---------|
| **P0** | 括号整体上标 | `(x+1/x)²` → `$(x+1/x)^{2}$` | Bug 4：E1 分数打散括号 |
| **A** | Unicode 映射 | 62 个 Unicode 符号 → LaTeX | Bug 11：种子数据混用 Unicode |
| **B** | Unicode 分组转换 | `Sₙ₋₁` → `S_{n-1}`，`0⁺` → `0^{+}` | 种子数据大量 Unicode 下标/上标 |
| **C** | LaTeX 命令识别 | `\cong` → `$\cong$` | Bug 3：命令正则不完整 |
| **D** | √ → `\sqrt` | `√2` → `$\sqrt{2}$` | 种子数据用 √ |
| **E** | 裸露上标/下标 | `x²` → `$x^{2}$`，`S_n` → `$S_n$` | Bug 5：y² 不渲染 |
| **F** | 分数自动识别 | `1/x` → `$\frac{1}{x}$` | 种子数据用 `1/x` 非分数形式 |

**核心技术：** 每步通过 `mapOutsideDollar(text, fn)` 安全分段，只处理 `$...$` 外部文本，防止前一步加的 `$` 被后一步破坏。

---

> 相关文件：`web/src/utils/renderFormula.ts` | `docs/LaTeX-STANDARDS.md`（旧） | `doc/latex-formula-caveats.md`（旧）
