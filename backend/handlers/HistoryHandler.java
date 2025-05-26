package handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import store.SearchHistoryStore;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public class HistoryHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            send(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        List<String> history = SearchHistoryStore.getHistory();

        StringBuilder json = new StringBuilder();
        json.append("{ \"recentSearches\": [");
        for (int i = 0; i < history.size(); i++) {
            json.append("\"").append(history.get(i)).append("\"");
            if (i < history.size() - 1) {
                json.append(", ");
            }
        }
        json.append("] }");

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
