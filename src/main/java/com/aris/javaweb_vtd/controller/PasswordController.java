package com.aris.javaweb_vtd.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aris.javaweb_vtd.dto.admin.request.ChangePasswordRequestDTO;
import com.aris.javaweb_vtd.dto.common.ApiResponseDTO;
import com.aris.javaweb_vtd.service.admin.AdminService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/password")
public class PasswordController {

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private AdminService adminService;

  @PutMapping("/change")
  public ResponseEntity<ApiResponseDTO<String>> updatePassword(
      @RequestBody @Valid ChangePasswordRequestDTO dto,
      Principal principal,
      HttpServletRequest request) {
    try {
      adminService.updatePassword(principal.getName(), dto);

      UsernamePasswordAuthenticationToken newAuthToken = new UsernamePasswordAuthenticationToken(
          principal.getName(), dto.getNewPassword());
      Authentication newAuth = authenticationManager.authenticate(newAuthToken);

      request.getSession().invalidate();
      HttpSession newSession = request.getSession(true);

      SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
      securityContext.setAuthentication(newAuth);
      SecurityContextHolder.setContext(securityContext);

      newSession.setAttribute(
          HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
          securityContext);

      return ResponseEntity
          .ok(new ApiResponseDTO<String>(true, "success", "Updated password successfully"));
    } catch (IllegalArgumentException | UsernameNotFoundException e) {
      return ResponseEntity.badRequest().body(new ApiResponseDTO<String>(false, "error", e.getMessage()));
    }
  }
}
