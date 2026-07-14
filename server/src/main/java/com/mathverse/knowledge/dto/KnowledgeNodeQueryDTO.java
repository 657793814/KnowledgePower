package com.mathverse.knowledge.dto;

import lombok.Data;

@Data
public class KnowledgeNodeQueryDTO {
    private String domain;
    private String level;
    private String keyword;
    private Integer page = 1;
    private Integer pageSize = 20;
}
