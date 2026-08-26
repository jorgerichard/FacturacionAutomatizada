package com.businessflow.service;

import com.businessflow.dto.CustomerResponse;
import com.businessflow.dto.CustomerUpdateRequest;
import com.businessflow.entity.CustomerEntity;
import com.businessflow.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    @Test
    void updateCustomerPersistsChanges() {
        CustomerEntity entity = new CustomerEntity("Antiguo", "11111111-1", "viejo@test.com");
        when(customerRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(customerRepository.save(any(CustomerEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CustomerResponse response = customerService.updateCustomer(1L, new CustomerUpdateRequest("Nuevo", "22222222-2", "nuevo@test.com"));

        assertEquals("Nuevo", response.name());
        assertEquals("22222222-2", response.rut());
        assertEquals("nuevo@test.com", response.email());
        verify(customerRepository).save(any(CustomerEntity.class));
    }
}
