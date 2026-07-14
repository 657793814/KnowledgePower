package com.mathverse.knowledge.dto;

import lombok.Data;

import java.util.List;

@Data
public class KnowledgeNodeDTO {
    private String id;
    private String title;
    private String subtitle;
    private String domain;
    private String level;
    private Integer difficulty;
    private Integer sortOrder;
    private String visualType;
    private String summary;
    private String contentJson;
    private String milestoneType;
    private Integer status;
}
