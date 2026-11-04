[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / NodeResponse

# Type Alias: NodeResponse

> **NodeResponse** = `ServerResponse` \| `Http2ServerResponse`

Defined in: [packages/core/src/types.ts:40](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L40)

Server response — HTTP/1.1 or HTTP/2.

Only the members both classes declare identically can be called on the union:
`statusCode`, `setHeader()` and `end()`. `writeHead()` and `write()` are declared with
incompatible overload sets on `ServerResponse` and `Http2ServerResponse`, so
`res.writeHead(200, headers)` and `res.write(chunk)` do not compile (TS2349). Set the
status and headers first, then end the response with the whole body:

## Example

```ts
res.statusCode = 200;
res.setHeader("content-type", "application/json");
res.end(JSON.stringify({ status: "ok" }));
```
