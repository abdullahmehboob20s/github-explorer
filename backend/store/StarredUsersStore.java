package store;

import java.util.ArrayList;
import java.util.List;

public class StarredUsersStore {
    private static final List<String> starredUsers = new ArrayList<>();

    public static void addUser(String username) {
        if (!starredUsers.contains(username)) {
            starredUsers.add(username);
        }
    }

    public static List<String> getUsers() {
        return starredUsers;
    }
}
