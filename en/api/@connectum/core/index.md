[Connectum API Reference](../../index.md) / @connectum/core

# @connectum/core

## Modules

- [config](config/index.md)
- [types](types/index.md)

## Classes

- [CatalogConfigError](classes/CatalogConfigError.md)
- [TransportValidationError](classes/TransportValidationError.md)

## Interfaces

- [BidiStreamHandle](interfaces/BidiStreamHandle.md)
- [CatalogClient](interfaces/CatalogClient.md)
- [ClientStreamHandle](interfaces/ClientStreamHandle.md)
- [ConnectumCallMap](interfaces/ConnectumCallMap.md)
- [ConnectumStreamMap](interfaces/ConnectumStreamMap.md)
- [Context](interfaces/Context.md)
- [CreateCatalogClientOptions](interfaces/CreateCatalogClientOptions.md)
- [CreateLocalTransportOptions](interfaces/CreateLocalTransportOptions.md)
- [DnsResolverOptions](interfaces/DnsResolverOptions.md)
- [PerServiceEnvResolverOptions](interfaces/PerServiceEnvResolverOptions.md)
- [ResolverContext](interfaces/ResolverContext.md)
- [SanitizableError](interfaces/SanitizableError.md)
- [ServiceDefinition](interfaces/ServiceDefinition.md)
- [StreamingMethodInfo](interfaces/StreamingMethodInfo.md)

## Type Aliases

- [CallOptions](type-aliases/CallOptions.md)
- [CatalogCall](type-aliases/CatalogCall.md)
- [CatalogStream](type-aliases/CatalogStream.md)
- [ConnectumEnv](type-aliases/ConnectumEnv.md)
- [ConnectumMethodImpl](type-aliases/ConnectumMethodImpl.md)
- [ConnectumServiceImpl](type-aliases/ConnectumServiceImpl.md)
- [EffectiveTransport](type-aliases/EffectiveTransport.md)
- [RemoteResolver](type-aliases/RemoteResolver.md)
- [ServiceCatalog](type-aliases/ServiceCatalog.md)
- [ServiceOptions](type-aliases/ServiceOptions.md)
- [StreamReturn](type-aliases/StreamReturn.md)
- [TransportValidationMode](type-aliases/TransportValidationMode.md)

## Variables

- [BooleanFromStringSchema](variables/BooleanFromStringSchema.md)
- [ConnectumEnvSchema](variables/ConnectumEnvSchema.md)
- [defaultPropagateHeaders](variables/defaultPropagateHeaders.md)
- [EffectiveTransport](variables/EffectiveTransport.md)
- [LogFormatSchema](variables/LogFormatSchema.md)
- [LoggerBackendSchema](variables/LoggerBackendSchema.md)
- [LogLevelSchema](variables/LogLevelSchema.md)
- [NodeEnvSchema](variables/NodeEnvSchema.md)
- [tlsPath](variables/tlsPath.md)
- [TRANSPORT\_VALIDATION\_ERROR\_CODE](variables/TRANSPORT_VALIDATION_ERROR_CODE.md)
- [TransportValidationMode](variables/TransportValidationMode.md)

## Functions

- [collectStreamingMethods](functions/collectStreamingMethods.md)
- [createCatalogClient](functions/createCatalogClient.md)
- [createLocalTransport](functions/createLocalTransport.md)
- [createServer](functions/createServer.md)
- [defineCatalog](functions/defineCatalog.md)
- [defineLazyService](functions/defineLazyService.md)
- [defineService](functions/defineService.md)
- [dnsResolver](functions/dnsResolver.md)
- [getTLSPath](functions/getTLSPath.md)
- [isSanitizableError](functions/isSanitizableError.md)
- [mapResolver](functions/mapResolver.md)
- [matchServicesPattern](functions/matchServicesPattern.md)
- [mergeCatalogs](functions/mergeCatalogs.md)
- [mergeEnabledServices](functions/mergeEnabledServices.md)
- [parseEnvConfig](functions/parseEnvConfig.md)
- [parseServicesEnv](functions/parseServicesEnv.md)
- [perServiceEnvResolver](functions/perServiceEnvResolver.md)
- [readTLSCertificates](functions/readTLSCertificates.md)
- [resolveEffectiveTransport](functions/resolveEffectiveTransport.md)
- [safeParseEnvConfig](functions/safeParseEnvConfig.md)
- [singleTransportResolver](functions/singleTransportResolver.md)

## References

### CreateServerOptions

Re-exports [CreateServerOptions](types/interfaces/CreateServerOptions.md)

***

### EventBusLike

Re-exports [EventBusLike](types/interfaces/EventBusLike.md)

***

### HttpHandler

Re-exports [HttpHandler](types/type-aliases/HttpHandler.md)

***

### LifecycleEvent

Re-exports [LifecycleEvent](types/variables/LifecycleEvent.md)

***

### NodeRequest

Re-exports [NodeRequest](types/type-aliases/NodeRequest.md)

***

### NodeResponse

Re-exports [NodeResponse](types/type-aliases/NodeResponse.md)

***

### ProtocolContext

Re-exports [ProtocolContext](types/interfaces/ProtocolContext.md)

***

### ProtocolRegistration

Re-exports [ProtocolRegistration](types/interfaces/ProtocolRegistration.md)

***

### Server

Re-exports [Server](types/interfaces/Server.md)

***

### ServerClientOptions

Re-exports [ServerClientOptions](types/interfaces/ServerClientOptions.md)

***

### ServerState

Re-exports [ServerState](types/variables/ServerState.md)

***

### ShutdownHook

Re-exports [ShutdownHook](types/type-aliases/ShutdownHook.md)

***

### ShutdownOptions

Re-exports [ShutdownOptions](types/interfaces/ShutdownOptions.md)

***

### TLSOptions

Re-exports [TLSOptions](types/interfaces/TLSOptions.md)

***

### TransportServer

Re-exports [TransportServer](types/type-aliases/TransportServer.md)
