package com.businessflow.receipt.service;

import com.businessflow.receipt.model.Receipt;
import com.businessflow.receipt.integration.BillingIntegrationClient;
import com.businessflow.receipt.integration.CustomerIntegrationClient;
import com.businessflow.receipt.integration.RabbitEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ReceiptService {
    private final Map<String, Receipt> storage = new ConcurrentHashMap<>();
    private final BillingIntegrationClient billingIntegrationClient;
    private final CustomerIntegrationClient customerIntegrationClient;
    private final RabbitEventPublisher rabbitEventPublisher;
    private final ReceiptEmailService receiptEmailService;

    public ReceiptService(BillingIntegrationClient billingIntegrationClient,
                          CustomerIntegrationClient customerIntegrationClient,
                          RabbitEventPublisher rabbitEventPublisher,
                          ReceiptEmailService receiptEmailService) {
        this.billingIntegrationClient = billingIntegrationClient;
        this.customerIntegrationClient = customerIntegrationClient;
        this.rabbitEventPublisher = rabbitEventPublisher;
        this.receiptEmailService = receiptEmailService;
    }

    public Receipt create(Receipt receipt) {
        receipt.setStatus("CREATED");
        storage.put(receipt.getId(), receipt);

        boolean invoiceExists = billingIntegrationClient.validateInvoice(receipt.getInvoiceId());
        if (invoiceExists) {
            receipt.setStatus("VALIDATED");
            storage.put(receipt.getId(), receipt);
        }

        rabbitEventPublisher.publishReceiptCreated(receipt);
        receiptEmailService.send(receipt, customerIntegrationClient.findById(receipt.getCustomerId()));
        return receipt;
    }

    public List<Receipt> listAll() {
        return storage.values().stream().collect(Collectors.toList());
    }

    public Receipt getById(String id) {
        return storage.get(id);
    }

    public Receipt update(String id, Receipt updated) {
        Receipt existing = storage.get(id);
        if (existing == null) {
            return null;
        }
        updated.setId(id);
        updated.setCreatedAt(existing.getCreatedAt());
        updated.setUpdatedAt(java.time.Instant.now());
        storage.put(id, updated);
        rabbitEventPublisher.publishReceiptUpdated(updated);
        return updated;
    }

    public boolean delete(String id) {
        Receipt removed = storage.remove(id);
        if (removed != null) {
            rabbitEventPublisher.publishReceiptDeleted(id);
            return true;
        }
        return false;
    }
}
