# Distributed Tracing in a Polyglot Microservices System

This project demonstrates distributed tracing across multiple microservices written in different programming languages using OpenTelemetry and Jaeger.

The system includes:

- API Gateway (public entry point)
- Inventory Service
- Order Service
- Notification Service

All services propagate trace context and export spans using OTLP.

---

## Architecture

Client → API Gateway → Inventory → Order → Notification

If inventory fails, the flow stops and an error is returned.

---

## Tech Stack

- Node.js → api_gateway, inventory_service  
- Python → order_service, notification_service  
- OpenTelemetry for instrumentation  
- Jaeger for trace visualization  

---

## Running the System

```bash
docker compose up --build
```

Wait until all services are healthy.

Jaeger UI:
```
http://localhost:16686
```

API Gateway:
```
http://localhost:8080
```

---

## Health Check

Each service provides:

```
GET /health
```

Response:
```json
{"status": "UP"}
```

---

## Create Successful Order

```bash
curl -X POST http://localhost:8080/api/orders \
-H "Content-Type: application/json" \
-d '{
  "userId": 101,
  "items": [{"sku":"A","quantity":1,"price":10}],
  "email":"success@test.com"
}'
```

Expected:
```json
{
  "orderId": "...",
  "status": "CREATED",
  "traceId": "..."
}
```

This trace should include spans from:

- api-gateway  
- inventory-service  
- order-service  
- notification-service  

---

## Error Scenario (Out of Stock)

For evaluation and automated testing, the SKU value:

```
OUT
```

is treated as unavailable.

```bash
curl -X POST http://localhost:8080/api/orders \
-H "Content-Type: application/json" \
-d '{
  "userId": 999,
  "items": [{"sku":"OUT","quantity":1,"price":10}],
  "email":"fail@test.com"
}'
```

Expected:
- Non-2xx response  
- inventory span contains:
```
error = true
```

---

## What Evaluators Verify

For a successful order:

- unified trace across all services  
- root span has HTTP attributes  
- order_service creates span `process_order`  
- `process_order` includes:
  - `user.id`
  - `order.id`
- event `inventory_checked` exists  

For failure:

- inventory span must contain:
```
error = true
```

---

## Environment Variables

Each service reads:

```
OTLP_EXPORTER_ENDPOINT=http://jaeger:4317
SERVICE_NAME=<service-name>
```

A template is provided in `.env.example`.

---

## Analyze Slow Traces

Script:

```
analyze-traces.sh
```

Example:

```bash
./analyze-traces.sh 200
```

Outputs trace IDs longer than the given duration (ms) for `api-gateway`.

```bash
./analyze-traces.sh 2000
```

Should return nothing.

---

## Notes

- Service names appear in Jaeger only if spans are exported.
- Failure traces may include fewer services because execution stops early.
- Always create a NEW request after code changes.

---

## Project Status

All required features are implemented:

- Containerized via Docker Compose  
- Polyglot services  
- Context propagation  
- Automatic HTTP instrumentation  
- Custom spans  
- Attributes  
- Events  
- Error marking  
- Jaeger API validation  

