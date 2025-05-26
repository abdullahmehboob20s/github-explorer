package utils;

import com.sun.net.httpserver.HttpExchange;

public class CorsUtil {
    public static void addCORSHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }

    public static boolean handlePreflight(HttpExchange exchange) {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            addCORSHeaders(exchange);
            try {
                exchange.sendResponseHeaders(204, -1); // No Content
                exchange.close();
            } catch (Exception ignored) {}
            return true;
        }
        return false;
    }
}
