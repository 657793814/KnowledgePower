package com.mathverse.exam.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mathverse.common.result.R;
import com.mathverse.exam.dto.*;
import com.mathverse.exam.entity.ExamQuestion;
import com.mathverse.exam.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exam")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final Long DEFAULT_USER_ID = 1L; // 暂未实现登录，用默认用户

    // ========== 题库管理 ==========

    @GetMapping("/questions")
    public R<Page<ExamQuestion>> pageQuestions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long nodeId) {
        return R.ok(examService.pageQuestions(page, pageSize, domain, type, nodeId));
    }

    @GetMapping("/questions/{id}")
    public R<ExamQuestion> getQuestion(@PathVariable Long id) {
        return R.ok(examService.getQuestion(id));
    }

    @PostMapping("/questions")
    public R<Void> saveQuestion(@RequestBody ExamQuestion q) {
        examService.saveQuestion(q);
        return R.ok();
    }

    @PutMapping("/questions/{id}")
    public R<Void> updateQuestion(@PathVariable Long id, @RequestBody ExamQuestion q) {
        q.setId(id);
        examService.saveQuestion(q);
        return R.ok();
    }

    @DeleteMapping("/questions/{id}")
    public R<Void> deleteQuestion(@PathVariable Long id) {
        examService.deleteQuestion(id);
        return R.ok();
    }

    // ========== 自动组卷 ==========

    @PostMapping("/generate")
    public R<ExamPaperVO> autoGenerate(@RequestBody AutoGenerateReq req) {
        return R.ok(examService.autoGenerate(req));
    }

    @GetMapping("/paper/{paperId}")
    public R<ExamPaperVO> getPaper(@PathVariable Long paperId) {
        return R.ok(examService.getPaper(paperId));
    }

    // ========== 自由练习 ==========

    @GetMapping("/random")
    public R<List<ExamQuestionVO>> getRandomQuestions(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String level,
            @RequestParam(defaultValue = "10") int count) {
        return R.ok(examService.getRandomQuestions(domain, level, count));
    }

    // ========== 提交批改 ==========

    @PostMapping("/submit")
    public R<ExamResultVO> submit(@RequestBody ExamSubmitReq req) {
        return R.ok(examService.submitAnswers(DEFAULT_USER_ID, req));
    }

    // ========== 错题本 ==========

    @GetMapping("/wrong-book")
    public R<Page<WrongBookVO>> getWrongBook(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        return R.ok(examService.getWrongBook(DEFAULT_USER_ID, page, pageSize));
    }

    @DeleteMapping("/wrong-book/{questionId}")
    public R<Void> removeFromWrongBook(@PathVariable Long questionId) {
        examService.removeFromWrongBook(DEFAULT_USER_ID, questionId);
        return R.ok();
    }

    @PostMapping("/wrong-book/{questionId}/review")
    public R<Void> markReviewed(@PathVariable Long questionId) {
        examService.markReviewed(DEFAULT_USER_ID, questionId);
        return R.ok();
    }

    // ========== 学习统计 ==========

    @GetMapping("/stats")
    public R<ExamStatsVO> getStats() {
        return R.ok(examService.getStats(DEFAULT_USER_ID));
    }
}
