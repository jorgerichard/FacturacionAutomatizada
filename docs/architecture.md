# Arquitectura de BusinessFlow

## Principios

- Diseño orientado al negocio y al recorrido completo de la venta.
- Arquitectura modular para crecer sin reescribir el sistema.
- Separación clara entre dominio, aplicación e infraestructura.
- Preparación para multitenancy y soporte internacional.

## Componentes principales

### Frontend

- Landing page y panel de gestión
- React + TypeScript
- Integración con API Gateway

### API Gateway

- Punto único de entrada
- Autenticación y autorización
- Enrutamiento y control de tráfico

### Microservicios iniciales

- Auth Service
- Company Service
- Customer Service
- Catalog Service
- Inventory Service
- Sales Service
- Billing Service
- Tax Service
- Collection Service
- Notification Service

### Infraestructura transversal

- Config Server
- Discovery Server
- Admin Server
- RabbitMQ
- Redis
- MySQL
- S3-compatible storage
- Prometheus + Grafana

## Modelo de comunicación

- REST para operaciones síncronas
- Mensajería asíncrona con RabbitMQ para eventos de negocio
- Circuit breaker y retries para integraciones tributarias
- Outbox pattern para garantizar entrega de eventos

## Patrones de resiliencia y delivery

- Para las integraciones tributarias, se utilizará Resilience4j con Circuit Breaker, Retry, Timeout y Bulkhead para evitar cascadas de fallos cuando los proveedores respondan lento o caigan.
- Los reintentos deberán aplicarse con backoff exponencial y política de idempotencia para no duplicar envíos.
- En los servicios que publican eventos de negocio, se implementará el Outbox Pattern: cada cambio de negocio se registra en una tabla de outbox dentro de la misma transacción de negocio y un proceso de relay lo publica a RabbitMQ.
- Los mensajes fallidos se canalizarán a Dead Letter Queue (DLQ) y se registrarán métricas y alertas para seguimiento operacional.
- La arquitectura priorizará respuestas seguras para el usuario: si una integración tributaria falla, el sistema registrará el estado como pendiente o reintento programado en vez de perder la operación.

## Infraestructura y observabilidad incorporada

- MySQL como base de datos principal para los servicios que requieren persistencia transaccional.
- Redis como capa de cache para lecturas frecuentes y optimización de rendimiento.
- RabbitMQ como broker de eventos para integraciones asíncronas.
- Prometheus, Grafana, Node Exporter, cAdvisor, Redis Exporter y RabbitMQ Exporter para monitoreo y observabilidad operativa.
- Spring Boot Admin como panel de administración del estado de los servicios.

## Modelo de datos

Cada servicio es dueño de su base de datos. El diseño evita consultas transversales entre servicios y promueve contratos por API o eventos.

## Roadmap de implementación

1. Validación de negocio y MVP
2. Autenticación y empresas
3. Clientes, productos y ventas
4. Facturación y tax engine
5. Inventario y cobranza
6. IA y marketplace
