/**
 * 全局 LaTeX 公式渲染工具
 * v4 — 全面数据层 LaTeX 修复
 */
import katex from 'katex';
import 'katex/dist/katex.min.css';

function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// ════════════════════════════════════════════
// Unicode → LaTeX 映射
// ════════════════════════════════════════════

const SYM: Record<string, string> = {
  '\u00B7':'\\cdot ','\u00D7':'\\times ','\u00F7':'\\div ','\u2212':'-',
  '\u2192':'\\to ','\u2190':'\\leftarrow ','\u21D2':'\\Rightarrow ',
  '\u21D0':'\\Leftarrow ','\u21D4':'\\iff ',
  '\u2264':'\\le ','\u2265':'\\ge ','\u2260':'\\ne ','\u2248':'\\approx ',
  '\u2261':'\\equiv ','\u223C':'\\sim ','\u221D':'\\propto ','\u22A5':'\\perp ',
  '\u2220':'\\angle ','\u2225':'\\parallel ',
  '\u2208':'\\in ','\u2209':'\\notin ',
  '\u2286':'\\subseteq ','\u2287':'\\supseteq ','\u2282':'\\subset ','\u2283':'\\supset ',
  '\u2288':'\\nsubseteq ',
  '\u2229':'\\cap ','\u222A':'\\cup ',
  '\u2205':'\\emptyset ','\u2200':'\\forall ','\u2203':'\\exists ','\u2201':'\\complement ',
  '\u221E':'\\infty ',
  '\u220F':'\\prod ','\u2211':'\\sum ','\u222B':'\\int ',
  '\u2234':'\\therefore ',
  '\u22C8':'\\bowtie ',
  '\u25B3':'\\triangle ','\u22BF':'\\triangle ',
  '\u03C0':'\\pi ','\u03B1':'\\alpha ','\u03B2':'\\beta ','\u03B3':'\\gamma ',
  '\u03B4':'\\delta ','\u03B5':'\\epsilon ','\u03B8':'\\theta ',
  '\u03BB':'\\lambda ','\u03BC':'\\mu ','\u03C3':'\\sigma ','\u03C6':'\\phi ',
  '\u03C9':'\\omega ',
  '\u0393':'\\Gamma ','\u0394':'\\Delta ','\u0398':'\\Theta ',
  '\u039B':'\\Lambda ','\u039E':'\\Xi ','\u03A0':'\\Pi ',
  '\u03A3':'\\Sigma ','\u03A6':'\\Phi ','\u03A8':'\\Psi ','\u03A9':'\\Omega ',
};

const SUB_CH: Record<string, string> = {
  '\u2080':'0','\u2081':'1','\u2082':'2','\u2083':'3',
  '\u2084':'4','\u2085':'5','\u2086':'6','\u2087':'7',
  '\u2088':'8','\u2089':'9','\u208A':'+','\u208B':'-',
  '\u2090':'a','\u2091':'e','\u2093':'x','\u2092':'o',
  '\u2095':'h','\u2096':'k','\u2097':'l','\u2098':'m',
  '\u2099':'n','\u209A':'p','\u209B':'s','\u209C':'t',
};

const SUP_CH: Record<string, string> = {
  '\u2070':'0','\u2074':'4','\u2075':'5','\u2076':'6','\u2077':'7','\u2078':'8','\u2079':'9',
  '\u207A':'+','\u207B':'-',
  '\u2071':'i','\u207F':'n',
  '\u00B9':'1','\u00B2':'2','\u00B3':'3',
};

const SYM_RE = /[\u00B7\u00D7\u00F7\u2212\u2190-\u21FF\u2200-\u22FF\u2282-\u2289\u25B3\u22BF\u03B1-\u03C9\u0393\u0394\u0398\u039B\u039E\u03A0\u03A3\u03A6\u03A8\u03A9]/g;
const SUB_RE = /[\u2080-\u209C]+/g;
const SUP_RE = /[\u2070\u2071\u2074-\u207F\u00B9\u00B2\u00B3]+/g;

function convertUnicodeMath(s: string): string {
  s = s.replace(SYM_RE, m => SYM[m] ?? m);
  s = s.replace(SUB_RE, m => {
    let r = '';
    for (const c of m) r += SUB_CH[c] ?? c;
    return '_{' + r + '}';
  });
  s = s.replace(SUP_RE, m => {
    let r = '';
    for (const c of m) r += SUP_CH[c] ?? c;
    return '^{' + r + '}';
  });
  return s;
}

// ════════════════════════════════════════════
// LaTeX 关键字
// ════════════════════════════════════════════

