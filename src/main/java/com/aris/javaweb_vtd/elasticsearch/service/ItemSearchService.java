package com.aris.javaweb_vtd.elasticsearch.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aris.javaweb_vtd.dto.item.response.ItemResponseDTO;
import com.aris.javaweb_vtd.elasticsearch.converter.ItemDocumentConverter;
import com.aris.javaweb_vtd.elasticsearch.document.ItemDocument;
import com.aris.javaweb_vtd.elasticsearch.repository.ItemSearchRepository;

@Service
public class ItemSearchService {

    @Autowired
    private ItemSearchRepository itemSearchRepository;

    @Autowired
    private ItemDocumentConverter itemDocumentConverter;

    public void indexItem(ItemResponseDTO dto) {
        ItemDocument document = itemDocumentConverter.toDocument(dto);
        itemSearchRepository.save(document);
    }
}
