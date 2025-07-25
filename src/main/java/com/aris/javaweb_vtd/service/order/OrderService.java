package com.aris.javaweb_vtd.service.order;

import com.aris.javaweb_vtd.dto.common.OrderSearchDTO;
import com.aris.javaweb_vtd.dto.common.PageDTO;
import com.aris.javaweb_vtd.dto.order.request.CreateOrderRequestDTO;
import com.aris.javaweb_vtd.dto.order.response.OrderResponseDTO;
import com.aris.javaweb_vtd.dto.order.response.OrderSummaryDTO;

public interface OrderService {
    void createOrder(CreateOrderRequestDTO request);

    PageDTO<OrderSummaryDTO> getOrders(OrderSearchDTO orderSearchDTO);

    OrderResponseDTO getOrderById(Long id);

    void updateOrderStatus(Long orderId, String newStatus);
}
