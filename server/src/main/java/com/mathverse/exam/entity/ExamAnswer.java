package com.mathverse.exam.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("exam_answer")
public class ExamAnswer {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private Long paperId;
    private Long questionId;
    private String nodeId;
    private String userAnswer;
    private Integer isCorrect;
    private BigDecimal score;
    private Integer timeSpent;
    private LocalDateTime submittedAt;
}
