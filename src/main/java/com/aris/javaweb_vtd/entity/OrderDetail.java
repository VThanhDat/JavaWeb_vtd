package com.aris.javaweb_vtd.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetail {
    private Long id;
    private Integer quantity;
    private Double price;
    private Long orderId;
    private Long itemId;
    private Item item;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
