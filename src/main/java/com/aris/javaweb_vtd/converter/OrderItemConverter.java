package com.aris.javaweb_vtd.converter;

import com.aris.javaweb_vtd.dto.order.response.OrderItemResponseDTO;
import com.aris.javaweb_vtd.entity.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderItemConverter {

    OrderItemResponseDTO toResponseDTO(OrderDetail detail);
}