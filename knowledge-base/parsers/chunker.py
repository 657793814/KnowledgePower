"""中文文本分块 — 基于 langchain RecursiveCharacterTextSplitter"""
import re
from langchain_text_splitters import RecursiveCharacterTextSplitter


# 中文分隔符优先级（从粗到细）
CHUNK_SEPARATORS = [
    "\n\n\n",
    "\n\n",
    "\n",
    "。",
    "！",
    "？",
    "；",
    "，",
    " ",
    "",
]

def split_text(
    text: str,
    chunk_size: int = 256,
    chunk_overlap: int = 32,
) -> list[str]:
    """将文本按中文字义分割成块"""
    splitter = RecursiveCharacterTextSplitter(
        separators=CHUNK_SEPARATORS,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=token_count,
    )
    return splitter.split_text(text)


def token_count(text: str) -> int:
    """粗略估算 token 数（中文字符 ≈ 1.5 token，英文 ≈ 1 token）"""
    # 简单估算：中文每个字 ~1.5 token，英文单词 ~1 token
    chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', text))
    ascii_words = len(re.findall(r'[a-zA-Z]+', text))
    return int(chinese_chars * 1.5 + ascii_words * 1.3)


def split_document(
    source: str,
    text: str,
    chunk_size: int = 256,
    chunk_overlap: int = 32,
) -> list[dict]:
    """将整篇文档分割成带元数据的 chunk 列表"""
    chunks = split_text(text, chunk_size, chunk_overlap)
    
    results = []
    for i, chunk_text in enumerate(chunks):
        chunk_text = chunk_text.strip()
        if not chunk_text or len(chunk_text) < 10:
            continue
        
        # 尝试猜测章节
        chapter_lines = chunk_text.split("\n")
        chapter = ""
        for line in chapter_lines[:3]:
            if re.match(r'^第[一二三四五六七八九十百千]+[章节篇]', line):
                chapter = line[:30]
                break
        
        results.append({
            "source": source,
            "chapter": chapter,
            "chunk_idx": i,
            "text": chunk_text,
        })
    
    return results
