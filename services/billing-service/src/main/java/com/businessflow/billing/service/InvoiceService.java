package com.businessflow.billing.service;

import com.businessflow.billing.dto.InvoiceCreateRequest;
import com.businessflow.billing.dto.InvoiceResponse;
import com.businessflow.billing.dto.InvoiceStatusUpdateRequest;
import com.businessflow.billing.dto.PaymentStatusUpdateRequest;
import com.businessflow.billing.entity.InvoiceEntity;
import com.businessflow.billing.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InvoiceService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<InvoiceResponse> listInvoices() {
        return invoiceRepository.findAll().stream().map(this::toResponse).toList();
    }

    public InvoiceResponse getInvoice(Long id) {
        return toResponse(findById(id));
    }

    public InvoiceResponse createInvoice(InvoiceCreateRequest request) {
        validateInvoice(request);
        String number = String.format("FAC-%05d", invoiceRepository.count() + 1);
        InvoiceEntity entity = new InvoiceEntity(
                request.customerName().trim(),
                number,
                "Pendiente",
                request.total(),
                "Pendiente",
                LocalDate.now().plusDays(15).format(DATE_FORMAT)
        );
        return toResponse(invoiceRepository.save(entity));
    }

    public InvoiceResponse updateInvoice(Long id, InvoiceCreateRequest request) {
        validateInvoice(request);
        InvoiceEntity entity = findById(id);
        entity.setCustomerName(request.customerName().trim());
        entity.setTotal(request.total());
        entity.setDueDate(LocalDate.now().plusDays(15).format(DATE_FORMAT));
        return toResponse(invoiceRepository.save(entity));
    }

    public InvoiceResponse updateInvoiceStatus(Long id, InvoiceStatusUpdateRequest request) {
        if (request == null || request.status() == null || request.status().isBlank()) {
            throw new IllegalArgumentException("El estado de la factura es obligatorio");
        }
        InvoiceEntity entity = findById(id);
        entity.setStatus(request.status().trim());
        return toResponse(invoiceRepository.save(entity));
    }

    public InvoiceResponse updatePaymentStatus(Long id, PaymentStatusUpdateRequest request) {
        if (request == null || request.paymentStatus() == null || request.paymentStatus().isBlank()) {
            throw new IllegalArgumentException("El estado de pago es obligatorio");
        }
        InvoiceEntity entity = findById(id);
        entity.setPaymentStatus(request.paymentStatus().trim());
        return toResponse(invoiceRepository.save(entity));
    }

    public void deleteInvoice(Long id) {
        InvoiceEntity entity = findById(id);
        invoiceRepository.delete(entity);
    }

    private InvoiceEntity findById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Factura no encontrada: " + id));
    }

    private void validateInvoice(InvoiceCreateRequest request) {
        if (request == null || request.customerName() == null || request.customerName().isBlank()) {
            throw new IllegalArgumentException("El nombre del cliente es obligatorio");
        }
        if (request.total() == null || request.total() <= 0) {
            throw new IllegalArgumentException("El total debe ser mayor que cero");
        }
    }

    private InvoiceResponse toResponse(InvoiceEntity entity) {
        return new InvoiceResponse(
                entity.getId(),
                entity.getCustomerName(),
                entity.getNumber(),
                entity.getStatus(),
                entity.getTotal(),
                entity.getPaymentStatus(),
                entity.getDueDate()
        );
    }
}
