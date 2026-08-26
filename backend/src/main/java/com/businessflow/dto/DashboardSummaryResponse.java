package com.businessflow.dto;

public record DashboardSummaryResponse(
        Long customersCount,
        Long productsCount,
        Long pendingInvoicesCount,
        Double monthlySales
) {
}
