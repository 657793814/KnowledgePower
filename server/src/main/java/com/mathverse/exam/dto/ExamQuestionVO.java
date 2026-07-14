package com.mathverse.exam.dto;

import lombok.Data;

@Data
public class ExamQuestionVO {
    private Long id;
    private String nodeId;
    private String nodeTitle;
    private String domain;
    private String level;
    private String questionType;
    private Integer difficulty;
    private String title;
    private String options;
    private String explanation;
    private String tags;
}
