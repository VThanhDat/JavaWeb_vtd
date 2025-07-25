package com.aris.javaweb_vtd.dto.order.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDTO {

    @NotNull(message = "Customer information is required")
    private CustomerRequestDTO customer;

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequestDTO> items;

    @NotNull(message = "Shipping fee must not be null")
    private Double shippingFee;
}