package com.businessflow.billing.integration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class CustomerIntegrationClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String customerServiceUrl;

    public CustomerIntegrationClient(@Value("${billing.customer-service-url}") String customerServiceUrl) {
        this.customerServiceUrl = customerServiceUrl;
    }

    public Customer findById(Long customerId) {
        try {
            Customer customer = restTemplate.getForObject(
                    customerServiceUrl + "/api/customers/" + customerId,
                    Customer.class
            );
            if (customer == null) {
                throw new IllegalArgumentException("Cliente no encontrado: " + customerId);
            }
            return customer;
        } catch (RestClientException ex) {
            throw new IllegalArgumentException("Cliente no encontrado: " + customerId);
        }
    }

    public record Customer(Long id, String name, String rut, String email) {
    }
}
