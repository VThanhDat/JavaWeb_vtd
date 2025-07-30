package com.aris.javaweb_vtd.util;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.aris.javaweb_vtd.dto.order.response.OrderItemResponseDTO;
import com.aris.javaweb_vtd.dto.order.response.OrderResponseDTO;
import com.aris.javaweb_vtd.mapper.OrderMapper;

@Component
public class OrderStatusUtil {
  @Autowired
  private OrderMapper orderMapper;

  private static final Map<String, Set<String>> validTransitions = Map.of(
      "new", Set.of("shipping", "cancelled"),
      "shipping", Set.of("completed", "cancelled"));

  public boolean isValidTransition(String from, String to) {
    Set<String> nexts = validTransitions.get(from.toLowerCase());
    return nexts != null && nexts.contains(to.toLowerCase());
  }

  public String generateUniqueOrderCode() {
    String code;
    do {
      code = generateOrderCode();
    } while (orderMapper.existsOrderCode(code));
    return code;
  }

  public static String generateOrderCode() {
    int randomNum = 100000 + (int) (Math.random() * 900000);
    return "OD" + randomNum;
  }

  public void computeOrderSummary(OrderResponseDTO order) {
    Double subTotal = 0.0;

    List<OrderItemResponseDTO> items = order.getItems();
    if (items != null) {
      for (OrderItemResponseDTO item : items) {
        int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
        int price = item.getPrice() != null ? item.getPrice().intValue() : 0;

        subTotal += quantity * price;
      }
    }

    order.setSubTotal(subTotal);
  }
}
