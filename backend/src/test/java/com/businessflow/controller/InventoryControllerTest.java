package com.businessflow.controller;

import com.businessflow.dto.InventoryItemCreateRequest;
import com.businessflow.dto.InventoryItemResponse;
import com.businessflow.service.InventoryService;
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

@WebMvcTest(InventoryController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InventoryService inventoryService;

    @Test
    void shouldReturnInventory() throws Exception {
        given(inventoryService.listInventory()).willReturn(List.of(new InventoryItemResponse(1L, "Monitor 24", "MON-24", 12, 179990.0)));

        mockMvc.perform(get("/api/inventory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sku").value("MON-24"));
    }

    @Test
    void shouldCreateInventoryItem() throws Exception {
        given(inventoryService.createInventoryItem(any(InventoryItemCreateRequest.class))).willReturn(new InventoryItemResponse(2L, "Teclado", "TEC-01", 8, 59990.0));

        mockMvc.perform(post("/api/inventory")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Teclado\",\"sku\":\"TEC-01\",\"stock\":8,\"price\":59990.0}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Teclado"));
    }
}
