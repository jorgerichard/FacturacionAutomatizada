package com.businessflow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CustomerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String rut;
    private String email;

    public CustomerEntity() {
    }

    public CustomerEntity(String name, String rut, String email) {
        this.name = name;
        this.rut = rut;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public String getRut() {
        return rut;
    }

    public String getEmail() {
        return email;
    }
}
