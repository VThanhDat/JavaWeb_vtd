package com.aris.javaweb_vtd.dto.order.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRequestDTO {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Ward is required")
    private String ward;

    @NotBlank(message = "Address is required")
    private String address;

    private String message;
}