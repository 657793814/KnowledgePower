/**
 * 全局 LaTeX 公式渲染工具
 * 用 KaTeX 渲染 $...$（行内）和 $$...$$（块级）公式
 * 
 * 安全处理：
 * - $...$ 段内的 < 和 > 由 KaTeX 处理为数学符号
 * - 非公式文本中的 < 和 > 被 HTML 转义，防止被当作标签
 * 
 * 改进 v2：
 * - 支持 `\$`（LaTeX 转义美元符号）在 $...$ 内部
 * - 支持 \\\(...\\\) 和 \\\[...\\\]（JSON 双转义版）
 * - 更安全的后备显示（失败时用不同颜色区分）
 */
import katex from 'katex';
import 'katex/dist/katex.min.css';

/** HTML 转义：防止 < > & 被误解析为 HTML 标签/实体 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 将文本中的 LaTeX 公式渲染为 HTML
 * 支持分隔符：$...$（行内）、$$...$$（块级）、\(...\)（行内）、\[...\]（块级）
 * @param text 包含 LaTeX 公式的文本
 * @returns 渲染后的 HTML 字符串（可直接用于 dangerouslySetInnerHTML）
 */
export function renderFormula(text: string): string {
  if (!text) return '';

  // 统一预处理：将各种 LaTeX 定界符转为 $...$ 和 $$...$$
  let normalized = text
    // \\[ ... \\] → $$ ... $$ (双反斜杠版，来自 JSON 转义)
    .replace(/\\\\\[([\s\S]*?)\\\\\]/g, '$$\n$1\n$$')
    // \\\( ... \\\) → $ ... $ (双反斜杠版)
    .replace(/\\\\\(([\s\S]*?)\\\\\)/g, '$$1$')
    // \[ ... \] → $$ ... $$ (普通版)
    .replace(/\\\[([\s\S]*?)\\\]/g, '$$\n$1\n$$')
    // \( ... \) → $ ... $ (普通版)
    .replace(/\\\(([\s\S]*?)\\\)/g, '$$1$');

  // 正则匹配：$$...$$（块级优先），$...$（行内）
  // 行内使用 ((?:[^$\\]|\\.)+?) 处理 \$ 转义
  const regex = /\$\$([\s\S]*?)\$\$|\$((?:[^$\\]|\\.)+?)\$/g;
  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(normalized)) !== null) {
    // 匹配前的文本 → HTML 转义
    result += escapeHtml(normalized.slice(lastIndex, match.index));

    const isBlock = match[1] !== undefined;
    const latex = (isBlock ? match[1] : match[2]).trim();

    // 空内容：原样保留 $$ 或 $
    if (!latex) {
      result += isBlock ? '$$' : '$';
      lastIndex = match.index + match[0].length;
      continue;
    }

    // 行内公式：纯数字/标点/货币 → 不作为公式
    if (!isBlock && /^[\d.,%‰¥$€£\s·;:!?，。；：！？、……—·'"『』【】《》（）\-+]+$/.test(latex)) {
      result += '$' + latex + '$';
      lastIndex = match.index + match[0].length;
      continue;
    }

    try {
      result += katex.renderToString(latex, {
        throwOnError: false,
        displayMode: isBlock,
        output: 'html',
      });
    } catch {
      // 渲染失败：蓝色斜体回退，显示公式原始内容
      // 使用红色边框标注让用户知道这里有公式但渲染失败
      result += `<span style="color:#3B82F6;font-style:italic;border-bottom:1px dashed #3B82F6;cursor:help" title="LaTeX: ${escapeHtml(latex)}">`
             + `\\(${escapeHtml(latex)}\\)</span>`;
    }

    lastIndex = match.index + match[0].length;
  }

  // 剩余文本
  const remaining = normalized.slice(lastIndex);

  // 处理没有被定界符包裹的 LaTeX 公式
  // 先将双反斜杠转为单反斜杠（处理 JSON 转义问题）
  const normalizedRemaining = remaining.replace(/\\\\/g, '\\');

  // 使用一个大正则表达式一次性匹配所有可能的 LaTeX 命令
  const latexCommandRegex = /\\(frac\s*\{[^{}]*\}\s*\{[^{}]*\}|sqrt\s*\{[^}]*\}|alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|rho|sigma|tau|upsilon|phi|chi|psi|omega|Delta|Gamma|Theta|Lambda|Xi|Pi|Sigma|Phi|Psi|Omega|sin|cos|tan|log|ln|exp|infty|sum|prod|int|oint|lim|pi)/g;

  let processed = normalizedRemaining.replace(latexCommandRegex, (match) => {
    return ` $${match}$ `;
  })
    // 处理下标和上标
    .replace(/([a-zA-Z])_(\d+)/g, '$1_{$2}')
    .replace(/([a-zA-Z])\^(\d+)/g, '$1^{$2}')
    // 处理分数形式 a/b 后面跟数字或字母（简单形式）
    .replace(/(\d+)\/(\d+)(?=\s|$|\))/g, ' $\\frac{$1}{$2}$ ')
    // 合并相邻的 $...$ 块
    .replace(/\$\s+\$/g, '$');

  // 重新对处理后的文本应用公式渲染
  const reprocessRegex = /\$\$([\s\S]*?)\$\$|\$((?:[^$\\]|\\.)+?)\$/g;
  let finalResult = '';
  let lastMatchIndex = 0;
  let latexMatch: RegExpExecArray | null;

  while ((latexMatch = reprocessRegex.exec(processed)) !== null) {
    finalResult += escapeHtml(processed.slice(lastMatchIndex, latexMatch.index));
    const isBlock = latexMatch[1] !== undefined;
    const latex = (isBlock ? latexMatch[1] : latexMatch[2]).trim();
    if (!latex) {
      finalResult += isBlock ? '$$' : '$';
      lastMatchIndex = latexMatch.index + latexMatch[0].length;
      continue;
    }
    if (!isBlock && /^[\d.,%‰¥$€£\s·;:!?，。；：！？、……—·'"『』【】《》（）\-+]+$/.test(latex)) {
      finalResult += '$' + latex + '$';
      lastMatchIndex = latexMatch.index + latexMatch[0].length;
      continue;
    }
    try {
      finalResult += katex.renderToString(latex, {
        throwOnError: false,
        displayMode: isBlock,
        output: 'html',
      });
    } catch {
      finalResult += `<span style="color:#3B82F6;font-style:italic;border-bottom:1px dashed #3B82F6;cursor:help" title="LaTeX: ${escapeHtml(latex)}">`
             + `\\(${escapeHtml(latex)}\\)</span>`;
    }
    lastMatchIndex = latexMatch.index + latexMatch[0].length;
  }
  finalResult += escapeHtml(processed.slice(lastMatchIndex));

  return result + finalResult;
}
