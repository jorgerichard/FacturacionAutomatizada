package com.businessflow.receipt.integration;

import com.businessflow.receipt.config.RabbitInvoiceConfig;
import com.businessflow.receipt.service.ReceiptService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class InvoiceCreatedListener {

    private static final Logger log = LoggerFactory.getLogger(InvoiceCreatedListener.class);
    private final ReceiptService receiptService;

    public InvoiceCreatedListener(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @RabbitListener(queues = RabbitInvoiceConfig.INVOICE_CREATED_QUEUE)
    public void handleInvoiceCreated(Map<String, Object> event) {
        String invoiceId = String.valueOf(event.get("invoiceId"));
        String invoiceNumber = String.valueOf(event.get("invoiceNumber"));
        String customerName = String.valueOf(event.get("customerName"));
        String currency = String.valueOf(event.getOrDefault("currency", "CLP"));
        double total = toDouble(event.get("total"));

        receiptService.createFromInvoiceEvent(
                invoiceId,
                invoiceNumber,
                customerName,
                total,
                currency
        );

        log.info("[RabbitMQ] invoice.created consumed -> {}", invoiceNumber);
    }

    private double toDouble(Object value) {
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        return Double.parseDouble(String.valueOf(value));
    }
}
