package com.mathverse.ai.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiGeneratePaperReq {
    /** 各领域正确率统计 */
    private List<DomainAccuracy> domainStats;
    /** 试卷题数 */
    private int count;
    /** 用户 ID */
    private Long userId;

    @Data
    public static class DomainAccuracy {
        private String domain;
        private double accuracyRate;
    }
}
