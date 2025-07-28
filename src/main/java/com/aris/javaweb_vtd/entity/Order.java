package com.aris.javaweb_vtd.entity;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private Long id;
    private String orderCode;
    private Double totalPrice;
    private String status;
    private Long customerId;
    private Double shippingFee;
    private Customer customer;
    private List<OrderDetail> orderDetails;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