const LATEX_CMDS = [
  'alpha','beta','gamma','delta','epsilon','zeta','eta','theta',
  'iota','kappa','lambda','mu','nu','xi','omicron','rho','sigma',
  'tau','upsilon','phi','chi','psi','omega',
  'Delta','Gamma','Theta','Lambda','Xi','Pi','Sigma','Phi','Psi','Omega',
  'sin','cos','tan','cot','sec','csc','arcsin','arccos','arctan',
  'sinh','cosh','tanh',
  'log','ln','lg','exp',
  'cdot','circ','div','times','pm','mp','ast','star',
  'wedge','vee','oplus','otimes','odot','ominus',
  'sum','prod','int','oint','lim','iint','iiint',
  'infty','nabla','partial','prime',
  'to','mapsto','iff','implies',
  'rightarrow','Rightarrow','leftarrow','Leftarrow',
  'leftrightarrow','Leftrightarrow',
  'uparrow','downarrow','updownarrow',
  'longrightarrow','Longrightarrow',
  'longleftarrow','Longleftarrow','longleftrightarrow','Longleftrightarrow',
  'subset','supset','subseteq','supseteq',
  'subsetneq','supsetneq',
  'nsubseteq','nsupseteq','nsubset','nsupset',
  'in','notin','ni','owns',
  'cup','cap','sqcup','sqcap','setminus',
  'emptyset','varnothing',
  'forall','exists','nexists',
  'land','lor','lnot','neg',
  'equiv','simeq','cong','approx','sim','propto','bowtie',
  'neq','ne','geq','leq','le','ge','ll','gg',
  'perp','parallel','mid','nmid','models',
  'angle','measuredangle','triangle','triangledown',
  'because','therefore','varpropto',
  'colon','dots','cdots','vdots','ddots','iddots',
  'hat','bar','dot','ddot','tilde','vec','check','acute','grave',
  'breve','mathring','widehat','widetilde',
  'overbrace','underbrace','overset','underset',
  'overline','underline','overrightarrow','overleftrightarrow',
  'operatorname','text','boxed','cancel','sout',
  'xrightarrow','xleftarrow',
  'limits','nolimits','displaystyle','textstyle',
  'left','right','big','bigg','Big','Bigg',
  'bigl','bigr','biggl','biggr',
  'mathcal','mathbb','mathrm','mathbf','mathit','mathsf','mathtt',
];
const CMD_RE = new RegExp('\\\\(?:' + LATEX_CMDS.join('|') + ')\\b', 'g');
const FRAC_SQRT_RE = /\\(frac\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|sqrt\s*(?:\[[^\]]*\])?\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/g;

// ════════════════════════════════════════════
// 安全分段处理
// ════════════════════════════════════════════

function mapOutsideDollar(text: string, fn: (t: string) => string): string {
  const parts = text.split(/(\$[^$]*\$)/g);
  for (let i = 0; i < parts.length; i += 2) {
    parts[i] = fn(parts[i]);
  }
  return parts.join('');
}

// ════════════════════════════════════════════
// 主函数
// ════════════════════════════════════════════

