package com.businessflow.service;

import com.businessflow.dto.ProductResponse;
import com.businessflow.dto.ProductUpdateRequest;
import com.businessflow.entity.ProductEntity;
import com.businessflow.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> listProducts() {
        return productRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        entity = new ProductEntity(request.name(), request.sku(), request.price());
        entity.setId(id);
        return toResponse(productRepository.save(entity));
    }

    private ProductResponse toResponse(ProductEntity entity) {
        return new ProductResponse(entity.getId(), entity.getName(), entity.getSku(), entity.getPrice());
    }
}
