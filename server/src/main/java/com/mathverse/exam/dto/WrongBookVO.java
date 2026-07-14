package com.mathverse.exam.dto;

import lombok.Data;

@Data
public class WrongBookVO {
    private Long questionId;
    private String title;
    private String questionType;
    private String nodeId;
    private String nodeTitle;
    private String domain;
    private String correctAnswer;
    private String explanation;
    private int reviewCount;
}
