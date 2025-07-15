package com.aris.javaweb_vtd.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aris.javaweb_vtd.dto.response.ApiResponseDTO;
import com.aris.javaweb_vtd.service.admin.AdminService;

@RestController
@RequestMapping("/admin/password")
public class PasswordController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/change")
    public ResponseEntity<ApiResponseDTO<String>> updatePassword(
            @RequestParam String currentPassword,
            @RequestParam String newPassword,
            Principal principal) {
        try {
            adminService.updatePassword(principal.getName(), currentPassword, newPassword);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "success", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false, "error", "Failed to update password"));
        }
    }
}
