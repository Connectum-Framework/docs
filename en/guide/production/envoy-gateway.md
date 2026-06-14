---
title: Envoy Gateway + OpenAPI
description: gRPC-JSON transcoding with Envoy Gateway, OpenAPI generation from proto files, and Swagger UI for Connectum services.
---

# Envoy Gateway + OpenAPI

::: tip Standalone Envoy Gateway pattern
This guide describes a **standalone Envoy Gateway** for gRPC-JSON transcoding. The Connectum examples repository does not ship a dedicated Envoy Gateway example; the manifests below are illustrative templates you adapt to your cluster. For a service mesh that embeds Envoy as sidecars (mTLS, traffic management), see the [Service Mesh guide](./service-mesh.md) and the [car-sharing/istio](https://github.com/Connectum-Framework/examples/tree/main/car-sharing/istio) example instead.
:::

Connectum services communicate via gRPC, but many external clients (browsers, mobile apps, third-party integrations) need REST/JSON APIs. Envoy Gateway provides **gRPC-JSON transcoding** -- automatically converting REST requests into gRPC calls and vice versa -- without writing any REST handlers.

## Request Flow

```mermaid
graph LR
    subgraph Clients
        WEB["Browser / SPA"]
        MOB["Mobile App"]
        CLI["REST Client<br/>(curl, Postman)"]
    end

    subgraph Gateway["Envoy Gateway"]
        ROUTE["HTTPRoute"]
        TRANSCODE["gRPC-JSON<br/>Transcoder Filter"]
        SWAGGER["Swagger UI<br/>/docs"]
    end

    subgraph Services["Connectum Services"]
        SVC["Order Service<br/>gRPC :5000"]
    end

    WEB -->|"POST /v1/orders<br/>Content-Type: application/json"| ROUTE
    MOB -->|"GET /v1/orders/123"| ROUTE
    CLI -->|"GET /docs"| SWAGGER
    ROUTE --> TRANSCODE
    TRANSCODE -->|"gRPC binary<br/>HTTP/2"| SVC
    SVC -->|"gRPC response"| TRANSCODE
    TRANSCODE -->|"JSON response"| ROUTE
```

## Prerequisites

- Kubernetes cluster with [Envoy Gateway](https://gateway.envoyproxy.io/) installed
- Proto files with `google.api.http` annotations
- `google/api/annotations.proto` and `google/api/http.proto` are available via buf BSR deps

## Step 1: Annotate Proto Files

Add HTTP bindings to your proto service methods using `google.api.http`. Define CRUD operations for `OrderService` with REST path mappings (e.g. `POST /v1/orders`, `GET /v1/orders/{order_id}`) and buf validation rules, attaching a `google.api.http` option to each RPC.

::: tip
The `google/api/http.proto` and `google/api/annotations.proto` files are available through buf BSR deps. Add `buf.build/googleapis/googleapis` to your `buf.yaml` dependencies and import them directly in your proto files without vendoring.
:::

## Step 2: Generate OpenAPI Spec

Generate an OpenAPI v3 specification from your annotated proto files using `protoc-gen-openapiv3`:

### Install

```bash
# Install the protoc plugin
go install github.com/google/gnostic/cmd/protoc-gen-openapi@latest

# Or via buf plugin
# Add to buf.gen.yaml
```

### buf.gen.yaml Configuration

Configure buf to generate both ConnectRPC TypeScript stubs (`protoc-gen-es`) and an OpenAPI v3 spec (`protoc-gen-openapi`) with proto-style naming and string enums — add a `protoc-gen-openapi` plugin entry to your `buf.gen.yaml` alongside the existing `protoc-gen-es` plugin.

### Generate

```bash
# Generate TypeScript stubs + OpenAPI spec
buf generate

# Output: openapi/mycompany/orders/v1/orders.openapi.yaml
```

### Example Generated OpenAPI

```yaml
openapi: 3.0.3
info:
  title: Order Service API
  version: 1.0.0
paths:
  /v1/orders:
    post:
      operationId: OrderService_CreateOrder
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderRequest'
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateOrderResponse'
    get:
      operationId: OrderService_ListOrders
      parameters:
        - name: page_size
          in: query
          schema:
            type: integer
        - name: page_token
          in: query
          schema:
            type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListOrdersResponse'
  /v1/orders/{order_id}:
    get:
      operationId: OrderService_GetOrder
      parameters:
        - name: order_id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
```

## Step 3: Generate Proto Descriptor

Envoy's gRPC-JSON transcoder requires a compiled proto descriptor set:

```bash
buf build -o proto-descriptor.pb

# Or with protoc directly:
protoc \
  --include_imports \
  --include_source_info \
  --descriptor_set_out=proto-descriptor.pb \
  -I proto/ \
  proto/mycompany/orders/v1/orders.proto
```

## Step 4: Kubernetes Gateway API Resources

### GatewayClass and Gateway

Define a GatewayClass and Gateway with three listeners: HTTP on port 80, HTTPS on port 443 (with TLS termination), and a dedicated gRPC listener on port 9090 for native gRPC clients.

### GRPCRoute (Native gRPC Traffic)

Route native gRPC traffic directly to the `OrderService` backend on port 5000 with a `GRPCRoute` matching on the fully qualified gRPC service name.

### HTTPRoute (REST-to-gRPC Transcoding)

Map REST paths (`/v1/orders` prefix) to the gRPC backend for transcoding with an `HTTPRoute`, and route `/docs` to the Swagger UI service. Attach the route to both HTTP and HTTPS listeners.

## Step 5: Envoy Filter for gRPC-JSON Transcoding

If your Envoy Gateway version supports `EnvoyPatchPolicy`, configure the transcoder filter directly. The patch injects the `grpc_json_transcoder` HTTP filter into the listener chain, configuring it with the proto descriptor, target services, and JSON print options (whitespace, primitive fields, proto field names).

Alternatively, store the proto descriptor in a ConfigMap: create a ConfigMap holding the base64-encoded proto descriptor binary and mount it into the Envoy pods.

## Step 6: Swagger UI Deployment

Deploy Swagger UI to serve the generated OpenAPI spec: a ConfigMap for the OpenAPI spec, a Deployment running the official `swaggerapi/swagger-ui` image with the spec mounted at `/specs`, and a ClusterIP Service exposing port 8080.

## Rate Limiting

Add rate limiting at the gateway level to protect your Connectum services. A `BackendTrafficPolicy` can apply local rate limiting (e.g. 100 requests per second) to the REST `HTTPRoute`.

## Load Balancing

Configure request-level (L7) load balancing for gRPC backends. This is essential because gRPC uses persistent HTTP/2 connections. A `BackendTrafficPolicy` can apply RoundRobin load balancing to the REST `HTTPRoute`.

## Full Example: End-to-End Request

### REST Client Sends Request

```bash
# Create an order via REST
curl -X POST https://api.example.com/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust-123",
    "items": [
      {"sku": "ITEM-001", "quantity": 2}
    ]
  }'

# Get an order via REST
curl https://api.example.com/v1/orders/550e8400-e29b-41d4-a716-446655440000
```

### What Happens Under the Hood

1. REST request arrives at Envoy Gateway on port 80/443
2. HTTPRoute matches `/v1/orders` prefix
3. Envoy's `grpc_json_transcoder` filter converts JSON to gRPC binary using the proto descriptor
4. Request is forwarded to `order-service:5000` as a native gRPC call
5. Connectum service processes the gRPC request through its interceptor chain
6. gRPC response is converted back to JSON by the transcoder
7. JSON response is returned to the client

### Native gRPC Client (Unchanged)

```typescript
import { createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { OrderService } from '#gen/mycompany/orders/v1/orders_pb.js';

const transport = createGrpcTransport({
  baseUrl: 'http://api.example.com:9090',
  httpVersion: '2',
});

const client = createClient(OrderService, transport);
const order = await client.getOrder({ orderId: '550e8400-e29b-41d4-a716-446655440000' });
```

## CI/CD: Automate Proto Descriptor Generation

Add proto descriptor generation to your CI pipeline so Envoy always has an up-to-date descriptor:

```yaml
# .github/workflows/proto.yml (excerpt)
- name: Generate proto descriptor
  run: buf build -o proto-descriptor.pb

- name: Update ConfigMap
  run: |
    kubectl create configmap proto-descriptors \
      --from-file=proto-descriptor.pb \
      --namespace=connectum \
      --dry-run=client -o yaml | kubectl apply -f -

- name: Restart Gateway (pick up new descriptor)
  run: kubectl rollout restart deployment envoy-gateway -n connectum
```

::: warning
When you add new services or change HTTP annotations, you must regenerate the proto descriptor and update the Envoy configuration. Automate this in CI to prevent drift between proto definitions and the gateway configuration.
:::

## What's Next

- [Service Mesh with Istio](./service-mesh.md) -- Automatic mTLS and traffic splitting
- [Kubernetes Deployment](./kubernetes.md) -- Core deployment manifests
- [Architecture Patterns](./architecture.md) -- Service communication patterns
