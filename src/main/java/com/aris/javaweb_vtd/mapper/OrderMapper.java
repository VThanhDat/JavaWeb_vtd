package com.aris.javaweb_vtd.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aris.javaweb_vtd.dto.order.response.OrderResponseDTO;
import com.aris.javaweb_vtd.dto.order.response.OrderSummaryDTO;
import com.aris.javaweb_vtd.entity.Order;

@Mapper
public interface OrderMapper {
  void insertOrder(Order orderDTO);

  List<OrderSummaryDTO> getOrdersByFilters(
      @Param("statusList") List<String> statusList,
      @Param("fromDate") LocalDateTime fromDate,
      @Param("toDate") LocalDateTime toDate);

  OrderResponseDTO getOrderById(Long id);

  void updateOrderStatus(@Param("orderId") Long id, @Param("newStatus") String newStatus);
}
