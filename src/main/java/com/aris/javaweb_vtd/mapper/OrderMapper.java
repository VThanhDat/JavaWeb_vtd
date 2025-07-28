package com.aris.javaweb_vtd.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aris.javaweb_vtd.dto.common.OrderSearchDTO;
import com.aris.javaweb_vtd.dto.order.response.OrderResponseDTO;
import com.aris.javaweb_vtd.dto.order.response.OrderSummaryDTO;
import com.aris.javaweb_vtd.entity.Order;

@Mapper
public interface OrderMapper {
  void insertOrder(Order orderDTO);

  List<OrderSummaryDTO> getOrdersWithFilters(OrderSearchDTO search);

  boolean existsOrderCode(String orderCode);

  int countOrdersWithFilters(OrderSearchDTO search);

  OrderResponseDTO getOrderById(Long id);

  void updateOrderStatus(@Param("orderId") Long id, @Param("newStatus") String newStatus);

  OrderResponseDTO getOrderByOrderCode(String orderCode);
}
