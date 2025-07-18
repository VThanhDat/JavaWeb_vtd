package com.aris.javaweb_vtd.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponseDTO<T> {
	private boolean success;
	private String message;
	private T data;

	public static <T> ApiResponseDTO<T> success(T data) {
		return new ApiResponseDTO<>(true, "success", data);
	}

	public static <T> ApiResponseDTO<T> error(T data) {
		return new ApiResponseDTO<>(false, "error", data);
	}
}
