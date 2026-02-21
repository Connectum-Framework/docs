---
outline: deep
---

# Logging

Structured logging with OpenTelemetry integration through the `@connectum/otel` package.

## Using getLogger()

`getLogger()` provides structured logging with automatic trace correlation:

```typescript
import { getLogger } from '@connectum/otel';

const logger = getLogger('OrderService');

// Console-like convenience methods
logger.info('Order created', { orderId: '123', userId: 'user-456' });
logger.warn('Low stock', { sku: 'ABC', remaining: 2 });
logger.error('Payment failed', { error: 'timeout', orderId: '123' });
logger.debug('Processing step', { step: 3, total: 5 });
```

## Default Attributes

Add attributes that appear in every log entry:

```typescript
const logger = getLogger('PaymentService', {
  defaultAttributes: {
    'service.layer': 'domain',
    env: 'production',
  },
});

logger.info('Charge created');
// Attributes: { "logger.name": "PaymentService", "service.layer": "domain", env: "production" }
```

## Raw OpenTelemetry LogRecord

For advanced use cases, emit raw OTel log records:

```typescript
import { SeverityNumber } from '@opentelemetry/api-logs';

logger.emit({
  severityNumber: SeverityNumber.INFO,
  severityText: 'INFO',
  body: 'Custom log record',
  attributes: { custom: true },
  timestamp: Date.now(),
});
```

::: info Trace Correlation
When an active span exists, the OpenTelemetry SDK automatically includes `trace_id` and `span_id` in log records. No manual correlation needed.
:::

## Related

- [Observability Overview](/en/guide/observability) -- back to overview
- [Tracing](/en/guide/observability/tracing) -- distributed tracing setup
- [Backends & Configuration](/en/guide/observability/backends) -- configure log exporters
- [@connectum/otel](/en/packages/otel) -- Package Guide
- [@connectum/otel API](/en/api/@connectum/otel/) -- Full API Reference
