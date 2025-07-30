package com.aris.javaweb_vtd.elasticsearch.repository;

import com.aris.javaweb_vtd.elasticsearch.document.ItemDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface ItemSearchRepository extends ElasticsearchRepository<ItemDocument, Long> {

    List<ItemDocument> findByNameContainingIgnoreCase(String name);

    List<ItemDocument> findByType(String type);

    List<ItemDocument> findByStatus(Integer status);
}
