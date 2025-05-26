package handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import utils.CorsUtil;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Scanner;

public class RepoSearchHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsUtil.handlePreflight(exchange)) return;
        CorsUtil.addCORSHeaders(exchange);
        
        String query = exchange.getRequestURI().getQuery(); // q=...&page=...&limit=...
        String keyword = null;
        int page = 1;
        int limit = 5; // ✅ Default limit is now 5

        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    if (pair[0].equals("q")) {
                        keyword = pair[1];
                    } else if (pair[0].equals("page")) {
                        try {
                            page = Integer.parseInt(pair[1]);
                        } catch (NumberFormatException e) {
                            page = 1;
                        }
                    } else if (pair[0].equals("limit")) {
                        try {
                            limit = Integer.parseInt(pair[1]);
                            if (limit > 100) limit = 100;
                        } catch (NumberFormatException e) {
                            limit = 5; // fallback to 5 if invalid
                        }
                    }
                }
            }
        }

        if (keyword == null || keyword.trim().isEmpty()) {
            send(exchange, 400, "{\"error\":\"Missing or empty search query 'q'\"}");
            return;
        }

        store.SearchHistoryStore.add("repo-search:"+keyword);

        // Encode full keyword to support spaces
        String encodedKeyword = URLEncoder.encode(keyword.trim(), "UTF-8");
        String apiUrl = "https://api.github.com/search/repositories?q=" + encodedKeyword +
                        "&per_page=" + limit + "&page=" + page;

        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/vnd.github.v3+json");

        int responseCode = conn.getResponseCode();
        if (responseCode != 200) {
            send(exchange, 500, "{\"error\":\"GitHub search failed. Code: " + responseCode + "\"}");
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
