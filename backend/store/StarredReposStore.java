package store;

import java.util.ArrayList;
import java.util.List;

public class StarredReposStore {
    private static final List<String> starredRepos = new ArrayList<>();

    public static void addRepo(String fullName) {
        if (!starredRepos.contains(fullName)) {
            starredRepos.add(fullName);
        }
    }

    public static List<String> getRepos() {
        return starredRepos;
    }
}
