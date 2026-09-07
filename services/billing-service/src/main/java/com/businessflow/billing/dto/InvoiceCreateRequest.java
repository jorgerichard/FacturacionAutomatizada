package com.businessflow.billing.dto;

public record InvoiceCreateRequest(String customerName, Double total) {
}
