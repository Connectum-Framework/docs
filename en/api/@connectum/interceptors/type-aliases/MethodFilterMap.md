[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / MethodFilterMap

# Type Alias: MethodFilterMap

> **MethodFilterMap** = `Record`\<`string`, `Interceptor`[]\>

Defined in: [types.ts:224](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/interceptors/src/types.ts#L224)

Method pattern to interceptors mapping.

Patterns:
- `"*"` -- matches all methods (global)
- `"package.Service/*"` -- matches all methods of a service (service wildcard)
- `"package.Service/Method"` -- matches exact method

Key format uses protobuf fully-qualified service name: `service.typeName + "/" + method.name`

All matching patterns are executed in order: global -> service wildcard -> exact match.
Within each pattern, interceptors execute in array order.

## Example

```typescript
const methods: MethodFilterMap = {
  "*": [logRequest],
  "admin.v1.AdminService/*": [requireAdmin],
  "user.v1.UserService/DeleteUser": [requireAdmin, auditLog],
};
```
