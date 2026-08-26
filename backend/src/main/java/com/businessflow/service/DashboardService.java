package com.businessflow.service;

import com.businessflow.dto.DashboardSummaryResponse;
import com.businessflow.repository.CustomerRepository;
import com.businessflow.repository.InvoiceRepository;
import com.businessflow.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final InvoiceRepository invoiceRepository;

    public DashboardService(CustomerRepository customerRepository, ProductRepository productRepository, InvoiceRepository invoiceRepository) {
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public DashboardSummaryResponse getSummary() {
        long customersCount = customerRepository.count();
        long productsCount = productRepository.count();
        long pendingInvoicesCount = invoiceRepository.findAll().stream()
                .filter(invoice -> "Pendiente".equals(invoice.getStatus()) || "Pendiente".equals(invoice.getPaymentStatus()))
                .count();
        double monthlySales = invoiceRepository.findAll().stream()
                .mapToDouble(invoice -> invoice.getTotal() != null ? invoice.getTotal() : 0.0)
                .sum();

        return new DashboardSummaryResponse(customersCount, productsCount, pendingInvoicesCount, monthlySales);
    }
}
