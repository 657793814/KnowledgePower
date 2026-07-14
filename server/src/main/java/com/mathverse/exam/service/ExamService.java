package com.mathverse.exam.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mathverse.exam.dto.*;
import com.mathverse.exam.entity.ExamAnswer;
import com.mathverse.exam.entity.ExamPaper;
import com.mathverse.exam.entity.ExamQuestion;
import com.mathverse.exam.entity.ExamWrongBook;
import com.mathverse.exam.mapper.ExamAnswerMapper;
import com.mathverse.exam.mapper.ExamPaperMapper;
import com.mathverse.exam.mapper.ExamQuestionMapper;
import com.mathverse.exam.mapper.ExamWrongBookMapper;
import com.mathverse.knowledge.entity.KnowledgeNode;
import com.mathverse.knowledge.service.KnowledgeNodeService;
import com.mathverse.knowledge.service.KnowledgeRelationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamQuestionMapper questionMapper;
    private final ExamPaperMapper paperMapper;
    private final ExamAnswerMapper answerMapper;
    private final ExamWrongBookMapper wrongBookMapper;
    private final KnowledgeNodeService nodeService;

    // ========== 题库管理 ==========

    public Page<ExamQuestion> pageQuestions(int page, int pageSize, String domain, String type, Long nodeId) {
        LambdaQueryWrapper<ExamQuestion> q = new LambdaQueryWrapper<ExamQuestion>()
                .eq(ExamQuestion::getStatus, 1);
        if (domain != null) q.eq(ExamQuestion::getDomain, domain);
        if (type != null) q.eq(ExamQuestion::getQuestionType, type);
        if (nodeId != null) q.eq(ExamQuestion::getNodeId, nodeId);
        q.orderByDesc(ExamQuestion::getCreatedAt);
        return questionMapper.selectPage(new Page<>(page, pageSize), q);
    }

    public ExamQuestion getQuestion(Long id) {
        return questionMapper.selectById(id);
    }

    public void saveQuestion(ExamQuestion q) {
        if (q.getId() == null) {
            questionMapper.insert(q);
        } else {
            questionMapper.updateById(q);
        }
    }

    public void deleteQuestion(Long id) {
        questionMapper.deleteById(id);
    }

    // ========== 自动组卷 ==========

    @Transactional
    public ExamPaperVO autoGenerate(AutoGenerateReq req) {
        LambdaQueryWrapper<ExamQuestion> q = new LambdaQueryWrapper<ExamQuestion>()
                .eq(ExamQuestion::getStatus, 1);
        if (req.getDomain() != null) q.eq(ExamQuestion::getDomain, req.getDomain());
        if (req.getLevel() != null) q.eq(ExamQuestion::getLevel, req.getLevel());

        // 随机打乱
        List<ExamQuestion> all = questionMapper.selectList(q);
        Collections.shuffle(all);

        int count = Math.min(req.getCount(), all.size());
        List<ExamQuestion> picked = all.subList(0, count);

        // 创建试卷
        String ids = picked.stream().map(e -> String.valueOf(e.getId()))
                .collect(Collectors.joining(","));

        ExamPaper paper = ExamPaper.builder()
                .title(req.getDomain() != null ? req.getDomain() + " · " + (req.getMode().equals("exam") ? "考试" : "练习") : "综合" + (req.getMode().equals("exam") ? "考试" : "练习"))
                .domain(req.getDomain())
                .level(req.getLevel())
                .mode(req.getMode())
                .questionCount(count)
                .timeLimit(req.getTimeLimit())
                .allowRetry(req.getMode().equals("practice") ? 1 : 0)
                .questionIds(ids)
                .build();
        paperMapper.insert(paper);

        // 构建 VO（不返回答案）
        ExamPaperVO vo = new ExamPaperVO();
        vo.setId(paper.getId());
        vo.setTitle(paper.getTitle());
        vo.setDomain(paper.getDomain());
        vo.setLevel(paper.getLevel());
        vo.setMode(paper.getMode());
        vo.setQuestionCount(count);
        vo.setTimeLimit(paper.getTimeLimit());
        vo.setAllowRetry(paper.getAllowRetry());
        vo.setQuestions(picked.stream().map(this::toQuestionVO).toList());

        return vo;
    }

    // ========== 获取试卷（不含答案） ==========

    public ExamPaperVO getPaper(Long paperId) {
        ExamPaper paper = paperMapper.selectById(paperId);
        if (paper == null) return null;

        List<Long> qIds = Arrays.stream(paper.getQuestionIds().split(","))
                .map(Long::parseLong).toList();
        List<ExamQuestion> questions = questionMapper.selectBatchIds(qIds);

        ExamPaperVO vo = new ExamPaperVO();
        vo.setId(paper.getId());
        vo.setTitle(paper.getTitle());
        vo.setDomain(paper.getDomain());
        vo.setLevel(paper.getLevel());
        vo.setMode(paper.getMode());
        vo.setQuestionCount(paper.getQuestionCount());
        vo.setTimeLimit(paper.getTimeLimit());
        vo.setAllowRetry(paper.getAllowRetry());
        vo.setQuestions(questions.stream().map(this::toQuestionVO).toList());
        return vo;
    }

    private ExamQuestionVO toQuestionVO(ExamQuestion q) {
        ExamQuestionVO vo = new ExamQuestionVO();
        vo.setId(q.getId());
        vo.setNodeId(q.getNodeId());
        vo.setDomain(q.getDomain());
        vo.setLevel(q.getLevel());
        vo.setQuestionType(q.getQuestionType());
        vo.setDifficulty(q.getDifficulty());
        vo.setTitle(q.getTitle());
        vo.setOptions(q.getOptions());
        vo.setExplanation(q.getExplanation());
        vo.setTags(q.getTags());
        // 获取知识点标题
        KnowledgeNode node = nodeService.getById(q.getNodeId());
        vo.setNodeTitle(node != null ? node.getTitle() : q.getNodeId());
        return vo;
    }

    // ========== 自由练习（随机出题） ==========

    public List<ExamQuestionVO> getRandomQuestions(String domain, String level, int count) {
        LambdaQueryWrapper<ExamQuestion> q = new LambdaQueryWrapper<ExamQuestion>()
                .eq(ExamQuestion::getStatus, 1);
        if (domain != null) q.eq(ExamQuestion::getDomain, domain);
        if (level != null) q.eq(ExamQuestion::getLevel, level);

        List<ExamQuestion> all = questionMapper.selectList(q);
        Collections.shuffle(all);
        int n = Math.min(count, all.size());
        return all.subList(0, n).stream().map(this::toQuestionVO).toList();
    }

    // ========== 提交批改（练习模式） ==========

    @Transactional
    public ExamResultVO submitAnswers(Long userId, ExamSubmitReq req) {
        ExamPaper paper = req.getPaperId() != null ? paperMapper.selectById(req.getPaperId()) : null;

        List<Long> qIds = req.getAnswers().stream().map(QuestionAnswer::getQuestionId).toList();
        Map<Long, ExamQuestion> qMap = questionMapper.selectBatchIds(qIds)
                .stream().collect(Collectors.toMap(ExamQuestion::getId, e -> e));

        int correct = 0;
        List<AnswerResult> details = new ArrayList<>();
        List<ExamAnswer> answers = new ArrayList<>();

        for (QuestionAnswer a : req.getAnswers()) {
            ExamQuestion eq = qMap.get(a.getQuestionId());
            if (eq == null) continue;

            boolean isCorrect = eq.getAnswer().trim().equalsIgnoreCase(a.getUserAnswer().trim());
            if (isCorrect) correct++;

            ExamAnswer ea = ExamAnswer.builder()
                    .userId(userId)
                    .paperId(req.getPaperId())
                    .questionId(a.getQuestionId())
                    .nodeId(eq.getNodeId())
                    .userAnswer(a.getUserAnswer())
                    .isCorrect(isCorrect ? 1 : 0)
                    .score(isCorrect ? BigDecimal.valueOf(100.0 / req.getAnswers().size()) : BigDecimal.ZERO)
                    .submittedAt(LocalDateTime.now())
                    .build();
            answerMapper.insert(ea);
            answers.add(ea);

            AnswerResult ar = new AnswerResult();
            ar.setQuestionId(a.getQuestionId());
            ar.setUserAnswer(a.getUserAnswer());
            ar.setCorrectAnswer(eq.getAnswer());
            ar.setCorrect(isCorrect);
            ar.setExplanation(eq.getExplanation());
            details.add(ar);

            // 错题自动加入错题本
            if (!isCorrect) {
                addToWrongBook(userId, a.getQuestionId(), eq.getNodeId());
            }
        }

        ExamResultVO result = new ExamResultVO();
        result.setPaperId(req.getPaperId());
        result.setTotalCount(req.getAnswers().size());
        result.setCorrectCount(correct);
        result.setWrongCount(req.getAnswers().size() - correct);
        result.setScore(correct * 100.0 / req.getAnswers().size());
        result.setDetails(details);

        return result;
    }

    // ========== 错题本 ==========

    public void addToWrongBook(Long userId, Long questionId, String nodeId) {
        ExamWrongBook existing = wrongBookMapper.selectOne(
                new LambdaQueryWrapper<ExamWrongBook>()
                        .eq(ExamWrongBook::getUserId, userId)
                        .eq(ExamWrongBook::getQuestionId, questionId));
        if (existing == null) {
            wrongBookMapper.insert(ExamWrongBook.builder()
                    .userId(userId).questionId(questionId).nodeId(nodeId)
                    .reviewCount(0).build());
        }
    }

    public Page<WrongBookVO> getWrongBook(Long userId, int page, int pageSize) {
        Page<ExamWrongBook> wbPage = wrongBookMapper.selectPage(
                new Page<>(page, pageSize),
                new LambdaQueryWrapper<ExamWrongBook>()
                        .eq(ExamWrongBook::getUserId, userId)
                        .orderByDesc(ExamWrongBook::getUpdatedAt));

        List<WrongBookVO> vos = wbPage.getRecords().stream().map(wb -> {
            ExamQuestion q = questionMapper.selectById(wb.getQuestionId());
            if (q == null) return null;
            WrongBookVO vo = new WrongBookVO();
            vo.setQuestionId(q.getId());
            vo.setTitle(q.getTitle());
            vo.setQuestionType(q.getQuestionType());
            vo.setNodeId(q.getNodeId());
            KnowledgeNode node = nodeService.getById(q.getNodeId());
            vo.setNodeTitle(node != null ? node.getTitle() : q.getNodeId());
            vo.setDomain(q.getDomain());
            vo.setCorrectAnswer(q.getAnswer());
            vo.setExplanation(q.getExplanation());
            vo.setReviewCount(wb.getReviewCount());
            return vo;
        }).filter(Objects::nonNull).toList();

        Page<WrongBookVO> result = new Page<>(wbPage.getCurrent(), wbPage.getSize(), wbPage.getTotal());
        result.setRecords(vos);
        return result;
    }

    public void removeFromWrongBook(Long userId, Long questionId) {
        wrongBookMapper.delete(new LambdaQueryWrapper<ExamWrongBook>()
                .eq(ExamWrongBook::getUserId, userId)
                .eq(ExamWrongBook::getQuestionId, questionId));
    }

    public void markReviewed(Long userId, Long questionId) {
        ExamWrongBook wb = wrongBookMapper.selectOne(
                new LambdaQueryWrapper<ExamWrongBook>()
                        .eq(ExamWrongBook::getUserId, userId)
                        .eq(ExamWrongBook::getQuestionId, questionId));
        if (wb != null) {
            wb.setReviewCount(wb.getReviewCount() + 1);
            wb.setLastReviewAt(LocalDateTime.now());
            wrongBookMapper.updateById(wb);
        }
    }

    // ========== 学习统计 ==========

    public ExamStatsVO getStats(Long userId) {
        List<ExamAnswer> allAnswers = answerMapper.selectList(
                new LambdaQueryWrapper<ExamAnswer>()
                        .eq(ExamAnswer::getUserId, userId));

        int total = allAnswers.size();
        int correct = (int) allAnswers.stream().filter(a -> a.getIsCorrect() == 1).count();
        int wrongCount = wrongBookMapper.selectCount(
                new LambdaQueryWrapper<ExamWrongBook>()
                        .eq(ExamWrongBook::getUserId, userId)).intValue();

        // 按领域统计
        Map<String, List<ExamAnswer>> byDomain = allAnswers.stream()
                .collect(Collectors.groupingBy(a -> {
                    ExamQuestion q = questionMapper.selectById(a.getQuestionId());
                    return q != null ? q.getDomain() : "未知";
                }));

        List<DomainStat> domainStats = byDomain.entrySet().stream().map(e -> {
            DomainStat ds = new DomainStat();
            ds.setDomain(e.getKey());
            ds.setAnswered(e.getValue().size());
            ds.setCorrect((int) e.getValue().stream().filter(a -> a.getIsCorrect() == 1).count());
            ds.setAccuracyRate(ds.getAnswered() > 0
                    ? BigDecimal.valueOf(ds.getCorrect() * 100.0 / ds.getAnswered())
                    .setScale(1, RoundingMode.HALF_UP).doubleValue()
                    : 0);
            return ds;
        }).toList();

        ExamStatsVO stats = new ExamStatsVO();
        stats.setTotalAnswered(total);
        stats.setTotalCorrect(correct);
        stats.setAccuracyRate(total > 0
                ? BigDecimal.valueOf(correct * 100.0 / total)
                .setScale(1, RoundingMode.HALF_UP).doubleValue()
                : 0);
        stats.setWrongBookCount(wrongCount);
        stats.setDomainStats(domainStats);
        return stats;
    }
}
