package com.aris.javaweb_vtd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aris.javaweb_vtd.dto.common.ApiResponseDTO;
import com.aris.javaweb_vtd.dto.order.request.CreateOrderRequestDTO;
import com.aris.javaweb_vtd.dto.order.request.StatusRequestDTO;
import com.aris.javaweb_vtd.dto.order.response.OrderResponseDTO;
import com.aris.javaweb_vtd.dto.order.response.OrderSummaryDTO;
import com.aris.javaweb_vtd.service.order.OrderService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/order")
public class OrderController {

  @Autowired
  private OrderService orderService;

  @PostMapping("/add")
  public ResponseEntity<ApiResponseDTO<String>> createOrder(@RequestBody @Valid CreateOrderRequestDTO request) {
    try {
      orderService.createOrder(request);
      return ResponseEntity.ok(ApiResponseDTO.success("Successfully"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(ApiResponseDTO.error(e.getMessage()));
    }
  }

  @GetMapping
  public ResponseEntity<ApiResponseDTO<List<OrderSummaryDTO>>> getOrders(
      @RequestParam(required = false) List<String> status,
      @RequestParam(required = false, defaultValue = "all") String date) {
    List<OrderSummaryDTO> data = orderService.getOrders(status, date);
    return ResponseEntity.ok(ApiResponseDTO.success(data));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<OrderResponseDTO>> getItemById(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponseDTO.success(orderService.getOrderById(id)));
  }

  @PutMapping("/{id}/status")
  public ResponseEntity<ApiResponseDTO<String>> updateStatus(@PathVariable("id") Long orderId, @RequestBody StatusRequestDTO request) {
    try {
      String newStatus = request.getStatus();
      orderService.updateOrderStatus(orderId, newStatus);
      return ResponseEntity.ok(ApiResponseDTO.success("Successfull"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(ApiResponseDTO.error(e.getMessage()));
    }
  }
}
