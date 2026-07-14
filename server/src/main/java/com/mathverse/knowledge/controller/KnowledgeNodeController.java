package com.mathverse.knowledge.controller;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.mathverse.common.exception.BusinessException;
import com.mathverse.common.exception.ErrorCode;
import com.mathverse.common.result.PageResult;
import com.mathverse.common.result.R;
import com.mathverse.knowledge.dto.KnowledgeNodeDTO;
import com.mathverse.knowledge.dto.KnowledgeNodeDetailVO;
import com.mathverse.knowledge.dto.RelationVO;
import com.mathverse.knowledge.entity.KnowledgeNode;
import com.mathverse.knowledge.entity.KnowledgeRelation;
import com.mathverse.knowledge.service.KnowledgeNodeService;
import com.mathverse.knowledge.service.KnowledgeRelationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "知识点管理")
@RestController
@RequestMapping("/knowledge/nodes")
@RequiredArgsConstructor
public class KnowledgeNodeController {

    private final KnowledgeNodeService nodeService;
    private final KnowledgeRelationService relationService;
    private final ObjectMapper objectMapper;

    @Operation(summary = "知识点列表（分页）")
    @GetMapping
    public R<PageResult<KnowledgeNode>> list(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {

        LambdaQueryWrapper<KnowledgeNode> wrapper = new LambdaQueryWrapper<KnowledgeNode>()
                .eq(KnowledgeNode::getStatus, 1)
                .eq(StrUtil.isNotBlank(domain), KnowledgeNode::getDomain, domain)
                .eq(StrUtil.isNotBlank(level), KnowledgeNode::getLevel, level)
                .and(StrUtil.isNotBlank(keyword), w -> w
                        .like(KnowledgeNode::getTitle, keyword)
                        .or()
                        .like(KnowledgeNode::getSummary, keyword))
                .orderByAsc(KnowledgeNode::getDomain)
                .orderByAsc(KnowledgeNode::getSortOrder);

        Page<KnowledgeNode> p = nodeService.page(new Page<>(page, pageSize), wrapper);
        return R.ok(PageResult.of(p.getRecords(), p.getTotal(), p.getCurrent(), p.getSize()));
    }

    @Operation(summary = "知识点搜索")
    @GetMapping("/search")
    public R<List<KnowledgeNode>> search(@RequestParam String q) {
        LambdaQueryWrapper<KnowledgeNode> wrapper = new LambdaQueryWrapper<KnowledgeNode>()
                .eq(KnowledgeNode::getStatus, 1)
                .and(w -> w
                        .like(KnowledgeNode::getTitle, q)
                        .or()
                        .like(KnowledgeNode::getSummary, q)
                        .or()
                        .like(KnowledgeNode::getDomain, q))
                .orderByAsc(KnowledgeNode::getDomain)
                .orderByAsc(KnowledgeNode::getSortOrder);
        return R.ok(nodeService.list(wrapper));
    }

    @Operation(summary = "知识点详情")
    @GetMapping("/{id}")
    public R<KnowledgeNodeDetailVO> detail(@PathVariable String id) {
        KnowledgeNode node = nodeService.getById(id);
        if (node == null) {
            throw new BusinessException(ErrorCode.NODE_NOT_FOUND);
        }

        // 查询关系
        List<KnowledgeRelation> allRelations = relationService.lambdaQuery()
                .eq(KnowledgeRelation::getFromNodeId, id)
                .or()
                .eq(KnowledgeRelation::getToNodeId, id)
                .list();

        // 解析前置和后继
        // 关系约定：fromNodeId → toNodeId
        // prerequisite: from 是需要的前置知识，to 是依赖方
        // next: from 是当前知识，to 是后续知识
        List<RelationVO> prerequisites = allRelations.stream()
                .filter(r -> "prerequisite".equals(r.getRelationType()) && id.equals(r.getToNodeId()))
                .map(r -> {
                    KnowledgeNode pre = nodeService.getById(r.getFromNodeId());
                    RelationVO vo = new RelationVO();
                    vo.setNodeId(r.getFromNodeId());
                    vo.setTitle(pre != null ? pre.getTitle() : "未知");
                    vo.setRelationType(r.getRelationType());
                    vo.setDescription(r.getDescription());
                    return vo;
                })
                .toList();

        List<RelationVO> nextNodes = allRelations.stream()
                .filter(r -> "next".equals(r.getRelationType()) && id.equals(r.getFromNodeId()))
                .map(r -> {
                    KnowledgeNode next = nodeService.getById(r.getToNodeId());
                    RelationVO vo = new RelationVO();
                    vo.setNodeId(r.getToNodeId());
                    vo.setTitle(next != null ? next.getTitle() : "未知");
                    vo.setRelationType(r.getRelationType());
                    vo.setDescription(r.getDescription());
                    return vo;
                })
                .toList();

        List<RelationVO> references = allRelations.stream()
                .filter(r -> "reference".equals(r.getRelationType()))
                .map(r -> {
                    String otherId = id.equals(r.getFromNodeId()) ? r.getToNodeId() : r.getFromNodeId();
                    KnowledgeNode ref = nodeService.getById(otherId);
                    RelationVO vo = new RelationVO();
                    vo.setNodeId(otherId);
                    vo.setTitle(ref != null ? ref.getTitle() : "未知");
                    vo.setRelationType(r.getRelationType());
                    vo.setDescription(r.getDescription());
                    return vo;
                })
                .toList();

        KnowledgeNodeDetailVO vo = new KnowledgeNodeDetailVO();
        vo.setId(node.getId());
        vo.setTitle(node.getTitle());
        vo.setSubtitle(node.getSubtitle());
        vo.setDomain(node.getDomain());
        vo.setLevel(node.getLevel());
        vo.setDifficulty(node.getDifficulty());
        vo.setSortOrder(node.getSortOrder());
        vo.setVisualType(node.getVisualType());
        vo.setSummary(node.getSummary());
        // 解析 contentJson 字符串为 JSON 对象
        if (node.getContentJson() != null) {
            try {
                // 先修复 LaTeX 反斜杠（\(letter) → \\(letter)，使 JSON 解析器能正确处理
                String raw = node.getContentJson();
                // 使用更宽松的解析器，允许非标准 JSON 转义（如 \frac、\cdot 等 LaTeX 命令）
                ObjectMapper relaxedMapper = JsonMapper.builder()
                        .enable(com.fasterxml.jackson.core.json.JsonReadFeature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER)
                        .build();
                vo.setContentJson(relaxedMapper.readTree(raw));
            } catch (Exception e) {
                // contentJson 解析失败，返回原始字符串
                vo.setContentJson(node.getContentJson());
            }
        }
        vo.setMilestoneType(node.getMilestoneType());
        vo.setStatus(node.getStatus());
        vo.setPrerequisites(prerequisites);
        vo.setNextNodes(nextNodes);
        vo.setReferences(references);

        return R.ok(vo);
    }

    @Operation(summary = "新增知识点")
    @PostMapping
    public R<Void> create(@RequestBody KnowledgeNodeDTO dto) {
        if (nodeService.getById(dto.getId()) != null) {
            throw new BusinessException(ErrorCode.NODE_ID_EXISTS);
        }
        KnowledgeNode node = new KnowledgeNode();
        node.setId(dto.getId());
        node.setTitle(dto.getTitle());
        node.setSubtitle(dto.getSubtitle());
        node.setDomain(dto.getDomain());
        node.setLevel(dto.getLevel());
        node.setDifficulty(dto.getDifficulty());
        node.setSortOrder(dto.getSortOrder());
        node.setVisualType(dto.getVisualType());
        node.setSummary(dto.getSummary());
        node.setContentJson(dto.getContentJson());
        node.setMilestoneType(dto.getMilestoneType());
        node.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);
        nodeService.save(node);
        return R.ok();
    }

