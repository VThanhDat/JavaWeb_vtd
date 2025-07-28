package com.aris.javaweb_vtd.util;

import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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

    public static String generateOrderCode() {
        int randomNum = 100000 + (int) (Math.random() * 900000);
        return "OD" + randomNum;
    }

    public String generateUniqueOrderCode() {
        String orderCode;
        do {
            orderCode = generateOrderCode();
        } while (orderMapper.existsOrderCode(orderCode));
        return orderCode;
    }
}
