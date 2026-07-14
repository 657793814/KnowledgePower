package com.mathverse.exam.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExamStatsVO {
    private int totalAnswered;
    private int totalCorrect;
    private double accuracyRate;
    private int wrongBookCount;
    private List<DomainStat> domainStats;
}
