import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws Exception {
        System.out.println("\n");
        
        int port = 8000;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        Server.registerRoutes(server);
        server.setExecutor(null); // default executor
        System.out.println("Server running on http://localhost:" + port);
        server.start();
    }
}