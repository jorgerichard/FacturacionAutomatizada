package com.businessflow.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayServiceApplication.class, args);
    }
}

@RestController
@RequestMapping("/api")
class GatewayController {
    @GetMapping("/health")
    public String health() {
        return "gateway-service running";
    }

    @GetMapping("/routes")
    public String routes() {
        return "auth:http://auth-service:8081/api/health, customer:http://customer-service:8082/api/health, catalog:http://catalog-service:8083/api/health, billing:http://billing-service:8084/api/health, receipt:http://receipt-service:8087/api/health";
    }

    @GetMapping("/health-check")
    public String healthCheck() {
        return "gateway-service running and reachable from Docker network";
    }
}
