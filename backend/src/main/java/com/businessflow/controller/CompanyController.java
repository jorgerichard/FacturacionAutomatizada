package com.businessflow.controller;

import com.businessflow.dto.CompanyCreateRequest;
import com.businessflow.dto.CompanyResponse;
import com.businessflow.service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(@RequestBody CompanyCreateRequest request) {
        CompanyResponse created = companyService.createCompany(request);
        return ResponseEntity.created(URI.create("/api/companies/" + created.id())).body(created);
    }

    @GetMapping
    public List<CompanyResponse> listCompanies() {
        return companyService.listCompanies();
    }
}
