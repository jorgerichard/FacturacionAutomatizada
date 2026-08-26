package com.businessflow.service;

import com.businessflow.dto.InvoiceResponse;
import com.businessflow.dto.InvoiceStatusUpdateRequest;
import com.businessflow.dto.PaymentStatusUpdateRequest;
import com.businessflow.entity.InvoiceEntity;
import com.businessflow.repository.InvoiceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    @Test
    void updateInvoiceStatusPersistsChanges() {
        InvoiceEntity entity = new InvoiceEntity("Cliente", "FAC-001", "Pendiente", 100.0, "Pendiente", "10/10/2026");
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(invoiceRepository.save(any(InvoiceEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        InvoiceResponse response = invoiceService.updateInvoiceStatus(1L, new InvoiceStatusUpdateRequest("Emitida"));

        assertEquals("Emitida", response.status());
        verify(invoiceRepository).save(any(InvoiceEntity.class));
    }

    @Test
    void updateInvoicePaymentStatusPersistsChanges() {
        InvoiceEntity entity = new InvoiceEntity("Cliente", "FAC-001", "Pendiente", 100.0, "Pendiente", "10/10/2026");
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(invoiceRepository.save(any(InvoiceEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        InvoiceResponse response = invoiceService.updatePaymentStatus(1L, new PaymentStatusUpdateRequest("Pagada"));

        assertEquals("Pagada", response.paymentStatus());
        verify(invoiceRepository).save(any(InvoiceEntity.class));
    }
}
