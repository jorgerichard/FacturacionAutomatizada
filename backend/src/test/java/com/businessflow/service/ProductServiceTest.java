package com.businessflow.service;

import com.businessflow.dto.ProductResponse;
import com.businessflow.dto.ProductUpdateRequest;
import com.businessflow.entity.ProductEntity;
import com.businessflow.repository.ProductRepository;
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
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void updateProductPersistsChanges() {
        ProductEntity entity = new ProductEntity("Viejo", "SKU-01", 100.0);
        when(productRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(productRepository.save(any(ProductEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductResponse response = productService.updateProduct(1L, new ProductUpdateRequest("Nuevo", "SKU-02", 200.0));

        assertEquals("Nuevo", response.name());
        assertEquals("SKU-02", response.sku());
        assertEquals(200.0, response.price());
        verify(productRepository).save(any(ProductEntity.class));
    }
}
