package com.aris.javaweb_vtd.service.order;

import java.util.List;

import com.aris.javaweb_vtd.dto.request.CreateOrderRequestDTO;
import com.aris.javaweb_vtd.dto.response.OrderResponseDTO;

public interface OrderService {
    public void createOrder(CreateOrderRequestDTO request);

    List<OrderResponseDTO> getOrders();
}
