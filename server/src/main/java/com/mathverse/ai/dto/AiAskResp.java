package com.mathverse.ai.dto;

import lombok.Data;

@Data
public class AiAskResp {
    private String answer;
    private boolean success;
    private String error;
}
