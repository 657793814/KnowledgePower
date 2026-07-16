"""PDF 解析 — 使用 PyMuPDF (快速) + pdfplumber (回退) 提取文本"""
import re
from pathlib import Path

def _extract_fitz(pdf_path: str) -> str | None:
    """使用 PyMuPDF 提取文本（快速）"""
    try:
        import fitz
        text_parts = []
        doc = fitz.open(pdf_path)
        for page in doc:
            page_text = page.get_text() or ""
            text_parts.append(page_text)
        doc.close()
        return "\n".join(text_parts)
    except ImportError:
        return None

def _extract_pdfplumber(pdf_path: str) -> str:
    """使用 pdfplumber 提取文本（回退）"""
    import pdfplumber
    text_parts = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text_parts.append(page_text)
    return "\n".join(text_parts)


def extract_text(pdf_path: str) -> str:
    """提取 PDF 全文文本（优先 PyMuPDF，回退 pdfplumber）"""
    result = _extract_fitz(pdf_path)
    if result is not None:
        return result
    return _extract_pdfplumber(pdf_path)


def extract_text_with_pages(pdf_path: str) -> list[dict]:
    """提取 PDF 逐页文本（含页码，优先 PyMuPDF，回退 pdfplumber）"""
    try:
        import fitz
        pages = []
        doc = fitz.open(pdf_path)
        for i in range(len(doc)):
            page_text = doc[i].get_text() or ""
            if page_text.strip():
                pages.append({
                    "page_num": i + 1,
                    "text": page_text.strip(),
                })
        doc.close()
        return pages
    except ImportError:
        pass

    import pdfplumber
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            page_text = page.extract_text() or ""
            if page_text.strip():
                pages.append({
                    "page_num": i + 1,
                    "text": page_text.strip(),
                })
    return pages


def guess_chapter(text: str) -> str:
    """从文本中猜测章节名"""
    lines = text.strip().split("\n")
    for line in lines[:5]:
        line = line.strip()
        # 匹配 "第X章" "第X节" "X." 等
        if re.match(r'^第[一二三四五六七八九十百千]+[章节篇]', line):
            return line
        if re.match(r'^\d+\.\s+\S+', line) and len(line) < 50:
            return line
    return ""
