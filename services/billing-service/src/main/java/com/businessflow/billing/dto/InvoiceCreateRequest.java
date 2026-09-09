package com.businessflow.billing.dto;

public record InvoiceCreateRequest(Long customerId, Double total) {
}
