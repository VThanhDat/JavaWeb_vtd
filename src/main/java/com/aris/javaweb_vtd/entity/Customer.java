package com.aris.javaweb_vtd.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    private Long id;
    private String fullName;
    private String phone;
    private String city;
    private String ward;
    private String address;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
