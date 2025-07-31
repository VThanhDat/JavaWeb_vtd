package com.aris.javaweb_vtd.elasticsearch.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.aris.javaweb_vtd.elasticsearch.document.ItemDocument;

@Repository
public interface ItemSearchRepository extends ElasticsearchRepository<ItemDocument, Long>, ItemSearchCustomRepository {
}
