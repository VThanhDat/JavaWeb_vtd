package com.aris.javaweb_vtd.service.order;

import com.aris.javaweb_vtd.dto.request.CreateOrderRequestDTO;

public interface OrderService {
    public void createOrder(CreateOrderRequestDTO request);
}
