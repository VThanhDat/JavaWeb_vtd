package com.aris.javaweb_vtd.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aris.javaweb_vtd.dto.response.OrderResponseDTO;
import com.aris.javaweb_vtd.entity.Order;

@Mapper
public interface OrderMapper {
    void insertOrder(Order orderDTO);

    List<OrderResponseDTO> getOrders();
}
