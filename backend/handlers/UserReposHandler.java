package handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import utils.CorsUtil;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class UserReposHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        System.out.println("UserReposHandler triggered");

        if (CorsUtil.handlePreflight(exchange)) return;

        CorsUtil.addCORSHeaders(exchange);

        String path = exchange.getRequestURI().getPath(); // /api/user-repos/username
        String[] segments = path.split("/");

        if (segments.length != 4) {
            String errorMsg = "{\"error\":\"Invalid path. Use /api/user-repos/:username\"}";
            send(exchange, 400, errorMsg);
            return;
        }

        String username = segments[3];
        store.SearchHistoryStore.add("repos:"+username);

        // Read query params
        String query = exchange.getRequestURI().getQuery(); // e.g. ?page=1&limit=10
        int page = 1;
        int limit = 10;

        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                String[] pair = param.split("=");
                if (pair.length == 2) {
                    if (pair[0].equals("page")) {
                        try {
                            page = Integer.parseInt(pair[1]);
                        } catch (NumberFormatException e) {
                            page = 1; // fallback
                        }
                    } else if (pair[0].equals("limit")) {
                        try {
                            limit = Integer.parseInt(pair[1]);
                            if (limit > 100) limit = 100; // GitHub max limit
                        } catch (NumberFormatException e) {
                            limit = 10; // fallback
                        }
                    }
                }
            }
        }

        String apiUrl = "https://api.github.com/users/" + username + "/repos?per_page=" + limit + "&page=" + page;

        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/vnd.github.v3+json");

        int responseCode = conn.getResponseCode();
        if (responseCode == 404) {
            send(exchange, 404, "{\"error\":\"User not found or no public repositories\"}");
            return;
        } else if (responseCode != 200) {
            send(exchange, 500, "{\"error\":\"GitHub error code: " + responseCode + "\"}");
            return;
        }

        Scanner scanner = new Scanner(conn.getInputStream());
        StringBuilder json = new StringBuilder();
        while (scanner.hasNext()) {
            json.append(scanner.nextLine());
        }
        scanner.close();

        byte[] response = json.toString().getBytes();
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, response.length);
        OutputStream os = exchange.getResponseBody();
        os.write(response);
        os.close();
    }

    private void send(HttpExchange exchange, int code, String message) throws IOException {
        byte[] response = message.getBytes();
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(code, response.length);
        OutputStream os = exchange.getResponseBody();
        os.write(response);
        os.close();
    }
}
