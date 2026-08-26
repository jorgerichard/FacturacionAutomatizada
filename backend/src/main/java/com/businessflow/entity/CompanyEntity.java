package com.businessflow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CompanyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String rut;
    private String address;

    public CompanyEntity() {
    }

    public CompanyEntity(String name, String rut, String address) {
        this.name = name;
        this.rut = rut;
        this.address = address;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRut() {
        return rut;
    }

    public String getAddress() {
        return address;
    }
}
