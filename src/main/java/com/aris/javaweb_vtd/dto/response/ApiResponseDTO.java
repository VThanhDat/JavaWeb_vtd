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

	public static <T> ApiResponseDTO<T> success(String message, T data) {
		ApiResponseDTO<T> res = new ApiResponseDTO<>();
		res.success = true;
		res.message = message;
		res.data = data;
		return res;
	}

	public static <T> ApiResponseDTO<T> error(T data) {
		return new ApiResponseDTO<>(false, "error", data);
	}
}
