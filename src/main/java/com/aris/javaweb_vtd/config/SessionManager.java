package com.aris.javaweb_vtd.config;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import lombok.Data;

@Data
@Component
public class SessionManager {
    private final Map<String, WebSocketSession> idOrderSession = new ConcurrentHashMap<>();

    public void add(String orderId, WebSocketSession session) {
        WebSocketSession existingSession = idOrderSession.get(orderId);
        if (existingSession != null && existingSession.isOpen()) {
            try {
                existingSession.close();
                System.out.println("Closed existing session for order: " + orderId);
            } catch (Exception e) {
                System.err.println("Error closing existing session: " + e.getMessage());
            }
        }

        idOrderSession.put(orderId, session);
        System.out.println("Added WebSocket session for order: " + orderId +
                " (Total active sessions: " + idOrderSession.size() + ")");
    }

    public void remove(String orderId) {
        WebSocketSession removedSession = idOrderSession.remove(orderId);
        if (removedSession != null) {
            System.out.println("Removed WebSocket session for order: " + orderId +
                    " (Remaining sessions: " + idOrderSession.size() + ")");
        }
    }

    public void remove(WebSocketSession session) {
        String removedOrderId = null;
        for (Map.Entry<String, WebSocketSession> entry : idOrderSession.entrySet()) {
            if (entry.getValue().equals(session)) {
                removedOrderId = entry.getKey();
                break;
            }
        }

        if (removedOrderId != null) {
            idOrderSession.remove(removedOrderId);
            System.out.println("Removed WebSocket session for order: " + removedOrderId +
                    " (Remaining sessions: " + idOrderSession.size() + ")");
        }
    }

    public WebSocketSession get(String orderId) {
        WebSocketSession session = idOrderSession.get(orderId);
        if (session != null) {
            if (session.isOpen()) {
                System.out.println("Found active WebSocket session for order: " + orderId);
                return session;
            } else {
                // Session đã đóng, xóa khỏi map
                idOrderSession.remove(orderId);
                System.out.println("Removed closed session for order: " + orderId);
                return null;
            }
        } else {
            System.out.println("No WebSocket session found for order: " + orderId);
            return null;
        }
    }

    public int getActiveSessionCount() {
        return idOrderSession.size();
    }

    public void printAllActiveSessions() {
        System.out.println("Active WebSocket sessions:");
        idOrderSession.forEach((orderId, session) -> {
            System.out.println("  Order: " + orderId + " - Session: " +
                    (session.isOpen() ? "OPEN" : "CLOSED"));
        });
    }
}