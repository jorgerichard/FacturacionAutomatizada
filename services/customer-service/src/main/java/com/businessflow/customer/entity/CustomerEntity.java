package com.businessflow.customer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "customers")
public class CustomerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String rut;

    @Column(nullable = false)
    private String email;

    public CustomerEntity() {}

    public CustomerEntity(String name, String rut, String email) {
        this.name = name;
        this.rut = rut;
        this.email = email;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getRut() { return rut; }
    public String getEmail() { return email; }
    public void setName(String name) { this.name = name; }
    public void setRut(String rut) { this.rut = rut; }
    public void setEmail(String email) { this.email = email; }
}
