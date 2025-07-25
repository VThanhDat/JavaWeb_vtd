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
    private String createAt;
    private String status;
    private Integer shippingFee;
    private Integer totalItems;
    private Integer subTotal;
    private Integer totalPrice;
}
