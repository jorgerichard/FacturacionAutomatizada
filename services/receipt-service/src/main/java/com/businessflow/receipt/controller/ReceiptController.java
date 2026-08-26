package com.businessflow.receipt.controller;

import com.businessflow.receipt.model.Receipt;
import com.businessflow.receipt.service.ReceiptService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {
    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @PostMapping
    public ResponseEntity<Receipt> create(@RequestBody Receipt receipt) {
        return ResponseEntity.status(HttpStatus.CREATED).body(receiptService.create(receipt));
    }

    @GetMapping
    public ResponseEntity<List<Receipt>> list() {
        return ResponseEntity.ok(receiptService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getById(@PathVariable String id) {
        Receipt receipt = receiptService.getById(id);
        return receipt != null ? ResponseEntity.ok(receipt) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receipt> update(@PathVariable String id, @RequestBody Receipt receipt) {
        Receipt updated = receiptService.update(id, receipt);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return receiptService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
