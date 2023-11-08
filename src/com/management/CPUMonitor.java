package com.management;

import com.sun.management.OperatingSystemMXBean;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.management.ManagementFactory;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class CPUMonitor {
    private static List<Double> cpuUsageData = new ArrayList<>();
    
    public static void main(String[] args) throws IOException {
        OperatingSystemMXBean osMxBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/cpu-usage", new CPUUsageHandler(osMxBean));
        server.createContext("/get-cpu-usage", new GetCPUUsageHandler());
        server.setExecutor(null);
        server.start();

        // Schedule a task to update CPU usage every 5 seconds
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> {
            try {
                updateCPUUsage(osMxBean);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }, 0, 5, TimeUnit.SECONDS);
    }

    static class CPUUsageHandler implements HttpHandler {
        private final OperatingSystemMXBean osMxBean;

        public CPUUsageHandler(OperatingSystemMXBean osMxBean) {
            this.osMxBean = osMxBean;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            double cpuUsage = osMxBean.getSystemCpuLoad() * 100;
            String response = "CPU Usage: " + cpuUsage + "%";
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
            exchange.getResponseHeaders().add("Access-Control-Allow-Credentials", "true");
            exchange.sendResponseHeaders(200, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();

            // Save CPU usage data to the in-memory list
            cpuUsageData.add(cpuUsage);
        }
    }

    static class GetCPUUsageHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            StringBuilder responseData = new StringBuilder();
            for (Double usage : cpuUsageData) {
                responseData.append(usage).append(", ");
            }
            // Remove the trailing comma and space
            if (responseData.length() > 0) {
                responseData.setLength(responseData.length() - 2);
            }
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
            exchange.getResponseHeaders().add("Access-Control-Allow-Credentials", "true");
            exchange.sendResponseHeaders(200, responseData.length());
            OutputStream os = exchange.getResponseBody();
            os.write(responseData.toString().getBytes());
            os.close();
        }
    }

    private static void updateCPUUsage(OperatingSystemMXBean osMxBean) throws IOException {
        double cpuUsage = osMxBean.getSystemCpuLoad() * 100;
        String response = "CPU Usage: " + cpuUsage + "%";
        // Save CPU usage data to the in-memory list
        cpuUsageData.add(cpuUsage);
    }
}
