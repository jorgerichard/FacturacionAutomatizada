package com.businessflow.receipt.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitInvoiceConfig {

    public static final String BILLING_EXCHANGE = "billing-events";
    public static final String RECEIPT_EXCHANGE = "receipt-events";
    public static final String INVOICE_CREATED_QUEUE = "receipt.invoice.created.queue";
    public static final String INVOICE_CREATED_ROUTING_KEY = "invoice.created";

    @Bean
    public TopicExchange billingExchange() {
        return new TopicExchange(BILLING_EXCHANGE, true, false);
    }

    @Bean
    public TopicExchange receiptEventsExchange() {
        return new TopicExchange(RECEIPT_EXCHANGE, true, false);
    }

    @Bean
    public Queue invoiceCreatedQueue() {
        return new Queue(INVOICE_CREATED_QUEUE, true);
    }

    @Bean
    public Binding invoiceCreatedBinding(Queue invoiceCreatedQueue, TopicExchange billingExchange) {
        return BindingBuilder.bind(invoiceCreatedQueue)
                .to(billingExchange)
                .with(INVOICE_CREATED_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter rabbitMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
