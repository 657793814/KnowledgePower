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
@TableName("knowledge_relation")
public class KnowledgeRelation {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String fromNodeId;

    private String toNodeId;

    private String relationType;

    private Integer sortOrder;

    private String description;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
