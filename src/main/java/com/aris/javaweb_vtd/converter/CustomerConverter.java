package com.aris.javaweb_vtd.converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.aris.javaweb_vtd.dto.request.CustomerRequestDTO;
import com.aris.javaweb_vtd.entity.Customer;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerConverter {
  
  @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
  @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
  Customer toEntity(CustomerRequestDTO dto);
}
