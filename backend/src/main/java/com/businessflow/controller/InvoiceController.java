package com.businessflow.controller;

import com.businessflow.dto.InvoiceCreateRequest;
import com.businessflow.dto.InvoiceResponse;
import com.businessflow.dto.InvoiceStatusUpdateRequest;
import com.businessflow.dto.PaymentStatusUpdateRequest;
import com.businessflow.service.InvoiceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public List<InvoiceResponse> listInvoices() {
        return invoiceService.listInvoices();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceResponse createInvoice(@RequestBody InvoiceCreateRequest request) {
        return invoiceService.createInvoice(request);
    }

    @PutMapping("/{id}/status")
    public InvoiceResponse updateInvoiceStatus(@PathVariable Long id, @RequestBody InvoiceStatusUpdateRequest request) {
        return invoiceService.updateInvoiceStatus(id, request);
    }

    @PutMapping("/{id}/payment-status")
    public InvoiceResponse updatePaymentStatus(@PathVariable Long id, @RequestBody PaymentStatusUpdateRequest request) {
        return invoiceService.updatePaymentStatus(id, request);
    }

    @PutMapping("/{id}")
    public InvoiceResponse updateInvoiceDetails(@PathVariable Long id, @RequestBody InvoiceCreateRequest request) {
        return invoiceService.updateInvoiceDetails(id, request.customerName(), request.total(), LocalDate.now().plusDays(15).format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
    }
}
