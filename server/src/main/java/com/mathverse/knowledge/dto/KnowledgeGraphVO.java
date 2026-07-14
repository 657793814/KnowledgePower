package com.mathverse.knowledge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeGraphVO {
    private java.util.List<GraphNodeVO> nodes;
    private java.util.List<GraphEdgeVO> edges;
}
