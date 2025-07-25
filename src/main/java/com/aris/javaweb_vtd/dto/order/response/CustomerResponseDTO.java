package com.aris.javaweb_vtd.dto.order.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponseDTO {
    private Long id;
    private String fullName;
    private String phone;
    private String city;
    private String ward;
    private String address;
    private String message;
}
