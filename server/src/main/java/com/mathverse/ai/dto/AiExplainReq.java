package com.mathverse.ai.dto;

import lombok.Data;

@Data
public class AiExplainReq {
    /** 题目原文 */
    private String questionTitle;
    /** 用户答案 */
    private String userAnswer;
    /** 正确答案 */
    private String correctAnswer;
    /** 知识点 ID */
    private String nodeId;
}
