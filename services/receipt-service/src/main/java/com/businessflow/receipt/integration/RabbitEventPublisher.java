package com.businessflow.receipt.integration;

import com.businessflow.receipt.model.Receipt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class RabbitEventPublisher {
    private static final Logger log = LoggerFactory.getLogger(RabbitEventPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public RabbitEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishReceiptCreated(Receipt receipt) {
        publish("receipt.created", receipt.getId(), buildPayload("created", receipt));
    }

    public void publishReceiptUpdated(Receipt receipt) {
        publish("receipt.updated", receipt.getId(), buildPayload("updated", receipt));
    }

    public void publishReceiptDeleted(String receiptId) {
        publish("receipt.deleted", receiptId, Map.of("receiptId", receiptId));
    }

    private void publish(String routingKey, String receiptId, Map<String, Object> payload) {
        try {
            rabbitTemplate.convertAndSend("receipt-events", routingKey, payload);
            log.info("[RabbitMQ] {} -> {}", routingKey, receiptId);
        } catch (Exception ex) {
            log.warn("[RabbitMQ] unable to publish {} for {}: {}", routingKey, receiptId, ex.getMessage());
        }
    }

    private Map<String, Object> buildPayload(String action, Receipt receipt) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("action", action);
        payload.put("receiptId", receipt.getId());
        payload.put("invoiceId", receipt.getInvoiceId());
        payload.put("customerId", receipt.getCustomerId());
        payload.put("amount", receipt.getAmount());
        payload.put("currency", receipt.getCurrency());
        payload.put("status", receipt.getStatus());
        return payload;
    }
}