export function renderFormula(text: string): string {
  if (!text) return '';

  // === 第一遍：$...$ 渲染 ============================
  let normalized = text
    .replace(/\\\\\[([\s\S]*?)\\\\\]/g, '$$\n$1\n$$')
    .replace(/\\\\\(([\s\S]*?)\\\\\)/g, '$$1$')
    .replace(/\\\[([\s\S]*?)\\\]/g, '$$\n$1\n$$')
    .replace(/\\\(([\s\S]*?)\\\)/g, '$$1$');

  const DOLLAR_RE = /\$\$([\s\S]*?)\$\$|\$((?:[^$\\]|\\.)+?)\$/g;
  let result = '';
  let lastIndex = 0;
  let m;

  while ((m = DOLLAR_RE.exec(normalized)) !== null) {
    result += escapeHtml(normalized.slice(lastIndex, m.index));
    const block = m[1] !== undefined;
    let latex = (block ? m[1] : m[2]).trim();
    if (!latex) { result += block ? '$$' : '$'; lastIndex = m.index + m[0].length; continue; }
    latex = latex.replace(/\u00B0/g, '^\\circ');
    try { result += katex.renderToString(latex, { throwOnError: false, displayMode: block, output: 'html' }); }
    catch {
      result += '<span style="color:#3B82F6;font-style:italic;border-bottom:1px dashed #3B82F6;cursor:help" title="LaTeX: ' + escapeHtml(latex) + '">\\(' + escapeHtml(latex) + '\\)</span>';
    }
    lastIndex = m.index + m[0].length;
  }

  // === 第二遍：auto-detect ============================
  let p = normalized.slice(lastIndex).replace(/\\\\/g, '\\');

  // A) Unicode 映射
  p = convertUnicodeMath(p);

  // B) 复杂 LaTeX 命令
  p = mapOutsideDollar(p, t => t.replace(FRAC_SQRT_RE, m => ' $' + m + '$ '));

  // C) 裸露 LaTeX 关键字
  p = mapOutsideDollar(p, t => t.replace(CMD_RE, m => ' $' + m + '$ '));

  // D) Unicode √ → LaTeX \sqrt
  p = mapOutsideDollar(p, t =>
    t
      .replace(/³√\(([^)]*?)\)/g, ' $\\sqrt[3]{$1}$ ')
      .replace(/√(\d+)\/(\d+)/g, ' $\\frac{\\sqrt{$1}}{$2}$ ')
      .replace(/√\(([^)]*?)\)/g, (_, c) => ' $\\sqrt{' + c + '}$ ')
      .replace(/√(\d+)/g, ' $\\sqrt{$1}$ ')
      .replace(/√([a-zA-Zα-ωπ])/g, ' $\\sqrt{$1}$ ')
  );

  // E0) 带括号的指数整体捕获（在分数处理之前，防止 )² 被拆散）
  // 如 (x+1/x)² → $(x+1/x)^{2}$，然后 1/x 在 KaTeX 内保持原样
  p = mapOutsideDollar(p, t => {
    t = t.replace(/\(([^$()\n]+)\)\^\{(\d+)\}/g, (_, expr, exp) =>
      ' $(' + expr + ')^{' + exp + '}$ '
    );
    return t;
  });

  // E1) 分数
  p = mapOutsideDollar(p, t => {
    // 1/x^{2} 或 1/x^{n} 带花括号上标
    t = t.replace(/(\d+)\/([a-zA-Z])\^\{(\d+)\}/g, (_, a, b, e) =>
      ' $\\frac{' + a + '}{' + b + '^{' + e + '}}$ '
    );
    // 1/x_{n}（下标转换后产生，如 1/x₁ → 1/x_{1}）
    t = t.replace(/(\d+)\/([a-zA-Z])_\{(\d+)\}/g, (_, a, b, d) =>
      ' $\\frac{' + a + '}{' + b + '_{' + d + '}}$ '
    );
    // digit/letter（如 1/x）
    t = t.replace(/(\d+)\/([a-zA-Z])(?=[\s,\)\u3002\uff1b\]\+\-×÷·=]|$|\.(?!\d))/g, (_, a, b) =>
      ' $\\frac{' + a + '}{' + b + '}$ '
    );
    // digit/digit（如 1/4）
    t = t.replace(/(\d+)\/(\d+)(?=[\s,\)\u3002\uff1b\]\+\-×÷·=]|$|\.(?!\d))/g, (_, a, b) =>
      ' $\\frac{' + a + '}{' + b + '}$ '
    );
    return t;
  });

  // E2) 裸露上标/下标
  // 每个模式独立 mapOutsideDollar 调用，防止 $...$ 被后续步骤入侵
  // E2a) 订阅+上标组合优先：v_{0}^{2}（Step A 转换后产生）
  p = mapOutsideDollar(p, t =>
    t.replace(/([a-zA-Z])_\{([^}]*)\}\^(?:\{([^}]*)\}|([a-zA-Z0-9]))/g, (_, l, s, b1, b2) =>
      ' $' + l + '_{' + s + '}^{' + (b1 ?? b2) + '}$ '
    )
  );
  // E2b) 单独下标：v_{0}、v_0、a_n
  p = mapOutsideDollar(p, t =>
    t.replace(/([a-zA-Z])_(?:\{([^}]*)\}|([a-zA-Z0-9]))/g, (_, l, b1, b2) =>
      ' $' + l + '_{' + (b1 ?? b2) + '}$ '
    )
  );
  // E2c) 单独上标：x^{2}、x^2、vy^{2}
  p = mapOutsideDollar(p, t =>
    t.replace(/([a-zA-Z0-9]+)\^(?:\{([^}]*)\}|([a-zA-Z0-9]))/g, (_, base, b1, b2) =>
      ' $' + base + '^{' + (b1 ?? b2) + '}$ '
    )
  );
  // E2d) x)^{n} 残留
  p = mapOutsideDollar(p, t =>
    t.replace(/([a-zA-Z0-9]+)\)\^(?:\{([^}]*)\}|([a-zA-Z0-9]))/g, (_, base, b1, b2) =>
      ' $' + base + ')^{' + (b1 ?? b2) + '}$ '
    )
  );

  // F) 第三遍：渲染新增的 $...$
  let finalResult = '';
  lastIndex = 0;
  while ((m = DOLLAR_RE.exec(p)) !== null) {
    finalResult += escapeHtml(p.slice(lastIndex, m.index));
    const block = m[1] !== undefined;
    let latex = (block ? m[1] : m[2]).trim();
    if (!latex) { finalResult += block ? '$$' : '$'; lastIndex = m.index + m[0].length; continue; }
    latex = latex.replace(/\u00B0/g, '^\\circ');
    try { finalResult += katex.renderToString(latex, { throwOnError: false, displayMode: block, output: 'html' }); }
    catch {
      finalResult += '<span style="color:#3B82F6;font-style:italic;border-bottom:1px dashed #3B82F6;cursor:help" title="LaTeX: ' + escapeHtml(latex) + '">\\(' + escapeHtml(latex) + '\\)</span>';
    }
    lastIndex = m.index + m[0].length;
  }
  finalResult += escapeHtml(p.slice(lastIndex));

  return result + finalResult;
}
