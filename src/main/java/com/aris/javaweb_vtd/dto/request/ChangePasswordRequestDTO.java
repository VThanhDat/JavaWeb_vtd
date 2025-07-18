package com.aris.javaweb_vtd.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequestDTO {
  @NotBlank(message = "Current password is required")
  private String currentPassword;

  @Size(min = 6, max = 100, message = "New password must be between 6 and 100 characters")
  private String newPassword;
}