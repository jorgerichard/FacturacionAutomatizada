package com.businessflow.receipt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableDiscoveryClient
public class ReceiptServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReceiptServiceApplication.class, args);
    }
}

@RestController
@RequestMapping("/api")
class HealthController {
    @GetMapping("/health")
    public String health() {
        return "receipt-service running";
    }
}
