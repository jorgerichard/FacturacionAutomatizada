package com.businessflow.service;

import com.businessflow.dto.InventoryItemCreateRequest;
import com.businessflow.dto.InventoryItemResponse;
import com.businessflow.entity.InventoryItemEntity;
import com.businessflow.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<InventoryItemResponse> listInventory() {
        return inventoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public InventoryItemResponse createInventoryItem(InventoryItemCreateRequest request) {
        InventoryItemEntity entity = inventoryRepository.save(new InventoryItemEntity(request.name(), request.sku(), request.stock(), request.price()));
        return toResponse(entity);
    }

    private InventoryItemResponse toResponse(InventoryItemEntity entity) {
        return new InventoryItemResponse(entity.getId(), entity.getName(), entity.getSku(), entity.getStock(), entity.getPrice());
    }
}
