package com.businessflow.controller;

import com.businessflow.dto.QuotationCreateRequest;
import com.businessflow.dto.QuotationResponse;
import com.businessflow.service.QuotationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @GetMapping
    public List<QuotationResponse> listQuotations() {
        return quotationService.listQuotations();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuotationResponse createQuotation(@RequestBody QuotationCreateRequest request) {
        return quotationService.createQuotation(request);
    }
}
