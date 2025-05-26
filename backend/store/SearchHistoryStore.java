package store;

import java.util.LinkedList;
import java.util.List;

public class SearchHistoryStore {
    private static final LinkedList<String> history = new LinkedList<>();
    private static final int MAX_SIZE = 40;

    public static void add(String username) {
        if (username == null || username.trim().isEmpty()) return;

        username = username.trim();

        // Remove duplicate entry if already in history
        history.remove(username);

        // Add to top
        history.addFirst(username);

        // Keep only last MAX_SIZE
        if (history.size() > MAX_SIZE) {
            history.removeLast();
        }
    }

    public static List<String> getHistory() {
        return new LinkedList<>(history); // return copy
    }
}
