package com.mathverse.ai.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiRecommendReq {
    /** 各领域正确率 */
    private List<DomainAccuracy> domainStats;
    /** 用户 ID */
    private Long userId;

    @Data
    public static class DomainAccuracy {
        private String domain;
        private double accuracyRate;
    }
}
