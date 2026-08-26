package com.businessflow.receipt.integration;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class BillingIntegrationClient {
    private final RestTemplate restTemplate = new RestTemplate();

    public boolean validateInvoice(String invoiceId) {
        try {
            String url = "http://billing-service:8084/api/health";
            String response = restTemplate.getForObject(url, String.class);
            return response != null && response.contains("billing-service");
        } catch (Exception ex) {
            return false;
        }
    }
}
