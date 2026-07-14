/**
 * 全局 LaTeX 公式渲染工具
 * 用 KaTeX 渲染 $...$（行内）和 $$...$$（块级）公式
 */
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * 将文本中的 LaTeX 公式渲染为 HTML
 * @param text 包含 $...$ 或 $$...$$ 的文本
 * @returns 渲染后的 HTML 字符串
 */
export function renderFormula(text: string): string {
  if (!text) return '';

  // 块级公式 $$...$$ —— 先处理，避免被行内公式的正则劫持
  let html = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, latex: string) => {
    try {
      return katex.renderToString(latex.trim(), {
        throwOnError: false,
        displayMode: true,
        output: 'html',
      });
    } catch {
      return `<code>$${latex.trim()}$$</code>`;
    }
  });

  // 行内公式 $...$（跳过纯数字/标点的误匹配）
  html = html.replace(/\$([\s\S]*?)\$/g, (_, latex: string) => {
    const trimmed = latex.trim();
    // 纯数字/标点符号/货币符号等不当作公式
    if (!trimmed || /^[\d.,%‰¥$€£\s·;:!?，。；：！？、……—·'"『』【】《》（）\-+]+$/.test(trimmed)) {
      return `$${trimmed}$`;
    }
    try {
      return katex.renderToString(trimmed, {
        throwOnError: false,
        displayMode: false,
        output: 'html',
      });
    } catch {
      // 渲染失败时回退为蓝色斜体
      return `<span style="color:#3B82F6;font-style:italic">${trimmed}</span>`;
    }
  });

  return html;
}
