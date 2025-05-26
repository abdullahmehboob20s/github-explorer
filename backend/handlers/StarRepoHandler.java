package handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import store.StarredReposStore;
import utils.CorsUtil;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;

public class StarRepoHandler implements HttpHandler {
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

        // Expected body: {"fullName":"owner/repo"}
        String requestBody = body.toString();
        String fullName = extractFullName(requestBody);

        if (fullName == null || fullName.trim().isEmpty() || !fullName.contains("/")) {
            send(exchange, 400, "{\"error\":\"Invalid or missing 'fullName'. Format should be 'owner/repo'\"}");
            return;
        }

        StarredReposStore.addRepo(fullName.trim());

        String response = "{\"message\":\"Repository '" + fullName + "' starred successfully\"}";
        send(exchange, 200, response);
    }

   private String extractFullName(String json) {
    try {
        json = json.trim();
        if (json.startsWith("{") && json.endsWith("}")) {
            json = json.substring(1, json.length() - 1); // remove { }
        }

        String[] pair = json.split(":", 2); // split only once
        if (pair.length == 2) {
            String key = pair[0].trim().replaceAll("\"", "");
            String rawValue = pair[1].trim().replaceAll("\"", "");

            if (!key.equals("fullName")) {
                return null; // invalid key
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
