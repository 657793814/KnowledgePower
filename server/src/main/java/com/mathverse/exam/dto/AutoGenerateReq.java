package com.mathverse.exam.dto;

import lombok.Data;

@Data
public class AutoGenerateReq {
    private String domain;
    private String level;
    private int count;
    private String mode;
    private Integer timeLimit;
}
