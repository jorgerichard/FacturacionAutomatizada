package com.businessflow.billing.dto;

public record InvoiceResponse(
        Long id,
        Long customerId,
        String customerName,
        String number,
        String status,
        Double total,
        String paymentStatus,
        String dueDate
) {
}
