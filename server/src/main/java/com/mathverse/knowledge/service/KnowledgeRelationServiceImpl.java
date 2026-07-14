package com.mathverse.knowledge.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mathverse.knowledge.entity.KnowledgeRelation;
import com.mathverse.knowledge.mapper.KnowledgeRelationMapper;
import org.springframework.stereotype.Service;

@Service
public class KnowledgeRelationServiceImpl extends ServiceImpl<KnowledgeRelationMapper, KnowledgeRelation>
        implements KnowledgeRelationService {
}
