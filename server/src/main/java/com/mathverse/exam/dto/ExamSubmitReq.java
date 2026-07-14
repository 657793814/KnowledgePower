package com.mathverse.exam.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExamSubmitReq {
    private Long paperId;
    private List<QuestionAnswer> answers;
}
