package com.aris.javaweb_vtd.dto.order.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private List<OrderItemResponseDTO> items;
    private CustomerResponseDTO customer;
    private String orderCode;
    private String createAt;
    private String status;
    private Double shippingFee;
    private Double subTotal;
    private Double totalPrice;
}
