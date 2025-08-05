package com.aris.javaweb_vtd.config;

import java.net.URI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class WebSocketHandler extends TextWebSocketHandler {
    @Autowired
    private SessionManager sessionManager;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        try {
            URI uri = session.getUri();
            String query = uri.getQuery();

            if (query != null && query.contains("orderId=")) {
                String orderId = extractOrderId(query);
                if (orderId != null && !orderId.isEmpty()) {
                    sessionManager.add(orderId, session);
                    System.out.println("WebSocket connection established for order: " + orderId);
                } else {
                    System.err.println("Invalid orderId parameter in WebSocket connection");
                    session.close();
                }
            } else {
                System.err.println("Missing orderId parameter in WebSocket connection");
                session.close();
            }
        } catch (Exception e) {
            System.err.println("Error establishing WebSocket connection: " + e.getMessage());
            e.printStackTrace();
            session.close();
        }
    }

    private String extractOrderId(String query) {
        try {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("orderId=")) {
                    return param.split("=")[1];
                }
            }
        } catch (Exception e) {
            System.err.println("Error extracting orderId from query: " + e.getMessage());
        }
        return null;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Received message: " + message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessionManager.remove(session);
        System.out.println("WebSocket connection closed. Status: " + status.toString());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("WebSocket transport error: " + exception.getMessage());
        exception.printStackTrace();
        sessionManager.remove(session);
    }
}