package com.aris.javaweb_vtd.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.aris.javaweb_vtd.dto.order.response.OrderResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class OrderWebSocketHandler extends TextWebSocketHandler {

  private final Map<String, List<WebSocketSession>> orderSessions = new ConcurrentHashMap<>();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    String orderCode = getOrderCodeFromUri(session);
    orderSessions.computeIfAbsent(orderCode, k -> new ArrayList<>()).add(session);
    System.out.println("Client connected to order: " + orderCode);
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
    String orderCode = getOrderCodeFromUri(session);
    orderSessions.getOrDefault(orderCode, new ArrayList<>()).remove(session);
    System.out.println("Client disconnected from order: " + orderCode);
  }

  public void sendOrderUpdate(String orderCode, OrderResponseDTO orderData) {
    List<WebSocketSession> sessions = orderSessions.getOrDefault(orderCode, List.of());

    for (WebSocketSession session : sessions) {
      try {
        Map<String, Object> payload = Map.of(
            "type", "order_status_update",
            "order", orderData);
        String json = new ObjectMapper().writeValueAsString(payload);
        session.sendMessage(new TextMessage(json));
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  private String getOrderCodeFromUri(WebSocketSession session) {
    String uri = session.getUri().toString();
    return uri.substring(uri.lastIndexOf('/') + 1);
  }
}
