/**
 * 全局 LaTeX 公式渲染工具
 * 用 KaTeX 渲染 $...$（行内）和 $$...$$（块级）公式
 * 
 * 安全处理：
 * - $...$ 段内的 < 和 > 由 KaTeX 处理为数学符号
 * - 非公式文本中的 < 和 > 被 HTML 转义，防止被当作标签
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
 * @param text 包含 $...$ 或 $$...$$ 的文本
 * @returns 渲染后的 HTML 字符串（可直接用于 dangerouslySetInnerHTML）
 */
export function renderFormula(text: string): string {
  if (!text) return '';

  // 用循环逐一匹配，确保非公式文本被正确转义
  const regex = /\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g;
  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // 匹配前的文本 → HTML 转义
    result += escapeHtml(text.slice(lastIndex, match.index));

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
      // 渲染失败：蓝色斜体回退
      result += `<span style="color:#3B82F6;font-style:italic">\$${latex}\$</span>`;
    }

    lastIndex = match.index + match[0].length;
  }

  // 剩余文本 → HTML 转义
  result += escapeHtml(text.slice(lastIndex));

  return result;
}
