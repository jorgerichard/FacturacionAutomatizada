package com.businessflow.service;

import com.businessflow.dto.QuotationCreateRequest;
import com.businessflow.dto.QuotationResponse;
import com.businessflow.entity.QuotationEntity;
import com.businessflow.repository.QuotationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuotationService {

    private final QuotationRepository quotationRepository;

    public QuotationService(QuotationRepository quotationRepository) {
        this.quotationRepository = quotationRepository;
    }

    public List<QuotationResponse> listQuotations() {
        return quotationRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public QuotationResponse createQuotation(QuotationCreateRequest request) {
        QuotationEntity entity = quotationRepository.save(new QuotationEntity(
                request.customerName(),
                request.productName(),
                request.quantity(),
                request.quantity() * 100000.0
        ));
        return toResponse(entity);
    }

    private QuotationResponse toResponse(QuotationEntity entity) {
        return new QuotationResponse(entity.getId(), entity.getCustomerName(), entity.getProductName(), entity.getQuantity(), entity.getTotal());
    }
}
