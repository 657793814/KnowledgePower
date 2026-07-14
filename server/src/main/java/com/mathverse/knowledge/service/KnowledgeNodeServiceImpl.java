package com.mathverse.knowledge.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mathverse.knowledge.entity.KnowledgeNode;
import com.mathverse.knowledge.mapper.KnowledgeNodeMapper;
import org.springframework.stereotype.Service;

@Service
public class KnowledgeNodeServiceImpl extends ServiceImpl<KnowledgeNodeMapper, KnowledgeNode>
        implements KnowledgeNodeService {
}
