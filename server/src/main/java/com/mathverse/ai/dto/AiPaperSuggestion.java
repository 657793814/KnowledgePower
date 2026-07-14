package com.mathverse.ai.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiPaperSuggestion {
    /** 建议聚焦的领域 */
    private String focusDomain;
    /** 薄弱领域各出几题 */
    private int weakCount;
    /** 其他领域出几题 */
    private int otherCount;
    /** AI 原始建议文本 */
    private String suggestion;
    /** 是否成功（降级时 false） */
    private boolean success;
    /** 各领域配题建议 */
    private List<DomainAllocation> allocations;

    @Data
    public static class DomainAllocation {
        private String domain;
        private int count;
        private String difficulty; // "easy", "mixed", "hard"
        private String reason;
    }
}
