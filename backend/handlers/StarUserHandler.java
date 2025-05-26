package handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import store.StarredUsersStore;
import utils.CorsUtil;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;

public class StarUserHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsUtil.handlePreflight(exchange)) return;
        CorsUtil.addCORSHeaders(exchange);
        
        if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
            send(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()));
        StringBuilder body = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            body.append(line);
        }

        // Expected body: {"username":"octocat"}
        String requestBody = body.toString();
        String username = extractUsername(requestBody);

        if (username == null || username.trim().isEmpty()) {
            send(exchange, 400, "{\"error\":\"Invalid or missing 'username'\"}");
            return;
        }

        StarredUsersStore.addUser(username.trim());

        String response = "{\"message\":\"User '" + username + "' starred successfully\"}";
        send(exchange, 200, response);
    }

private String extractUsername(String json) {
    try {
        json = json.trim();
        if (json.startsWith("{") && json.endsWith("}")) {
            json = json.substring(1, json.length() - 1); // remove { }
        }

        String[] pair = json.split(":", 2); // only split into 2 parts
        if (pair.length == 2) {
            String key = pair[0].trim().replaceAll("\"", "");
            String rawValue = pair[1].trim().replaceAll("\"", "");

            if (!key.equals("username")) {
                return null; // ❌ invalid key
            }

            return rawValue;
        }
    } catch (Exception e) {
        return null;
    }
    return null;
}

    private void send(HttpExchange exchange, int statusCode, String body) throws IOException {
        byte[] response = body.getBytes();
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, response.length);
        OutputStream os = exchange.getResponseBody();
        os.write(response);
        os.close();
    }
}
