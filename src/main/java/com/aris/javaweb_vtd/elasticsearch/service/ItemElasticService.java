package com.aris.javaweb_vtd.elasticsearch.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aris.javaweb_vtd.dto.common.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.common.PageDTO;
import com.aris.javaweb_vtd.dto.item.response.ItemResponseDTO;
import com.aris.javaweb_vtd.elasticsearch.converter.ItemDocumentConverter;
import com.aris.javaweb_vtd.elasticsearch.document.ItemDocument;
import com.aris.javaweb_vtd.elasticsearch.repository.ItemSearchRepository;

@Service
public class ItemElasticService {

  @Autowired
  private ItemSearchRepository itemSearchRepository;

  @Autowired
  private ItemDocumentConverter itemDocumentConverter;

  public void indexItem(ItemResponseDTO dto) {
    ItemDocument document = itemDocumentConverter.toDocument(dto);
    itemSearchRepository.save(document);
  }

  public PageDTO<ItemResponseDTO> searchItemsAsDTO(ItemSearchDTO searchDTO) {
    PageDTO<ItemDocument> documentPage = itemSearchRepository.searchItems(searchDTO);

    List<ItemResponseDTO> content = documentPage.getItems().stream()
        .map(itemDocumentConverter::toResponseDTO)
        .toList();

    return new PageDTO<>(
        content,
        documentPage.getCurrentPage(),
        documentPage.getTotalItems(),
        documentPage.getTotalPages());
  }

}
