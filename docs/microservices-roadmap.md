# Roadmap inicial de microservicios

## Objetivo

Separar los módulos de negocio en servicios pequeños y desplegables, manteniendo el frontend actual como punto de entrada mientras los servicios evolucionan de forma independiente.

## Estado actual del proyecto

Se ha avanzado en la base de infraestructura y en la preparación del ecosistema de microservicios:

- Se levantan servicios Spring Boot independientes para autenticación, clientes, catálogo, facturación y gateway.
- Ya existe una base de infraestructura con MySQL, Redis y RabbitMQ en Docker.
- Se incorporó observabilidad con Prometheus, Grafana, Node Exporter, cAdvisor y exporters de Redis y RabbitMQ.
- Se definieron patrones de resiliencia para integraciones tributarias y publicación de eventos.

## Servicios iniciales

1. Auth Service
   - Autenticación y perfiles de usuario.
   - Puerto: 8081

2. Customer Service
   - Gestión de clientes y cuentas comerciales.
   - Puerto: 8082

3. Catalog Service
   - Gestión de productos y catálogo.
   - Puerto: 8083

4. Billing Service
   - Facturas, pagos y estado de cobranza.
   - Puerto: 8084

## Principios de diseño

- Cada servicio tiene su propia base de datos y su propio contrato de API.
- Las comunicaciones síncronas usarán REST, mientras que los eventos de negocio se publican mediante RabbitMQ.
- Redis se utilizará como capa de cache y aceleración para lecturas frecuentes.
- Prometheus y Grafana permitirán monitorear salud, tráfico y recursos del sistema.
- Para integraciones tributarias se aplicarán patrones de resiliencia como circuit breaker, retries y timeouts.
- Para eventos de negocio se trabajará con Outbox Pattern y DLQ para garantizar entrega y trazabilidad.

## Próximos pasos

1. Consolidar los endpoints base de cada servicio con contratos más claros.
2. Implementar el patrón Outbox para publicar eventos desde los servicios de negocio.
3. Integrar Resilience4j en el servicio de Billing para integraciones tributarias.
4. Añadir pruebas de integración y escenarios de fallo para verificar reintentos y circuit breakers.
5. Expandir la observabilidad con dashboards y alertas para errores y latencia.

## Progreso incorporado

- Se agregó un nuevo microservicio de boletas con CRUD, validación básica contra facturación y publicación de eventos a RabbitMQ.
- Se integró la vista de boletas en el frontend para crear y listar comprobantes desde la interfaz.
- El servicio de boletas queda expuesto en el gateway y responde en el puerto 8087.
