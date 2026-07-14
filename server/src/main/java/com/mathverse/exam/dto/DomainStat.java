package com.mathverse.exam.dto;

import lombok.Data;

@Data
public class DomainStat {
    private String domain;
    private int answered;
    private int correct;
    private double accuracyRate;
}
