package com.businessflow.billing.controller;

import com.businessflow.billing.dto.InvoiceCreateRequest;
import com.businessflow.billing.dto.InvoiceResponse;
import com.businessflow.billing.dto.InvoiceStatusUpdateRequest;
import com.businessflow.billing.dto.PaymentStatusUpdateRequest;
import com.businessflow.billing.service.InvoiceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/{id}")
    public InvoiceResponse getInvoice(@PathVariable Long id) {
        return invoiceService.getInvoice(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceResponse createInvoice(@RequestBody InvoiceCreateRequest request) {
        return invoiceService.createInvoice(request);
    }

    @PutMapping("/{id}")
    public InvoiceResponse updateInvoice(@PathVariable Long id, @RequestBody InvoiceCreateRequest request) {
        return invoiceService.updateInvoice(id, request);
    }

    @PutMapping("/{id}/status")
    public InvoiceResponse updateInvoiceStatus(@PathVariable Long id, @RequestBody InvoiceStatusUpdateRequest request) {
        return invoiceService.updateInvoiceStatus(id, request);
    }

    @PutMapping("/{id}/payment-status")
    public InvoiceResponse updatePaymentStatus(@PathVariable Long id, @RequestBody PaymentStatusUpdateRequest request) {
        return invoiceService.updatePaymentStatus(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
    }
}
