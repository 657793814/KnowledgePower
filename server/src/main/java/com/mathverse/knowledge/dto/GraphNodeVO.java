package com.mathverse.knowledge.dto;

import lombok.Data;

@Data
public class GraphNodeVO {
    private String id;
    private String label;
    private String domain;
    private String level;
    private Integer difficulty;
    private Boolean isMilestone;
}
