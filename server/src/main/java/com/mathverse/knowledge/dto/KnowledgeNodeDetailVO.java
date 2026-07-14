package com.mathverse.knowledge.dto;

import lombok.Data;

import java.util.List;

@Data
public class KnowledgeNodeDetailVO {
    private String id;
    private String title;
    private String subtitle;
    private String domain;
    private String level;
    private Integer difficulty;
    private Integer sortOrder;
    private String visualType;
    private String summary;
    private Object contentJson;
    private String milestoneType;
    private Integer status;

    private List<RelationVO> prerequisites;
    private List<RelationVO> nextNodes;
    private List<RelationVO> references;
}
