package com.aris.javaweb_vtd.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminRequestDTO {
    private Long id;
    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 100, message = "Username must be between 2 and 100 characters")
    private String username;
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
