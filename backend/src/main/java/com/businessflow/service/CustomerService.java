package com.businessflow.service;

import com.businessflow.dto.CustomerCreateRequest;
import com.businessflow.dto.CustomerResponse;
import com.businessflow.dto.CustomerUpdateRequest;
import com.businessflow.entity.CustomerEntity;
import com.businessflow.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerResponse> listCustomers() {
        return customerRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public Optional<CustomerResponse> getCustomer(Long id) {
        return customerRepository.findById(id).map(this::toResponse);
    }

    public CustomerResponse createCustomer(CustomerCreateRequest request) {
        CustomerEntity entity = customerRepository.save(new CustomerEntity(request.name(), request.rut(), request.email()));
        return toResponse(entity);
    }

    public CustomerResponse updateCustomer(Long id, CustomerUpdateRequest request) {
        CustomerEntity entity = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        entity = new CustomerEntity(request.name(), request.rut(), request.email());
        entity.setId(id);
        return toResponse(customerRepository.save(entity));
    }

    private CustomerResponse toResponse(CustomerEntity entity) {
        return new CustomerResponse(entity.getId(), entity.getName(), entity.getRut(), entity.getEmail());
    }
}
