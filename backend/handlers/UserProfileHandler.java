package handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class UserProfileHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        System.out.println("Incoming request...");

        String path = exchange.getRequestURI().getPath();
        String[] segments = path.split("/");

        if (segments.length != 4) {
            String errorMsg = "{\"error\":\"Invalid path format. Use /api/user/:username\"}";
            exchange.sendResponseHeaders(400, errorMsg.length());
            exchange.getResponseBody().write(errorMsg.getBytes());
            exchange.getResponseBody().close();
            return;
        }

        String username = segments[3];
        store.SearchHistoryStore.add("profile:"+username);
        String apiUrl = "https://api.github.com/users/" + username;

        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/vnd.github.v3+json");

        int responseCode = conn.getResponseCode();
        if (responseCode == 404) {
            String notFound = "{\"error\":\"GitHub user not found\"}";
            exchange.sendResponseHeaders(404, notFound.length());
            exchange.getResponseBody().write(notFound.getBytes());
            exchange.getResponseBody().close();
            return;
        } else if (responseCode != 200) {
            String errorMsg = "{\"error\":\"Failed to fetch GitHub user. Response code: " + responseCode + "\"}";
            exchange.sendResponseHeaders(500, errorMsg.length());
            exchange.getResponseBody().write(errorMsg.getBytes());
            exchange.getResponseBody().close();
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
}
