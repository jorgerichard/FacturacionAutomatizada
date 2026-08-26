package com.businessflow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class InventoryItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String sku;
    private Integer stock;
    private Double price;

    public InventoryItemEntity() {
    }

    public InventoryItemEntity(String name, String sku, Integer stock, Double price) {
        this.name = name;
        this.sku = sku;
        this.stock = stock;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSku() {
        return sku;
    }

    public Integer getStock() {
        return stock;
    }

    public Double getPrice() {
        return price;
    }
}
