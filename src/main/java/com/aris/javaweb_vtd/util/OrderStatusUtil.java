package com.aris.javaweb_vtd.util;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.aris.javaweb_vtd.dto.order.response.OrderItemResponseDTO;
import com.aris.javaweb_vtd.dto.order.response.OrderResponseDTO;

@Component
public class OrderStatusUtil {
  private static final Map<String, Set<String>> validTransitions = Map.of(
      "new", Set.of("shipping", "cancelled"),
      "shipping", Set.of("completed", "cancelled"));

  public boolean isValidTransition(String from, String to) {
    Set<String> nexts = validTransitions.get(from.toLowerCase());
    return nexts != null && nexts.contains(to.toLowerCase());
  }

  public static String generateOrderCode() {
    int randomNum = 100000 + (int) (Math.random() * 900000);
    return "OD" + randomNum;
  }

  public void computeOrderSummary(OrderResponseDTO order) {
    int totalItems = 0;
    int subTotal = 0;

    List<OrderItemResponseDTO> items = order.getItems();
    if (items != null) {
      for (OrderItemResponseDTO item : items) {
        int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
        int price = item.getPrice() != null ? item.getPrice().intValue() : 0;

        totalItems += quantity;
        subTotal += quantity * price;
      }
    }

    order.setTotalItems(totalItems);
    order.setSubTotal(subTotal);
  }
}
