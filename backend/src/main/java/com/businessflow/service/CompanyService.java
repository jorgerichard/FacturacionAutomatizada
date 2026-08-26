
package com.businessflow.service;

import com.businessflow.dto.CompanyCreateRequest;
import com.businessflow.dto.CompanyResponse;
import com.businessflow.entity.CompanyEntity;
import com.businessflow.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<CompanyResponse> listCompanies() {
        return companyRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CompanyResponse createCompany(CompanyCreateRequest request) {
        CompanyEntity entity = companyRepository.save(new CompanyEntity(request.name(), request.rut(), request.address()));
        return toResponse(entity);
    }

    private CompanyResponse toResponse(CompanyEntity entity) {
        return new CompanyResponse(entity.getId(), entity.getName(), entity.getRut(), entity.getAddress());
    }
}
