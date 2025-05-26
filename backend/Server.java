import com.sun.net.httpserver.HttpServer;

import handlers.HistoryHandler;
import handlers.PingHandler;
import handlers.ReadmeHandler;
import handlers.RepoSearchHandler;
import handlers.StarRepoHandler;
import handlers.StarUserHandler;
import handlers.StarredItemsHandler;
import handlers.UserProfileHandler;
import handlers.UserReposHandler;

public class Server {
    public static void registerRoutes(HttpServer server) {
        System.out.println("Came here");
        
        server.createContext("/api/ping", new PingHandler());
        server.createContext("/api/user", new UserProfileHandler());
        server.createContext("/api/user-repos", new UserReposHandler());
        server.createContext("/api/repo/readme", new ReadmeHandler());
        server.createContext("/api/search/repos", new RepoSearchHandler());

        server.createContext("/api/star/user", new StarUserHandler());
        server.createContext("/api/star/repo", new StarRepoHandler());
        server.createContext("/api/stars", new StarredItemsHandler());
        server.createContext("/api/history", new HistoryHandler());
    }
}
