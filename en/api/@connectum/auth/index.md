[Connectum API Reference](../../index.md) / @connectum/auth

# @connectum/auth

## Modules

- [proto](proto/index.md)
- [testing](testing/index.md)

## Classes

- [AuthzDeniedError](classes/AuthzDeniedError.md)
- [LruCache](classes/LruCache.md)

## Interfaces

- [AuthContext](interfaces/AuthContext.md)
- [AuthInterceptorOptions](interfaces/AuthInterceptorOptions.md)
- [AuthzDeniedDetails](interfaces/AuthzDeniedDetails.md)
- [AuthzInterceptorOptions](interfaces/AuthzInterceptorOptions.md)
- [AuthzRule](interfaces/AuthzRule.md)
- [CacheOptions](interfaces/CacheOptions.md)
- [GatewayAuthInterceptorOptions](interfaces/GatewayAuthInterceptorOptions.md)
- [GatewayHeaderMapping](interfaces/GatewayHeaderMapping.md)
- [JwtAuthInterceptorOptions](interfaces/JwtAuthInterceptorOptions.md)
- [ProtoAuthzInterceptorOptions](interfaces/ProtoAuthzInterceptorOptions.md)
- [ResolvedMethodAuth](interfaces/ResolvedMethodAuth.md)
- [SessionAuthInterceptorOptions](interfaces/SessionAuthInterceptorOptions.md)

## Type Aliases

- [AuthzEffect](type-aliases/AuthzEffect.md)
- [InterceptorFactory](type-aliases/InterceptorFactory.md)

## Variables

- [AUTH\_HEADERS](variables/AUTH_HEADERS.md)
- [authContextStorage](variables/authContextStorage.md)
- [AuthzEffect](variables/AuthzEffect.md)

## Functions

- [createAuthInterceptor](functions/createAuthInterceptor.md)
- [createAuthzInterceptor](functions/createAuthzInterceptor.md)
- [createGatewayAuthInterceptor](functions/createGatewayAuthInterceptor.md)
- [createJwtAuthInterceptor](functions/createJwtAuthInterceptor.md)
- [createProtoAuthzInterceptor](functions/createProtoAuthzInterceptor.md)
- [createSessionAuthInterceptor](functions/createSessionAuthInterceptor.md)
- [getAuthContext](functions/getAuthContext.md)
- [getPublicMethods](functions/getPublicMethods.md)
- [matchesMethodPattern](functions/matchesMethodPattern.md)
- [parseAuthHeaders](functions/parseAuthHeaders.md)
- [requireAuthContext](functions/requireAuthContext.md)
- [resolveMethodAuth](functions/resolveMethodAuth.md)
- [setAuthHeaders](functions/setAuthHeaders.md)
