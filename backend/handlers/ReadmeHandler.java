package handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class ReadmeHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String query = exchange.getRequestURI().getQuery(); // owner=...&repo=...
        String owner = null;
        String repo = null;

        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                String[] pair = param.split("=");
                if (pair.length == 2) {
                    if (pair[0].equals("owner")) {
                        owner = pair[1];
                    } else if (pair[0].equals("repo")) {
                        repo = pair[1];
                    }
                }
            }
        }

        if (owner == null || repo == null) {
            String error = "{\"error\":\"Missing 'owner' or 'repo' query parameters\"}";
            send(exchange, 400, error);
            return;
        }

        store.SearchHistoryStore.add("readme:"+owner+"/"+repo);

        String apiUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/readme";

        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/vnd.github.v3.raw");

        int responseCode = conn.getResponseCode();
        if (responseCode == 404) {
            send(exchange, 404, "{\"error\":\"README not found\"}");
            return;
        } else if (responseCode != 200) {
            send(exchange, 500, "{\"error\":\"GitHub error code: " + responseCode + "\"}");
            return;
        }

        Scanner scanner = new Scanner(conn.getInputStream());
        StringBuilder content = new StringBuilder();
        while (scanner.hasNext()) {
            content.append(scanner.nextLine()).append("\n");
        }
        scanner.close();

        byte[] response = content.toString().getBytes();
        exchange.getResponseHeaders().add("Content-Type", "text/plain");
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
