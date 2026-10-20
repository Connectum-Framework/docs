[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / parseServiceFromUrl

# Function: parseServiceFromUrl()

> **parseServiceFromUrl**(`url`, `_host?`): `string` \| `undefined`

Defined in: [httpHandler.ts:135](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/httpHandler.ts#L135)

Read the optional `service` query parameter from a request URL.

Returns `undefined` when the URL is absent, malformed, or has no `service`
parameter. An empty value (`?service=`) is returned as the empty string.
The result depends on the URL alone: the `Host` header never changes it.

## Parameters

### url

`string` \| `undefined`

Request target, usually `req.url`

### \_host?

`string`

Accepted for backward compatibility only; it has no effect
  on the result and is removed in the next major version

## Returns

`string` \| `undefined`

## Example

```typescript
parseServiceFromUrl('/healthz?service=my.service.v1.MyService')
// returns 'my.service.v1.MyService'
```
