package com.businessflow.dto;

public record InventoryItemResponse(Long id, String name, String sku, Integer stock, Double price) {
}
