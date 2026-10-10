[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / parseServiceFromUrl

# Function: parseServiceFromUrl()

> **parseServiceFromUrl**(`url`, `host`): `string` \| `undefined`

Defined in: [httpHandler.ts:116](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/httpHandler.ts#L116)

Read the optional `service` query parameter from a request URL.

Returns `undefined` when the URL is absent, malformed, or has no `service`
parameter. The host is used only to resolve relative URLs.

## Parameters

### url

`string` \| `undefined`

### host

`string` \| `undefined`

## Returns

`string` \| `undefined`

## Example

```typescript
parseServiceFromUrl('/healthz?service=my.service.v1.MyService', req.headers.host)
// returns 'my.service.v1.MyService'
```
