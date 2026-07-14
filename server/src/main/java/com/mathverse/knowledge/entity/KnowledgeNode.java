package com.mathverse.knowledge.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("knowledge_node")
public class KnowledgeNode {
    @TableId(type = IdType.INPUT)
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

    @TableLogic
    private Integer deleted;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
