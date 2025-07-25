package com.aris.javaweb_vtd.dto.order.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String img;
    private String type;
    private Integer price;
    private Integer quantity;
}
