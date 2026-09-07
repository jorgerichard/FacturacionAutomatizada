# BusinessFlow

BusinessFlow es una propuesta de plataforma SaaS para gestionar operaciones comerciales y financieras de PYMEs desde un único entorno, con enfoque en facturación electrónica, ventas, inventario, cobranzas, reportes e inteligencia artificial.

## Visión

Convertir la operación diaria de una empresa en un flujo conectado, desde el cliente hasta la cobranza, pasando por cotizaciones, ventas, facturación, inventario y análisis.

## Objetivo del MVP

- Registro de empresas y usuarios
- Gestión de clientes
- Catálogo de productos
- Cotizaciones y ventas
- Facturación electrónica
- Dashboard básico
- Reportes simples

## Arquitectura propuesta

- Frontend: React
- API Gateway
- Servicios: Auth, Company, Customer, Catalog, Inventory, Sales, Billing, Tax, Collection, Notification
- Persistencia: MySQL
- Cache: Redis
- Mensajería: RabbitMQ
- Almacenamiento de documentos: S3-compatible
- Observabilidad: Prometheus + Grafana + Spring Boot Admin

## Estructura inicial del repositorio

```text
businessflow/
├── landing/                  # Landing page comercial
├── docs/                     # Documentación de arquitectura y roadmap
├── infrastructure/           # Docker Compose y base de infraestructura
└── README.md
```

## Cómo empezar

1. Abre la landing page en el navegador.
2. Revisa la arquitectura y el roadmap.
3. Usa la infraestructura base como punto de partida para el desarrollo.
4. Para arrancar la app completa en local, ejecuta cualquiera de estas opciones:
   ```powershell
   npm run dev
   ```
   o bien:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
   ```
   Esto levanta:
   - Backend en http://localhost:8080
   - Frontend en http://localhost:3000
   - Health check en http://localhost:8080/api/health

## Próximos pasos

- Implementar el frontend React
- Definir contratos de API con OpenAPI
- Crear el servicio de autenticación
- Desarrollar el módulo de clientes y productos
- Conectar la facturación electrónica al motor tributario

## Ejecutar con MySQL

1. Levantar la base de datos local:
   ```bash
   docker compose up -d
   ```
   La base de datos MySQL estará disponible en `localhost:3311`.
2. Ejecutar la API con el perfil MySQL:
   ```bash
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```

La app seguirá usando H2 por defecto si no se especifica el perfil `mysql`.

## Enviar boletas por correo

Al crear una boleta, `receipt-service` consulta el email del cliente y envía un comprobante HTML por SMTP. Para activarlo, define estas variables antes de levantar Docker Compose:

```powershell
$env:SMTP_HOST = "smtp.gmail.com"
$env:SMTP_PORT = "587"
$env:SMTP_USERNAME = "tu-cuenta@gmail.com"
$env:SMTP_PASSWORD = "tu-clave-de-aplicacion"
$env:SMTP_FROM = "tu-cuenta@gmail.com"
docker compose up -d --build receipt-service
```

`SMTP_PASSWORD` debe ser una clave de aplicación del proveedor, no la contraseña personal. Si `SMTP_HOST` queda vacío, la boleta se crea normalmente pero no se intenta enviar correo.
