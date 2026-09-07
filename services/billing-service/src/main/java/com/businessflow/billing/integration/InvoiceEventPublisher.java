package com.businessflow.billing.integration;

import com.businessflow.billing.config.RabbitBillingConfig;
import com.businessflow.billing.entity.InvoiceEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class InvoiceEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(InvoiceEventPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public InvoiceEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishInvoiceCreated(InvoiceEntity invoice) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("eventType", "INVOICE_CREATED");
        payload.put("invoiceId", invoice.getId());
        payload.put("invoiceNumber", invoice.getNumber());
        payload.put("customerName", invoice.getCustomerName());
        payload.put("total", invoice.getTotal());
        payload.put("currency", "CLP");
        payload.put("status", invoice.getStatus());
        payload.put("createdAt", Instant.now().toString());

        rabbitTemplate.convertAndSend(
                RabbitBillingConfig.BILLING_EXCHANGE,
                RabbitBillingConfig.INVOICE_CREATED_ROUTING_KEY,
                payload
        );

        log.info("[RabbitMQ] invoice.created -> {}", invoice.getNumber());
    }
}
