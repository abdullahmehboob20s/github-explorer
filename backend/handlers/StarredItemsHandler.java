package handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import store.StarredUsersStore;
import utils.CorsUtil;
import store.StarredReposStore;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public class StarredItemsHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsUtil.handlePreflight(exchange)) return;
        CorsUtil.addCORSHeaders(exchange);
        
        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            send(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        List<String> users = StarredUsersStore.getUsers();
        List<String> repos = StarredReposStore.getRepos();

        StringBuilder json = new StringBuilder();
        json.append("{\n");
        json.append("  \"users\": [");
        for (int i = 0; i < users.size(); i++) {
            json.append("\"").append(users.get(i)).append("\"");
            if (i < users.size() - 1) json.append(",");
        }
        json.append("],\n");

        json.append("  \"repos\": [");
        for (int i = 0; i < repos.size(); i++) {
            json.append("\"").append(repos.get(i)).append("\"");
            if (i < repos.size() - 1) json.append(",");
        }
        json.append("]\n}");

        send(exchange, 200, json.toString());
    }

    private void send(HttpExchange exchange, int code, String body) throws IOException {
        byte[] response = body.getBytes();
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(code, response.length);
        OutputStream os = exchange.getResponseBody();
        os.write(response);
        os.close();
    }
}
