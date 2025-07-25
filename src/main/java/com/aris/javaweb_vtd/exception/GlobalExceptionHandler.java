package com.aris.javaweb_vtd.exception;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.binding.BindingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.aris.javaweb_vtd.dto.common.ApiResponseDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiResponseDTO<String>> handleIllegalArgument(IllegalArgumentException ex) {
    return ResponseEntity.badRequest().body(ApiResponseDTO.error(ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponseDTO<String>> handleValidationException(MethodArgumentNotValidException ex) {
    String errorMessage = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .findFirst()
        .map(error -> error.getDefaultMessage())
        .orElse("Validation failed");

    return ResponseEntity.badRequest()
        .body(ApiResponseDTO.error(errorMessage));
  }

  @ExceptionHandler(BindingException.class)
  public ResponseEntity<ApiResponseDTO<Map<String, String>>> handleMyBatisBindingException(BindingException ex) {
    Map<String, String> error = new HashMap<>();

    if (ex.getMessage().contains("Invalid bound statement")) {
      error.put("error", "Mapper method not found");
      error.put("details", ex.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(ApiResponseDTO.error(error));
    }

    error.put("error", "MyBatis Binding Error");
    error.put("details", ex.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponseDTO.error(error));
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ApiResponseDTO<Map<String, String>>> handleIllegalState(IllegalStateException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("error", "Illegal application state");
    error.put("details", ex.getMessage());

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponseDTO.error(error));
  }

  @ExceptionHandler(NoResourceFoundException.class)
  public ResponseEntity<ApiResponseDTO<Map<String, String>>> handleNoResourceFound(NoResourceFoundException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("error", "Page not found");
    error.put("details", ex.getMessage());

    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(ApiResponseDTO.error(error));
  }

  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<ApiResponseDTO<Map<String, String>>> handleMissingParams(
      MissingServletRequestParameterException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("missingParameter", ex.getParameterName());
    error.put("error", "Required parameter is missing");

    return ResponseEntity.badRequest()
        .body(ApiResponseDTO.error(error));
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ApiResponseDTO<String>> handleRuntimeException(RuntimeException e) {
    return ResponseEntity.status(500).body(ApiResponseDTO.error("Internal error: " + e.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponseDTO<String>> handleGenericException(Exception e) {
    return ResponseEntity.status(500).body(ApiResponseDTO.error("Unexpected error"));
  }
}