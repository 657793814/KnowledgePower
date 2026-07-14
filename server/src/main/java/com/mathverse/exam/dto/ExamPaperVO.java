package com.mathverse.exam.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExamPaperVO {
    private Long id;
    private String title;
    private String domain;
    private String level;
    private String mode;
    private Integer questionCount;
    private Integer timeLimit;
    private Integer allowRetry;
    private List<ExamQuestionVO> questions;
}
