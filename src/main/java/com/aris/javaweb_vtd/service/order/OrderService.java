package com.aris.javaweb_vtd.service.order;

import java.util.List;

import com.aris.javaweb_vtd.dto.request.CreateOrderRequestDTO;
import com.aris.javaweb_vtd.dto.response.OrderResponseDTO;
import com.aris.javaweb_vtd.dto.response.OrderSummaryDTO;

public interface OrderService {
    void createOrder(CreateOrderRequestDTO request);

    List<OrderSummaryDTO> getOrders(List<String> statusList, String dateFilter);

    OrderResponseDTO getOrderById(Long id);

    void updateOrderStatus(Long orderId, String newStatus);
}
