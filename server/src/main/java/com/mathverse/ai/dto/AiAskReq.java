package com.mathverse.ai.dto;

import lombok.Data;

@Data
public class AiAskReq {
    /** 知识点 ID */
    private String nodeId;
    /** 用户提问 */
    private String question;
    /** 上下文（可选，如果传了优先使用） */
    private String context;
    /** 历史对话（可选） */
    private String[] history;
}
