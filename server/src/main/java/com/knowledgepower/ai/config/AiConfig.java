package com.knowledgepower.ai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "ai")
public class AiConfig {
    /** AI 供应商: ollama | openai */
    private String provider = "openai";
    /** Ollama 服务地址（provider=ollama 时使用） */
    private String baseUrl = "http://localhost:11434";
    /** 远程 API 地址（provider=openai 时使用，如 https://apihub.agnes-ai.com/v1） */
    private String apiBaseUrl = "https://apihub.agnes-ai.com/v1";
    /** 远程 API Key */
    private String apiKey = "";
    /** 模型名称 */
    private String model = "agnes-2.0-flash";
    /** 每次 AI 请求的最大 token 数 */
    private int maxTokens = 4096;
    /** 知识上下文最大字符数（防止超过 context window） */
    private int maxContextChars = 3000;
}