    @Operation(summary = "更新知识点")
    @PutMapping("/{id}")
    public R<Void> update(@PathVariable String id, @RequestBody KnowledgeNodeDTO dto) {
        KnowledgeNode node = nodeService.getById(id);
        if (node == null) {
            throw new BusinessException(ErrorCode.NODE_NOT_FOUND);
        }
        node.setTitle(dto.getTitle());
        node.setSubtitle(dto.getSubtitle());
        node.setDomain(dto.getDomain());
        node.setLevel(dto.getLevel());
        node.setDifficulty(dto.getDifficulty());
        node.setSortOrder(dto.getSortOrder());
        node.setVisualType(dto.getVisualType());
        node.setSummary(dto.getSummary());
        node.setContentJson(dto.getContentJson());
        node.setMilestoneType(dto.getMilestoneType());
        node.setStatus(dto.getStatus());
        nodeService.updateById(node);
        return R.ok();
    }

    @Operation(summary = "删除知识点")
    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable String id) {
        if (!nodeService.removeById(id)) {
            throw new BusinessException(ErrorCode.NODE_NOT_FOUND);
        }
        // 同时删除相关关系
        relationService.lambdaQuery()
                .eq(KnowledgeRelation::getFromNodeId, id)
                .or()
                .eq(KnowledgeRelation::getToNodeId, id)
                .list()
                .forEach(r -> relationService.removeById(r.getId()));
        return R.ok();
    }
}
