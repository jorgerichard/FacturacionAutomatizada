package com.businessflow.controller;

import com.businessflow.dto.QuotationCreateRequest;
import com.businessflow.dto.QuotationResponse;
import com.businessflow.service.QuotationService;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuotationController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
class QuotationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuotationService quotationService;

    @Test
    void shouldReturnQuotations() throws Exception {
        given(quotationService.listQuotations()).willReturn(List.of(new QuotationResponse(1L, "Acme SpA", "Monitor 24", 2, 379980.0)));

        mockMvc.perform(get("/api/quotations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerName").value("Acme SpA"));
    }

    @Test
    void shouldCreateQuotation() throws Exception {
        given(quotationService.createQuotation(any(QuotationCreateRequest.class))).willReturn(new QuotationResponse(2L, "Acme SpA", "Notebook", 3, 300000.0));

        mockMvc.perform(post("/api/quotations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customerName\":\"Acme SpA\",\"productName\":\"Notebook\",\"quantity\":3}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customerName").value("Acme SpA"));
    }
}
