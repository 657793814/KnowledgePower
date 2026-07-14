package com.mathverse.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mathverse.ai.config.AiConfig;
import com.mathverse.ai.dto.*;
import com.mathverse.knowledge.entity.KnowledgeNode;
import com.mathverse.knowledge.entity.KnowledgeRelation;
import com.mathverse.knowledge.service.KnowledgeNodeService;
import com.mathverse.knowledge.service.KnowledgeRelationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    private final AiConfig aiConfig;
    private final KnowledgeNodeService nodeService;
    private final KnowledgeRelationService relationService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /** 系统提示词 — AI 扮演数学导师 */
    private static final String SYSTEM_PROMPT = """
你是一位富有耐心的初中高中数学导师（数学教授水平）。
你的教学风格：
1. 用通俗易懂的语言解释数学概念
2. 善用类比和生活例子
3. 多提问引导学生思考，而不是直接给答案
4. 当学生问数学题时，先给出提示，逐步引导
5. 涉及公式时用 LaTeX 格式：$公式$
6. 回答保持简洁，控制在 200-500 字
""";

    @PostConstruct
    public void init() {
        if ("openai".equals(aiConfig.getProvider())) {
            if (aiConfig.getApiKey() == null || aiConfig.getApiKey().isBlank()) {
                log.warn("⚠️ AI 供应商设为 openai 但未配置 api-key，请在 application.yml 中设置 ai.api-key");
                log.warn("   将在运行时降级为基于规则的回复");
            } else {
                log.info("🤖 AI 引擎: 远程API [{}] 模型={}", aiConfig.getApiBaseUrl(), aiConfig.getModel());
            }
        } else {
            log.info("🤖 AI 引擎: Ollama [{}] 模型={}", aiConfig.getBaseUrl(), aiConfig.getModel());
        }
    }

    // ========== AI 知识问答 ==========

    public AiAskResp ask(AiAskReq req) {
        try {
            // 获取知识点上下文
            String context = req.getContext();
            if (context == null || context.isBlank()) {
                context = buildKnowledgeContext(req.getNodeId());
            }

            String historyContext = "";
            if (req.getHistory() != null && req.getHistory().length > 0) {
                historyContext = "\n## 对话历史\n" + String.join("\n", req.getHistory());
            }

            String userContent = String.format("""

## 知识点上下文
%s
%s

## 学生提问
%s
""", context, historyContext, req.getQuestion());

            String answer = callAi(SYSTEM_PROMPT, userContent);
            AiAskResp resp = new AiAskResp();
            resp.setAnswer(answer);
            resp.setSuccess(true);
            return resp;

        } catch (Exception e) {
            log.error("AI 问答失败: {}", e.getMessage());
            AiAskResp resp = new AiAskResp();
            resp.setSuccess(false);
            resp.setError("AI 服务暂时不可用，请稍后再试：" + e.getMessage());
            // 降级：给出结构化回复
            resp.setAnswer(buildFallbackAnswer(req.getQuestion()));
            return resp;
        }
    }

    // ========== AI 错题解析 ==========

    public AiAskResp explainMistake(AiExplainReq req) {
        try {
            String context = "";
            if (req.getNodeId() != null) {
                context = buildKnowledgeContext(req.getNodeId());
            }

            String userContent = String.format("""

## 相关知识点上下文
%s

## 学生做错的题
题目：%s
学生的答案：%s
正确答案：%s

请做三件事：
1. 用通俗语言解释为什么正确答案是对的
2. 分析学生可能哪里理解错了
3. 出一个类似的变式题让学生巩固
""", context, req.getQuestionTitle(), req.getUserAnswer(), req.getCorrectAnswer());

            String answer = callAi(SYSTEM_PROMPT, userContent);
            AiAskResp resp = new AiAskResp();
            resp.setAnswer(answer);
            resp.setSuccess(true);
            return resp;

        } catch (Exception e) {
            log.error("AI 错题解析失败: {}", e.getMessage());
            AiAskResp resp = new AiAskResp();
            resp.setSuccess(false);
            resp.setError("AI 服务暂时不可用");
            resp.setAnswer("💡 **知识点提示**：\n\n正确答案是 " + req.getCorrectAnswer() + "。建议回顾相关知识点，注意审题和计算细节。");
            return resp;
        }
    }

    // ========== AI 学习推荐 ==========

    public AiAskResp recommend(AiRecommendReq req) {
        try {
            String statsStr = req.getDomainStats().stream()
                    .map(d -> String.format("- %s：正确率 %.1f%%", d.getDomain(), d.getAccuracyRate()))
                    .collect(Collectors.joining("\n"));

            String userContent = String.format("""

## 学生学习统计
%s

请分析学生的学习情况，给出：
1. 哪个领域最薄弱，需要优先加强
2. 推荐具体的学习顺序和知识点
3. 学习建议（具体可操作）
""", statsStr);

            String answer = callAi(SYSTEM_PROMPT, userContent);
            AiAskResp resp = new AiAskResp();
            resp.setAnswer(answer);
            resp.setSuccess(true);
            return resp;

        } catch (Exception e) {
            log.error("AI 推荐失败: {}", e.getMessage());
            AiAskResp resp = new AiAskResp();
            resp.setSuccess(false);
            resp.setError("AI 服务暂时不可用");
            // 基于规则降级
            String ruleBased = buildRuleBasedRecommendation(req.getDomainStats());
            resp.setAnswer(ruleBased);
            return resp;
        }
    }

    // ========== AI 智能组卷 ==========

    public AiPaperSuggestion generatePaper(AiGeneratePaperReq req) {
        try {
            String statsStr = req.getDomainStats().stream()
                    .map(d -> String.format("- %s：正确率 %.1f%%", d.getDomain(), d.getAccuracyRate()))
                    .collect(Collectors.joining("\n"));

            String userContent = String.format("""

你是一位数学老师，需要根据学生的正确率统计，设计一份针对性试卷。

## 学生学习统计
%s

试卷总题数：%d 题

请分析后，按以下JSON格式回复（不要包含其他内容）：
{
  "focusDomain": "最需要加强的领域",
  "allocations": [
    {"domain": "领域名", "count": 出题数, "difficulty": "easy|mixed|hard", "reason": "简要原因"}
  ]
}

规则：
1. 正确率低于60%的领域，出基础巩固题（easy）
2. 正确率60-80%的领域，出混合题（mixed）
3. 正确率高于80%的领域，出进阶题或不出（hard）
4. 各领域题数总和不能超过 %d
5. 优先覆盖正确率最低的领域
""", statsStr, req.getCount(), req.getCount());

            String answer = callAi(SYSTEM_PROMPT, userContent);

            // 尝试从 AI 回复中提取 JSON
            AiPaperSuggestion suggestion = parsePaperSuggestion(answer);
            if (suggestion == null) {
                // 解析失败，用规则降级
                suggestion = buildRuleBasedPaperSuggestion(req);
            }
            suggestion.setSuggestion(answer);
            suggestion.setSuccess(true);
            return suggestion;

        } catch (Exception e) {
            log.error("AI 组卷失败: {}", e.getMessage());
            AiPaperSuggestion fallback = buildRuleBasedPaperSuggestion(req);
            fallback.setSuccess(false);
            fallback.setSuggestion("AI 暂时不可用，已用规则生成默认组卷");
            return fallback;
        }
    }

    private AiPaperSuggestion parsePaperSuggestion(String aiResponse) {
        try {
            // 提取 JSON 部分
            int start = aiResponse.indexOf('{');
            int end = aiResponse.lastIndexOf('}');
            if (start < 0 || end <= start) return null;
            String json = aiResponse.substring(start, end + 1);
            JsonNode root = objectMapper.readTree(json);

            AiPaperSuggestion suggestion = new AiPaperSuggestion();
            suggestion.setFocusDomain(root.has("focusDomain") ? root.get("focusDomain").asText() : "");

            List<AiPaperSuggestion.DomainAllocation> allocations = new ArrayList<>();
            if (root.has("allocations")) {
                for (JsonNode alloc : root.get("allocations")) {
                    AiPaperSuggestion.DomainAllocation a = new AiPaperSuggestion.DomainAllocation();
                    a.setDomain(alloc.has("domain") ? alloc.get("domain").asText() : "");
                    a.setCount(alloc.has("count") ? alloc.get("count").asInt() : 0);
                    a.setDifficulty(alloc.has("difficulty") ? alloc.get("difficulty").asText() : "mixed");
                    a.setReason(alloc.has("reason") ? alloc.get("reason").asText() : "");
                    allocations.add(a);
                }
            }
            suggestion.setAllocations(allocations);

            int weakTotal = allocations.stream()
                    .filter(a -> "easy".equals(a.getDifficulty()))
                    .mapToInt(AiPaperSuggestion.DomainAllocation::getCount).sum();
            suggestion.setWeakCount(weakTotal);
            suggestion.setOtherCount(allocations.stream()
                    .filter(a -> !"easy".equals(a.getDifficulty()))
                    .mapToInt(AiPaperSuggestion.DomainAllocation::getCount).sum());

            return suggestion;
        } catch (Exception e) {
            log.warn("解析 AI 组卷 JSON 失败: {}", e.getMessage());
            return null;
        }
    }

    /** 基于规则的组卷降级 */
    private AiPaperSuggestion buildRuleBasedPaperSuggestion(AiGeneratePaperReq req) {
        if (req.getDomainStats() == null || req.getDomainStats().isEmpty()) {
            AiPaperSuggestion empty = new AiPaperSuggestion();
            empty.setSuccess(false);
            empty.setSuggestion("没有统计数据，无法生成针对性试卷");
            return empty;
        }

        // 排序：按正确率升序（最薄弱优先）
        List<AiGeneratePaperReq.DomainAccuracy> sorted = new ArrayList<>(req.getDomainStats());
        sorted.sort(Comparator.comparingDouble(AiGeneratePaperReq.DomainAccuracy::getAccuracyRate));

        AiPaperSuggestion suggestion = new AiPaperSuggestion();
        suggestion.setFocusDomain(sorted.get(0).getDomain());
        suggestion.setSuccess(true);

        int perDomain = Math.max(1, req.getCount() / sorted.size());
        int remainder = req.getCount() - perDomain * sorted.size();

        List<AiPaperSuggestion.DomainAllocation> allocations = new ArrayList<>();
        for (int i = 0; i < sorted.size(); i++) {
            AiGeneratePaperReq.DomainAccuracy da = sorted.get(i);
            AiPaperSuggestion.DomainAllocation alloc = new AiPaperSuggestion.DomainAllocation();
            alloc.setDomain(da.getDomain());
            int count = perDomain + (i < remainder ? 1 : 0);
            alloc.setCount(count);

            if (da.getAccuracyRate() < 60) {
                alloc.setDifficulty("easy");
                alloc.setReason("正确率偏低，建议基础巩固");
            } else if (da.getAccuracyRate() < 80) {
                alloc.setDifficulty("mixed");
                alloc.setReason("中等水平，查漏补缺");
            } else {
                alloc.setDifficulty("hard");
                alloc.setReason("掌握较好，试试进阶题");
            }
            allocations.add(alloc);
        }

        suggestion.setAllocations(allocations);
        suggestion.setWeakCount(allocations.stream()
                .filter(a -> "easy".equals(a.getDifficulty()))
                .mapToInt(AiPaperSuggestion.DomainAllocation::getCount).sum());
        suggestion.setOtherCount(allocations.stream()
                .filter(a -> !"easy".equals(a.getDifficulty()))
                .mapToInt(AiPaperSuggestion.DomainAllocation::getCount).sum());

        return suggestion;
    }

    // ========== 内部方法 ==========

    /** 构建知识点上下文 */
    private String buildKnowledgeContext(String nodeId) {
        if (nodeId == null || nodeId.isBlank()) return "";

        KnowledgeNode node = nodeService.getById(nodeId);
        if (node == null) return "";

        StringBuilder sb = new StringBuilder();
        sb.append("知识点：").append(node.getTitle()).append("\n");
        sb.append("所属领域：").append(node.getDomain()).append("\n");
        sb.append("难度等级：").append(node.getLevel()).append("\n");
        sb.append("核心内容：").append(node.getSummary()).append("\n");

        // 前置知识（指向当前节点的关系）
        List<KnowledgeRelation> prereqs = relationService.lambdaQuery()
                .eq(KnowledgeRelation::getToNodeId, nodeId).list();
        if (!prereqs.isEmpty()) {
            sb.append("前置知识：");
            List<String> prereqNames = prereqs.stream()
                    .map(r -> {
                        KnowledgeNode pn = nodeService.getById(r.getFromNodeId());
                        return pn != null ? pn.getTitle() : r.getFromNodeId();
                    })
                    .collect(Collectors.toList());
            sb.append(String.join(" → ", prereqNames)).append("\n");
        }

        // 后置知识（从当前节点出发的关系）
        List<KnowledgeRelation> nexts = relationService.lambdaQuery()
                .eq(KnowledgeRelation::getFromNodeId, nodeId).list();
        if (!nexts.isEmpty()) {
            sb.append("后续知识：");
            List<String> nextNames = nexts.stream()
                    .map(r -> {
                        KnowledgeNode nn = nodeService.getById(r.getToNodeId());
                        return nn != null ? nn.getTitle() : r.getToNodeId();
                    })
                    .collect(Collectors.toList());
            sb.append(String.join(" → ", nextNames)).append("\n");
        }

        // 内容摘要（从 contentJson 提取前 500 字）
        String content = node.getContentJson();
        if (content != null && content.length() > 500) {
            content = content.substring(0, 500) + "...";
        }
        sb.append("详细内容：").append(content != null ? content : "暂无");

        String result = sb.toString();
        return result.length() > aiConfig.getMaxContextChars()
                ? result.substring(0, aiConfig.getMaxContextChars()) + "..."
                : result;
    }

    /** 调用 AI 引擎 */
    private String callAi(String systemPrompt, String userPrompt) {
        if ("openai".equals(aiConfig.getProvider())) {
            return callRemoteApi(systemPrompt, userPrompt);
        }
        // 默认使用 Ollama
        return callOllama(systemPrompt + "\n\n" + userPrompt);
    }

    /** 调用 Ollama API */
    private String callOllama(String fullPrompt) {
        String url = aiConfig.getBaseUrl() + "/api/generate";

        Map<String, Object> body = new HashMap<>();
        body.put("model", aiConfig.getModel());
        body.put("prompt", fullPrompt);
        body.put("stream", false);
        body.put("options", Map.of(
                "num_predict", aiConfig.getMaxTokens(),
                "temperature", 0.7
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode json;
            try {
                json = objectMapper.readTree(response.getBody());
            } catch (Exception e) {
                throw new RuntimeException("Ollama 响应解析失败", e);
            }
            String text = json.has("response") ? json.get("response").asText() : "";
            return text.replaceAll("\n{3,}", "\n\n").trim();
        }

        throw new RuntimeException("Ollama 返回非正常状态: " + response.getStatusCode());
    }

    /** 调用 OpenAI 兼容的远程 API（DeepSeek / Agnes AI 等），含自动重试 */
    private String callRemoteApi(String systemPrompt, String userPrompt) {
        String url = aiConfig.getApiBaseUrl() + "/chat/completions";

        // 构建 messages
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userPrompt));

        Map<String, Object> body = new HashMap<>();
        body.put("model", aiConfig.getModel());
        body.put("messages", messages);
        body.put("stream", false);
        body.put("max_tokens", aiConfig.getMaxTokens());
        body.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String apiKey = aiConfig.getApiKey();
        if (apiKey != null && !apiKey.isBlank()) {
            headers.setBearerAuth(apiKey);
        }
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // 自动重试（应对远程 API 临时负载过高）
        int maxRetries = 3;
        int retryDelayMs = 1000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode json;
                    try {
                        json = objectMapper.readTree(response.getBody());
                    } catch (Exception e) {
                        throw new RuntimeException("远程 API 响应解析失败", e);
                    }
                    // OpenAI 兼容格式: choices[0].message.content
                    String text = json.has("choices") && json.get("choices").size() > 0
                            ? json.get("choices").get(0).path("message").path("content").asText()
                            : "";
                    return text.replaceAll("\n{3,}", "\n\n").trim();
                }

                // 5xx 服务端错误 —— 可重试
                if (response.getStatusCode().is5xxServerError()) {
                    if (attempt < maxRetries) {
                        log.warn("远程 API {} (第{}/{}次), {}ms后重试...", response.getStatusCode(), attempt, maxRetries, retryDelayMs);
                        Thread.sleep(retryDelayMs);
                        retryDelayMs *= 2;  // 指数退避: 1s → 2s → 4s
                        continue;
                    }
                    throw new RuntimeException("远程 API 服务暂时不可用 (尝试" + maxRetries + "次后放弃): " + response.getStatusCode()
                            + " - " + (response.getBody() != null ? response.getBody() : ""));
                }

                // 4xx 客户端错误 —— 不可重试
                throw new RuntimeException("远程 API 返回错误: " + response.getStatusCode()
                        + " - " + (response.getBody() != null ? response.getBody() : ""));

            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("远程 API 请求被中断", ie);
            } catch (HttpClientErrorException | HttpServerErrorException e) {
                // Spring RestTemplate 对 4xx/5xx 抛出异常，补充处理
                if (e.getStatusCode().is5xxServerError() && attempt < maxRetries) {
                    log.warn("远程 API {} (第{}/{}次), {}ms后重试...", e.getStatusCode(), attempt, maxRetries, retryDelayMs);
                    try {
                        Thread.sleep(retryDelayMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                    retryDelayMs *= 2;
                    continue;
                }
                throw e;  // 重试用完或非5xx，向上抛
            } catch (org.springframework.web.client.ResourceAccessException e) {
                // 网络 I/O 错误（Connection reset / timeout 等），可重试
                if (attempt < maxRetries) {
                    log.warn("远程 API 网络异常: {} (第{}/{}次), {}ms后重试...", e.getMessage(), attempt, maxRetries, retryDelayMs);
                    try {
                        Thread.sleep(retryDelayMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                    retryDelayMs *= 2;
                    continue;
                }
                throw new RuntimeException("远程 API 网络不可达 (尝试" + maxRetries + "次后放弃): " + e.getMessage(), e);
            }
        }

        throw new RuntimeException("远程 API 返回非正常状态（所有重试均已耗尽）");
    }

    /** 降级回复（AI 不可用时） */
    private String buildFallbackAnswer(String question) {
        return "💡 **关于「" + question + "」**\n\n"
                + "AI 导师暂时离线，但你仍可以：\n"
                + "1. 查看当前知识点的「定义」和「关键点」\n"
                + "2. 查看知识图谱中的前后置关联\n"
                + "3. 返回练习页面做几道题巩固\n\n"
                + "建议查看的知识点链接已在页面上方列出。";
    }

    /** 基于规则的学习推荐（AI 降级） */
    private String buildRuleBasedRecommendation(List<AiRecommendReq.DomainAccuracy> stats) {
        if (stats == null || stats.isEmpty()) {
            return "📚 **学习建议**\n\n暂时没有足够数据。先去练习几道题吧！";
        }

        // 找出最薄弱的领域
        AiRecommendReq.DomainAccuracy weakest = stats.stream()
                .min(Comparator.comparingDouble(AiRecommendReq.DomainAccuracy::getAccuracyRate))
                .orElse(null);

        StringBuilder sb = new StringBuilder("📚 **AI 学习建议（基于数据）**\n\n");
        if (weakest != null && weakest.getAccuracyRate() < 60) {
            sb.append("🔴 **当前最薄弱领域：").append(weakest.getDomain())
                    .append("**（正确率 ").append(String.format("%.1f", weakest.getAccuracyRate()))
                    .append("%）\n\n");
            sb.append("建议优先复习该领域的知识点，多做练习题巩固。\n\n");
        }

        sb.append("📊 **各领域情况**\n");
        for (AiRecommendReq.DomainAccuracy d : stats) {
            String icon = d.getAccuracyRate() >= 80 ? "🟢" : d.getAccuracyRate() >= 60 ? "🟡" : "🔴";
            sb.append(icon).append(" ").append(d.getDomain())
                    .append("：").append(String.format("%.1f", d.getAccuracyRate())).append("%\n");
        }

        sb.append("\n💡 **建议**\n");
        sb.append("1. 薄弱领域：先看知识点定义，再做基础题\n");
        sb.append("2. 中等领域：做混合练习，查漏补缺\n");
        sb.append("3. 掌握领域：尝试综合题，保持手感\n");

        return sb.toString();
    }
}
