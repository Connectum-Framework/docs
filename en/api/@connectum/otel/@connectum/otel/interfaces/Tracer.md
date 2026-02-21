[Connectum API Reference](../../../../../index.md) / [@connectum/otel](../../../index.md) / [@connectum/otel](../index.md) / Tracer

# Interface: Tracer

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/trace/tracer.d.ts:7

Tracer provides an interface for creating [Span](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html)s.

## Methods

### startActiveSpan()

#### Call Signature

> **startActiveSpan**\<`F`\>(`name`, `fn`): `ReturnType`\<`F`\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/trace/tracer.d.ts:67

Starts a new [Span](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html) and calls the given function passing it the
created span as first argument.
Additionally the new span gets set in context and this context is activated
for the duration of the function call.

##### Type Parameters

###### F

`F` *extends* (`span`) => `unknown`

##### Parameters

###### name

`string`

The name of the span

###### fn

`F`

function called in the context of the span and receives the newly created span as an argument

##### Returns

`ReturnType`\<`F`\>

return value of fn

##### Examples

```ts
const something = tracer.startActiveSpan('op', span => {
      try {
        do some work
        span.setStatus({code: SpanStatusCode.OK});
        return something;
      } catch (err) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        });
        throw err;
      } finally {
        span.end();
      }
    });
```

```ts
const span = tracer.startActiveSpan('op', span => {
      try {
        do some work
        return span;
      } catch (err) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        });
        throw err;
      }
    });
    do some more work
    span.end();
```

#### Call Signature

> **startActiveSpan**\<`F`\>(`name`, `options`, `fn`): `ReturnType`\<`F`\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/trace/tracer.d.ts:68

##### Type Parameters

###### F

`F` *extends* (`span`) => `unknown`

##### Parameters

###### name

`string`

###### options

`SpanOptions`

###### fn

`F`

##### Returns

`ReturnType`\<`F`\>

#### Call Signature

> **startActiveSpan**\<`F`\>(`name`, `options`, `context`, `fn`): `ReturnType`\<`F`\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/trace/tracer.d.ts:69

##### Type Parameters

###### F

`F` *extends* (`span`) => `unknown`

##### Parameters

###### name

`string`

###### options

`SpanOptions`

###### context

`Context`

###### fn

`F`

##### Returns

`ReturnType`\<`F`\>

***

### startSpan()

> **startSpan**(`name`, `options?`, `context?`): [`Span`](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html)

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/trace/tracer.d.ts:22

Starts a new [Span](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html). Start the span without setting it on context.

This method do NOT modify the current Context.

#### Parameters

##### name

`string`

The name of the span

##### options?

`SpanOptions`

SpanOptions used for span creation

##### context?

`Context`

Context to use to extract parent

#### Returns

[`Span`](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html)

Span The newly created span

#### Example

```ts
const span = tracer.startSpan('op');
    span.setAttribute('key', 'value');
    span.end();
```
