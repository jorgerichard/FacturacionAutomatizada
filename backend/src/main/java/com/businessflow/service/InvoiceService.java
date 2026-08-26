package com.businessflow.service;

import com.businessflow.dto.InvoiceCreateRequest;
import com.businessflow.dto.InvoiceResponse;
import com.businessflow.dto.InvoiceStatusUpdateRequest;
import com.businessflow.dto.PaymentStatusUpdateRequest;
import com.businessflow.entity.InvoiceEntity;
import com.businessflow.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<InvoiceResponse> listInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public InvoiceResponse createInvoice(InvoiceCreateRequest request) {
        InvoiceEntity entity = invoiceRepository.save(new InvoiceEntity(
                request.customerName(),
                "FAC-00" + (invoiceRepository.count() + 1),
                "Pendiente",
                request.total(),
                "Pendiente",
                LocalDate.now().plusDays(15).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        ));
        return toResponse(entity);
    }

    public InvoiceResponse updateInvoiceStatus(Long id, InvoiceStatusUpdateRequest request) {
        InvoiceEntity entity = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        entity.setStatus(request.status());
        return toResponse(invoiceRepository.save(entity));
    }

    public InvoiceResponse updateInvoiceDetails(Long id, String customerName, Double total, String dueDate) {
        InvoiceEntity entity = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        entity.setCustomerName(customerName);
        entity.setTotal(total);
        entity.setDueDate(dueDate);
        return toResponse(invoiceRepository.save(entity));
    }

    public InvoiceResponse updatePaymentStatus(Long id, PaymentStatusUpdateRequest request) {
        InvoiceEntity entity = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        entity.setPaymentStatus(request.paymentStatus());
        return toResponse(invoiceRepository.save(entity));
    }

    private InvoiceResponse toResponse(InvoiceEntity entity) {
        return new InvoiceResponse(entity.getId(), entity.getCustomerName(), entity.getNumber(), entity.getStatus(), entity.getTotal(), entity.getPaymentStatus(), entity.getDueDate());
    }
}
