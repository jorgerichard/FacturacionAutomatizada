package com.businessflow.customer.service;

import com.businessflow.customer.dto.CustomerRequest;
import com.businessflow.customer.dto.CustomerResponse;
import com.businessflow.customer.entity.CustomerEntity;
import com.businessflow.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<CustomerResponse> list() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public CustomerResponse get(Long id) {
        return toResponse(find(id));
    }

    public CustomerResponse create(CustomerRequest request) {
        validate(request);
        if (repository.existsByRut(request.rut().trim())) {
            throw new IllegalArgumentException("Ya existe un cliente con ese RUT");
        }
        CustomerEntity entity = new CustomerEntity(
                request.name().trim(),
                request.rut().trim(),
                request.email().trim()
        );
        return toResponse(repository.save(entity));
    }

    public CustomerResponse update(Long id, CustomerRequest request) {
        validate(request);
        CustomerEntity entity = find(id);
        entity.setName(request.name().trim());
        entity.setRut(request.rut().trim());
        entity.setEmail(request.email().trim());
        return toResponse(repository.save(entity));
    }

    public void delete(Long id) {
        repository.delete(find(id));
    }

    private CustomerEntity find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado: " + id));
    }

    private void validate(CustomerRequest request) {
        if (request == null || request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("El nombre del cliente es obligatorio");
        }
        if (request.rut() == null || request.rut().isBlank()) {
            throw new IllegalArgumentException("El RUT del cliente es obligatorio");
        }
        if (request.email() == null || request.email().isBlank() || !request.email().contains("@")) {
            throw new IllegalArgumentException("El email del cliente no es valido");
        }
    }

    private CustomerResponse toResponse(CustomerEntity entity) {
        return new CustomerResponse(entity.getId(), entity.getName(), entity.getRut(), entity.getEmail());
    }
}
