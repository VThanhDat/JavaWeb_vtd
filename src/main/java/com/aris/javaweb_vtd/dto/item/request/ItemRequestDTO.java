package com.aris.javaweb_vtd.dto.item.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequestDTO {
  private Long id;

  @NotBlank(message = "Name is required")
  @Size(max = 100, message = "Item name must not exceed 100 characters")
  private String name;

  @Size(max = 500, message = "Description max 500 characters")
  private String description;

  @NotNull(message = "Price is required")
  @Digits(integer = 10, fraction = 0, message = "Price must be a number and maxlength is 10")
  @Min(value = 1, message = "Price must be greater than 0")
  private Double price;

  @Pattern(regexp = "^(food|drink)$", message = "Type must be 'food' or 'drink'")
  private String type;

  private Integer status;

  private MultipartFile image;
}