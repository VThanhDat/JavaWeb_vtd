package com.aris.javaweb_vtd.elasticsearch.converter;

import com.aris.javaweb_vtd.entity.Item;
import com.aris.javaweb_vtd.dto.item.response.ItemResponseDTO;
import com.aris.javaweb_vtd.elasticsearch.document.ItemDocument;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ItemDocumentConverter {

  ItemDocument toDocument(Item item);

  ItemDocument toDocument(ItemResponseDTO dto);

  ItemResponseDTO toResponseDTO(ItemDocument document);
}