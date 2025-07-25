package com.aris.javaweb_vtd.util;

import java.util.Map;
import java.util.Set;

public class OrderStatusUtil {
    private static final Map<String, Set<String>> validTransitions = Map.of(
        "new", Set.of("shipping", "cancelled"),
        "shipping", Set.of("completed", "cancelled")
    );

    public static boolean isValidTransition(String from, String to) {
        Set<String> nexts = validTransitions.get(from.toLowerCase());
        return nexts != null && nexts.contains(to.toLowerCase());
    }
}
