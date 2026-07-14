package com.mathverse.exam.entity;

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
@TableName("exam_wrong_book")
public class ExamWrongBook {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private Long questionId;
    private String nodeId;
    private Integer reviewCount;
    private LocalDateTime lastReviewAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
