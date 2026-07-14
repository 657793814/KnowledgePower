package com.mathverse.exam.dto;

import lombok.Data;

@Data
public class AnswerResult {
    private Long questionId;
    private String userAnswer;
    private String correctAnswer;
    private boolean correct;
    private String explanation;
}
