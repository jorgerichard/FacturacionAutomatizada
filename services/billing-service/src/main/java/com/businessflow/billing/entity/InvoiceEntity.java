package com.businessflow.billing.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "billing_invoices")
public class InvoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String number;
    private String status;
    private Double total;
    private String paymentStatus;
    private String dueDate;

    public InvoiceEntity() {
    }

    public InvoiceEntity(String customerName, String number, String status, Double total, String paymentStatus, String dueDate) {
        this.customerName = customerName;
        this.number = number;
        this.status = status;
        this.total = total;
        this.paymentStatus = paymentStatus;
        this.dueDate = dueDate;
    }

    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getNumber() { return number; }
    public String getStatus() { return status; }
    public Double getTotal() { return total; }
    public String getPaymentStatus() { return paymentStatus; }
    public String getDueDate() { return dueDate; }

    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public void setTotal(Double total) { this.total = total; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public void setStatus(String status) { this.status = status; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
