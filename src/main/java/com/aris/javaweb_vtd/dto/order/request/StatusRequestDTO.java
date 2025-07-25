package com.aris.javaweb_vtd.dto.order.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusRequestDTO {
    @NotBlank(message = "New status is required")
    private String status;
}
