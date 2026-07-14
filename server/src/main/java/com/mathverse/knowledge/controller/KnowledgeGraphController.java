package com.mathverse.knowledge.controller;

import com.mathverse.common.result.R;
import com.mathverse.knowledge.dto.KnowledgeGraphVO;
import com.mathverse.knowledge.service.KnowledgeGraphService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "知识图谱查询")
@RestController
@RequestMapping("/knowledge/graph")
@RequiredArgsConstructor
public class KnowledgeGraphController {

    private final KnowledgeGraphService graphService;

    @Operation(summary = "获取全量知识图谱")
    @GetMapping
    public R<KnowledgeGraphVO> getFullGraph() {
        return R.ok(graphService.getFullGraph());
    }

    @Operation(summary = "按领域获取知识图谱")
    @GetMapping("/{domain}")
    public R<KnowledgeGraphVO> getGraphByDomain(@PathVariable String domain) {
        return R.ok(graphService.getGraphByDomain(domain));
    }
}
