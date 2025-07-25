package com.aris.javaweb_vtd.dto.item.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponseDTO {
    private Long id;
    private String name;
    private String image;
    private String description;
    private Double price;
    private String type;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
