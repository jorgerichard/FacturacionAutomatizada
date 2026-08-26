package com.businessflow.dto;

public record QuotationResponse(Long id, String customerName, String productName, Integer quantity, Double total) {
}
