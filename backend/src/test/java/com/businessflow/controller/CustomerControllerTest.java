package com.businessflow.controller;

import com.businessflow.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CustomerController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
@Import(CustomerService.class)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomerService customerService;

    @Test
    void shouldReturnCustomers() throws Exception {
        given(customerService.listCustomers()).willReturn(List.of(new com.businessflow.dto.CustomerResponse(1L, "Acme SpA", "76.123.456-7", "contacto@acme.cl")));

        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Acme SpA"));
    }

    @Test
    void shouldCreateCustomer() throws Exception {
        given(customerService.createCustomer(org.mockito.ArgumentMatchers.any())).willReturn(new com.businessflow.dto.CustomerResponse(2L, "Gamma SA", "78.111.222-3", "hola@gamma.cl"));

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Gamma SA\",\"rut\":\"78.111.222-3\",\"email\":\"hola@gamma.cl\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Gamma SA"));
    }
}
