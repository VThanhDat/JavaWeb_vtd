package com.aris.javaweb_vtd.exception;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.binding.BindingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.aris.javaweb_vtd.dto.response.ApiResponseDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiResponseDTO<Map<String, String>>> handleIllegalArgument(IllegalArgumentException e) {
		Map<String, String> error = new HashMap<>();
		error.put("error", e.getMessage());
		return ResponseEntity.badRequest().body(ApiResponseDTO.error("Invalid argument", error));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponseDTO<Map<String, String>>> handleValidationExceptions(
			MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getFieldErrors()
				.forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseDTO.error("Validation failed", errors));
	}

	@ExceptionHandler(BindingException.class)
	public ResponseEntity<ApiResponseDTO<Map<String, String>>> handleMyBatisBindingException(BindingException ex) {
		Map<String, String> error = new HashMap<>();

		if (ex.getMessage().contains("Invalid bound statement")) {
			error.put("error", "Mapper method not found");
			error.put("details", ex.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(ApiResponseDTO.error("Mapper not implemented or not declared in XML", error));
		}

		// fallback cho các BindingException khác
		error.put("error", "MyBatis Binding Error");
		error.put("details", ex.getMessage());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(ApiResponseDTO.error("Database mapping error", error));
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ApiResponseDTO<Map<String, String>>> handleIllegalState(IllegalStateException ex) {
		Map<String, String> error = new HashMap<>();
		error.put("error", "Illegal application state");
		error.put("details", ex.getMessage());

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(ApiResponseDTO.error("Internal configuration error", error));
	}

}
