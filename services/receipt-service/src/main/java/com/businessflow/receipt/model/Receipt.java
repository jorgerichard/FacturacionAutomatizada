package com.businessflow.receipt.model;

import java.time.Instant;
import java.util.UUID;

public class Receipt {
    private String id;
    private String invoiceId;
    private String customerId;
    private double amount;
    private String currency;
    private String status;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public Receipt() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
        this.status = "PENDING";
    }

    public Receipt(String invoiceId, String customerId, double amount, String currency, String notes) {
        this();
        this.invoiceId = invoiceId;
        this.customerId = customerId;
        this.amount = amount;
        this.currency = currency;
        this.notes = notes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
