[Connectum API Reference](../../../index.md) / [@connectum/healthcheck](../index.md) / parseServiceFromUrl

# Function: parseServiceFromUrl()

> **parseServiceFromUrl**(`url`, `host`): `string` \| `undefined`

Defined in: [httpHandler.ts:110](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/healthcheck/src/httpHandler.ts#L110)

Parse service name from URL query string

## Parameters

### url

`string` | `undefined`

### host

`string` | `undefined`

## Returns

`string` \| `undefined`

## Example

```typescript
parseServiceFromUrl('/healthz?service=my.service.v1.MyService', req.headers.host)
// returns 'my.service.v1.MyService'
```
