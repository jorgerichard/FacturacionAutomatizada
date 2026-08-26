package com.businessflow.bff.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class BffController {

    private final WebClient webClient = WebClient.builder().build();

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("service", "bff-service", "status", "UP");
    }

    @PostMapping("/auth/login")
    public Mono<ResponseEntity<Object>> login(@RequestBody Map<String, Object> body) {
        return webClient.post()
                .uri("http://auth-service:8081/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @GetMapping("/auth/me")
    public Mono<ResponseEntity<Object>> me(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.get()
                .uri("http://auth-service:8081/api/auth/me")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @GetMapping("/customers")
    public Mono<ResponseEntity<Object>> customers(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.get()
                .uri("http://backend:8085/api/customers")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()))
                .onErrorResume(WebClientResponseException.class, ex -> Mono.just(ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", ex.getResponseBodyAsString()))));
    }

    @PostMapping("/customers")
    public Mono<ResponseEntity<Object>> createCustomer(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                                       @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.post()
                .uri("http://backend:8085/api/customers")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @PutMapping("/customers/{id}")
    public Mono<ResponseEntity<Object>> updateCustomer(@PathVariable Long id,
                                                       @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                                       @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.put()
                .uri("http://backend:8085/api/customers/" + id)
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @GetMapping("/products")
    public Mono<ResponseEntity<Object>> products(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.get()
                .uri("http://backend:8085/api/products")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @PutMapping("/products/{id}")
    public Mono<ResponseEntity<Object>> updateProduct(@PathVariable Long id,
                                                      @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                                      @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.put()
                .uri("http://backend:8085/api/products/" + id)
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @GetMapping("/dashboard")
    public Mono<ResponseEntity<Object>> dashboard(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.get()
                .uri("http://backend:8085/api/dashboard")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @GetMapping("/inventory")
    public Mono<ResponseEntity<Object>> inventory(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.get()
                .uri("http://backend:8085/api/inventory")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @GetMapping("/quotations")
    public Mono<ResponseEntity<Object>> quotations(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.get()
                .uri("http://backend:8085/api/quotations")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @PostMapping("/quotations")
    public Mono<ResponseEntity<Object>> createQuotation(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                                        @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.post()
                .uri("http://backend:8085/api/quotations")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @GetMapping("/invoices")
    public Mono<ResponseEntity<Object>> invoices(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.get()
                .uri("http://backend:8085/api/invoices")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @PostMapping("/invoices")
    public Mono<ResponseEntity<Object>> createInvoice(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                                      @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.post()
                .uri("http://backend:8085/api/invoices")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @PutMapping("/invoices/{id}")
    public Mono<ResponseEntity<Object>> updateInvoice(@PathVariable Long id,
                                                      @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                                      @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.put()
                .uri("http://backend:8085/api/invoices/" + id)
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }

    @PutMapping("/invoices/{id}/payment-status")
    public Mono<ResponseEntity<Object>> updatePaymentStatus(@PathVariable Long id,
                                                            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                                            @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        if (authorization != null && !authorization.isBlank()) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return webClient.put()
                .uri("http://backend:8085/api/invoices/" + id + "/payment-status")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .toEntity(Object.class)
                .map(entity -> ResponseEntity.status(entity.getStatusCode()).body(entity.getBody()));
    }
}
