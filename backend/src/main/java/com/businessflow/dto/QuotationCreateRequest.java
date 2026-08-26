package com.businessflow.dto;

public record QuotationCreateRequest(String customerName, String productName, Integer quantity) {
}
