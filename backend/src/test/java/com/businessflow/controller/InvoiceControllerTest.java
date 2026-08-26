package com.businessflow.controller;

import com.businessflow.dto.InvoiceCreateRequest;
import com.businessflow.dto.InvoiceResponse;
import com.businessflow.dto.InvoiceStatusUpdateRequest;
import com.businessflow.dto.PaymentStatusUpdateRequest;
import com.businessflow.service.InvoiceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(InvoiceController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
class InvoiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvoiceService invoiceService;

    @Test
    void shouldReturnInvoices() throws Exception {
        given(invoiceService.listInvoices()).willReturn(List.of(new InvoiceResponse(1L, "Acme SpA", "FAC-001", "Emitida", 379980.0, "Pendiente", "01/01/2026")));

        mockMvc.perform(get("/api/invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].number").value("FAC-001"));
    }

    @Test
    void shouldCreateInvoiceFromQuotation() throws Exception {
        given(invoiceService.createInvoice(any(InvoiceCreateRequest.class))).willReturn(new InvoiceResponse(2L, "Acme SpA", "FAC-002", "Pendiente", 379980.0, "Pendiente", "01/01/2026"));

        mockMvc.perform(post("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customerName\":\"Acme SpA\",\"total\":379980.0}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customerName").value("Acme SpA"));
    }

    @Test
    void shouldUpdateInvoiceStatus() throws Exception {
        given(invoiceService.updateInvoiceStatus(any(Long.class), any(InvoiceStatusUpdateRequest.class))).willReturn(new InvoiceResponse(1L, "Acme SpA", "FAC-001", "Emitida", 379980.0, "Pendiente", "01/01/2026"));

        mockMvc.perform(put("/api/invoices/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"Emitida\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Emitida"));
    }

    @Test
    void shouldUpdatePaymentStatus() throws Exception {
        given(invoiceService.updatePaymentStatus(any(Long.class), any(PaymentStatusUpdateRequest.class))).willReturn(new InvoiceResponse(1L, "Acme SpA", "FAC-001", "Emitida", 379980.0, "Pagada", "01/01/2026"));

        mockMvc.perform(put("/api/invoices/1/payment-status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"paymentStatus\":\"Pagada\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentStatus").value("Pagada"));
    }
}
