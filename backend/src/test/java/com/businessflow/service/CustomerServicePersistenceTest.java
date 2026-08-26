package com.businessflow.service;

import com.businessflow.dto.CustomerCreateRequest;
import com.businessflow.dto.CustomerResponse;
import com.businessflow.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class CustomerServicePersistenceTest {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    void shouldPersistCreatedCustomer() {
        CustomerResponse created = customerService.createCustomer(new CustomerCreateRequest("Gamma SA", "78.111.222-3", "hola@gamma.cl"));

        assertThat(created.id()).isNotNull();
        assertThat(customerRepository.findAll()).hasSizeGreaterThan(0);
        assertThat(customerRepository.findById(created.id()).orElseThrow().getName()).isEqualTo("Gamma SA");
    }
}
