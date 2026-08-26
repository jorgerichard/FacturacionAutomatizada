package com.businessflow.dto;

public record InventoryItemCreateRequest(String name, String sku, Integer stock, Double price) {
}
