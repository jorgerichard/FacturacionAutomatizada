package com.businessflow.receipt.integration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class CustomerIntegrationClient {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String customerServiceUrl;

    public CustomerIntegrationClient(@Value("${receipt.customer-service-url}") String customerServiceUrl) {
        this.customerServiceUrl = customerServiceUrl;
    }

    public Customer findById(String customerId) {
        try {
            return restTemplate.getForObject(customerServiceUrl + "/api/customers/" + customerId, Customer.class);
        } catch (Exception ex) {
            return null;
        }
    }

    public record Customer(Long id, String name, String rut, String email) {
    }
}