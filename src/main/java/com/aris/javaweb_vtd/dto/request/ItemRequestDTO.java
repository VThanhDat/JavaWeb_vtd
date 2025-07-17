package com.aris.javaweb_vtd.dto.request;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Digits;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequestDTO {

    private Long id;

    @Size(max = 30, message = "Item name must not exceed 30 characters")
    private String name;

    @Size(max = 60, message = "Description max 60 characters")
    private String description;

    @Digits(integer = 10, fraction = 0, message = "Price must be a number")
    private Double price;

    @Pattern(regexp = "^(food|drink)$", message = "Type must be 'food' or 'drink'")
    private String type;

    private Integer status;

    private MultipartFile image;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}