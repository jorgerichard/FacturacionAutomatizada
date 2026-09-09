package com.businessflow.customer.repository;

import com.businessflow.customer.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<CustomerEntity, Long> {
    boolean existsByRut(String rut);
}
