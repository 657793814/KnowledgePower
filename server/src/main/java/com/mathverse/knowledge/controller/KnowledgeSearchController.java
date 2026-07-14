package com.mathverse.knowledge.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.mathverse.common.result.R;
import com.mathverse.knowledge.entity.KnowledgeNode;
import com.mathverse.knowledge.service.KnowledgeNodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "知识搜索")
@RestController
@RequestMapping("/knowledge/search")
@RequiredArgsConstructor
public class KnowledgeSearchController {

    private final KnowledgeNodeService nodeService;

    @Operation(summary = "搜索知识点")
    @GetMapping
    public R<List<KnowledgeNode>> search(@RequestParam String q) {
        List<KnowledgeNode> results = nodeService.lambdaQuery()
                .eq(KnowledgeNode::getStatus, 1)
                .and(w -> w
                        .like(KnowledgeNode::getTitle, q)
                        .or()
                        .like(KnowledgeNode::getSummary, q))
                .last("LIMIT 20")
                .list();
        return R.ok(results);
    }
}
