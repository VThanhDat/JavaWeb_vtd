package com.aris.javaweb_vtd.converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.aris.javaweb_vtd.dto.request.ItemRequestDTO;
import com.aris.javaweb_vtd.dto.response.ItemResponseDTO;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ItemConverter {
  @Mapping(target = "image", source = "filename")
  @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
  @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
  ItemResponseDTO toResponseDTO(ItemRequestDTO dto, String filename);
}
