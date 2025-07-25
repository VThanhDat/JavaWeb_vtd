package com.aris.javaweb_vtd.dto.order.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryDTO {
    private Long id;
    private String status;
    private String createAt;
    private Integer totalItems;
    private Integer totalPrice;

    private Long itemId;
    private String itemName;
    private String itemDescription;
    private String itemImage;
    private String itemType;

    private Integer price;
    private Integer quantity;
}
