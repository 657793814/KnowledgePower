package com.mathverse.exam.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExamResultVO {
    private Long paperId;
    private int totalCount;
    private int correctCount;
    private int wrongCount;
    private double score;
    private int totalTimeSpent;
    private List<AnswerResult> details;
}
