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
- [ClientBearerInterceptorOptions](interfaces/ClientBearerInterceptorOptions.md)
- [ClientGatewayInterceptorOptions](interfaces/ClientGatewayInterceptorOptions.md)
- [GatewayAuthInterceptorOptions](interfaces/GatewayAuthInterceptorOptions.md)
- [GatewayHeaderMapping](interfaces/GatewayHeaderMapping.md)
- [InternalAuthInterceptorOptions](interfaces/InternalAuthInterceptorOptions.md)
- [JwtAuthInterceptorOptions](interfaces/JwtAuthInterceptorOptions.md)
- [MeshIdentityEntry](interfaces/MeshIdentityEntry.md)
- [MeshIdentityTrustOptions](interfaces/MeshIdentityTrustOptions.md)
- [ProtoAuthzInterceptorOptions](interfaces/ProtoAuthzInterceptorOptions.md)
- [ResolvedMethodAuth](interfaces/ResolvedMethodAuth.md)
- [SessionAuthInterceptorOptions](interfaces/SessionAuthInterceptorOptions.md)
- [SharedSecretTrustOptions](interfaces/SharedSecretTrustOptions.md)
- [SignedTokenIssuer](interfaces/SignedTokenIssuer.md)
- [SignedTokenTrustOptions](interfaces/SignedTokenTrustOptions.md)

## Type Aliases

- [AuthzEffect](type-aliases/AuthzEffect.md)
- [InterceptorFactory](type-aliases/InterceptorFactory.md)
- [InternalTrustSource](type-aliases/InternalTrustSource.md)

## Variables

- [AUTH\_HEADERS](variables/AUTH_HEADERS.md)
- [authContextStorage](variables/authContextStorage.md)
- [AuthzEffect](variables/AuthzEffect.md)

## Functions

- [createAuthInterceptor](functions/createAuthInterceptor.md)
- [createAuthzInterceptor](functions/createAuthzInterceptor.md)
- [createClientBearerInterceptor](functions/createClientBearerInterceptor.md)
- [createClientGatewayInterceptor](functions/createClientGatewayInterceptor.md)
- [createGatewayAuthInterceptor](functions/createGatewayAuthInterceptor.md)
- [createInternalAuthInterceptor](functions/createInternalAuthInterceptor.md)
- [createJwtAuthInterceptor](functions/createJwtAuthInterceptor.md)
- [createProtoAuthzInterceptor](functions/createProtoAuthzInterceptor.md)
- [createSessionAuthInterceptor](functions/createSessionAuthInterceptor.md)
- [getAuthContext](functions/getAuthContext.md)
- [getInternalMethods](functions/getInternalMethods.md)
- [getPublicMethods](functions/getPublicMethods.md)
- [matchesMethodPattern](functions/matchesMethodPattern.md)
- [meshIdentityTrust](functions/meshIdentityTrust.md)
- [parseAuthHeaders](functions/parseAuthHeaders.md)
- [requireAuthContext](functions/requireAuthContext.md)
- [resolveMethodAuth](functions/resolveMethodAuth.md)
- [setAuthHeaders](functions/setAuthHeaders.md)
- [sharedSecretTrust](functions/sharedSecretTrust.md)
- [signedTokenTrust](functions/signedTokenTrust.md)
