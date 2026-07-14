package com.mathverse.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Knife4jConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MathVerse API 文档")
                        .version("1.0.0")
                        .description("数理世界 - 初中高中数学知识图谱 API")
                        .contact(new Contact().name("作栋")));
    }
}
