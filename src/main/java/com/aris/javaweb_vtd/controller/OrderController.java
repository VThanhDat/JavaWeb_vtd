package com.aris.javaweb_vtd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aris.javaweb_vtd.dto.common.ApiResponseDTO;
import com.aris.javaweb_vtd.dto.common.OrderSearchDTO;
import com.aris.javaweb_vtd.dto.common.PageDTO;
import com.aris.javaweb_vtd.dto.order.request.StatusRequestDTO;
import com.aris.javaweb_vtd.dto.order.request.CreateOrderRequestDTO;
import com.aris.javaweb_vtd.dto.order.response.OrderResponseDTO;
import com.aris.javaweb_vtd.service.order.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/order")
public class OrderController {

  @Autowired
  private OrderService orderService;

  @Operation(summary = "Create order")
  @PostMapping("/add")
  public ResponseEntity<ApiResponseDTO<OrderResponseDTO>> createOrder(
      @RequestBody @Valid CreateOrderRequestDTO request) {
    return ResponseEntity.ok(ApiResponseDTO.success(orderService.createOrder(request)));
  }

  @Operation(summary = "Get all orders by filters and can pagination")
  @GetMapping
  public ResponseEntity<ApiResponseDTO<PageDTO<OrderResponseDTO>>> getOrders(OrderSearchDTO orderSearchDTO) {
    PageDTO<OrderResponseDTO> data = orderService.getOrders(orderSearchDTO);
    return ResponseEntity.ok(ApiResponseDTO.success(data));
  }

  @Operation(summary = "Get order by id")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<OrderResponseDTO>> getItemById(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponseDTO.success(orderService.getOrderById(id)));
  }

  @Operation(summary = "Update status order")
  @PutMapping("/{id}/status")
  public ResponseEntity<ApiResponseDTO<String>> updateStatus(@PathVariable("id") Long orderId,
      @RequestBody StatusRequestDTO request) {
    try {
      String newStatus = request.getStatus();
      orderService.updateOrderStatus(orderId, newStatus);
      return ResponseEntity.ok(ApiResponseDTO.success("Successfull"));
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.badRequest().body(ApiResponseDTO.error(e.getMessage()));
    }
  }

  @Operation(summary = "Get order by order code")
  @GetMapping("/ordercode/{orderCode}")
  public ResponseEntity<ApiResponseDTO<OrderResponseDTO>> getItemByOrderCode(@PathVariable String orderCode) {
    return ResponseEntity.ok(ApiResponseDTO.success(orderService.getOrderByOrderCode(orderCode)));
  }
}
