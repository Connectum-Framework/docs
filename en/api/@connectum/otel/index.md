[Connectum API Reference](../../index.md) / @connectum/otel

# @connectum/otel

## Modules

- [attributes](attributes/index.md)
- [client-interceptor](client-interceptor/index.md)
- [interceptor](interceptor/index.md)
- [logger](logger/index.md)
- [meter](meter/index.md)
- [metrics](metrics/index.md)
- [provider](provider/index.md)
- [shared](shared/index.md)
- [traceAll](traceAll/index.md)
- [traced](traced/index.md)
- [tracer](tracer/index.md)

## Interfaces

- [BatchSpanProcessorOptions](interfaces/BatchSpanProcessorOptions.md)
- [CollectorOptions](interfaces/CollectorOptions.md)
- [Meter](interfaces/Meter.md)
- [OtelBaseOptions](interfaces/OtelBaseOptions.md)
- [OtelClientInterceptorOptions](interfaces/OtelClientInterceptorOptions.md)
- [OtelInterceptorOptions](interfaces/OtelInterceptorOptions.md)
- [OTLPSettings](interfaces/OTLPSettings.md)
- [TraceAllOptions](interfaces/TraceAllOptions.md)
- [TracedOptions](interfaces/TracedOptions.md)
- [Tracer](interfaces/Tracer.md)

## Type Aliases

- [ArgsFilter](type-aliases/ArgsFilter.md)
- [ExporterType](type-aliases/ExporterType.md)
- [MethodArgsFilter](type-aliases/MethodArgsFilter.md)
- [OtelAttributeFilter](type-aliases/OtelAttributeFilter.md)
- [OtelFilter](type-aliases/OtelFilter.md)

## Variables

- [ExporterType](variables/ExporterType.md)

## Functions

- [getBatchSpanProcessorOptions](functions/getBatchSpanProcessorOptions.md)
- [getCollectorOptions](functions/getCollectorOptions.md)
- [getOTLPSettings](functions/getOTLPSettings.md)
- [getServiceMetadata](functions/getServiceMetadata.md)

## References

### ATTR\_ERROR\_TYPE

Re-exports [ATTR_ERROR_TYPE](attributes/variables/ATTR_ERROR_TYPE.md)

***

### ATTR\_NETWORK\_PEER\_ADDRESS

Re-exports [ATTR_NETWORK_PEER_ADDRESS](attributes/variables/ATTR_NETWORK_PEER_ADDRESS.md)

***

### ATTR\_NETWORK\_PEER\_PORT

Re-exports [ATTR_NETWORK_PEER_PORT](attributes/variables/ATTR_NETWORK_PEER_PORT.md)

***

### ATTR\_NETWORK\_PROTOCOL\_NAME

Re-exports [ATTR_NETWORK_PROTOCOL_NAME](attributes/variables/ATTR_NETWORK_PROTOCOL_NAME.md)

***

### ATTR\_NETWORK\_TRANSPORT

Re-exports [ATTR_NETWORK_TRANSPORT](attributes/variables/ATTR_NETWORK_TRANSPORT.md)

***

### ATTR\_RPC\_CONNECT\_RPC\_STATUS\_CODE

Re-exports [ATTR_RPC_CONNECT_RPC_STATUS_CODE](attributes/variables/ATTR_RPC_CONNECT_RPC_STATUS_CODE.md)

***

### ATTR\_RPC\_METHOD

Re-exports [ATTR_RPC_METHOD](attributes/variables/ATTR_RPC_METHOD.md)

***

### ATTR\_RPC\_SERVICE

Re-exports [ATTR_RPC_SERVICE](attributes/variables/ATTR_RPC_SERVICE.md)

***

### ATTR\_RPC\_SYSTEM

Re-exports [ATTR_RPC_SYSTEM](attributes/variables/ATTR_RPC_SYSTEM.md)

***

### ATTR\_SERVER\_ADDRESS

Re-exports [ATTR_SERVER_ADDRESS](attributes/variables/ATTR_SERVER_ADDRESS.md)

***

### ATTR\_SERVER\_PORT

Re-exports [ATTR_SERVER_PORT](attributes/variables/ATTR_SERVER_PORT.md)

***

### buildErrorAttributes

Re-exports [buildErrorAttributes](shared/functions/buildErrorAttributes.md)

***

### ConnectErrorCode

Re-exports [ConnectErrorCode](attributes/variables/ConnectErrorCode.md)

***

### ConnectErrorCodeName

Re-exports [ConnectErrorCodeName](attributes/variables/ConnectErrorCodeName.md)

***

### createOtelClientInterceptor

Re-exports [createOtelClientInterceptor](client-interceptor/functions/createOtelClientInterceptor.md)

***

### createOtelInterceptor

Re-exports [createOtelInterceptor](interceptor/functions/createOtelInterceptor.md)

***

### createRpcClientMetrics

Re-exports [createRpcClientMetrics](metrics/functions/createRpcClientMetrics.md)

***

### createRpcServerMetrics

Re-exports [createRpcServerMetrics](metrics/functions/createRpcServerMetrics.md)

***

### estimateMessageSize

Re-exports [estimateMessageSize](shared/functions/estimateMessageSize.md)

***

### getLogger

Re-exports [getLogger](logger/functions/getLogger.md)

***

### getMeter

Re-exports [getMeter](meter/functions/getMeter.md)

***

### getProvider

Re-exports [getProvider](provider/functions/getProvider.md)

***

### getTracer

Re-exports [getTracer](tracer/functions/getTracer.md)

***

### initProvider

Re-exports [initProvider](provider/functions/initProvider.md)

***

### Logger

Re-exports [Logger](logger/interfaces/Logger.md)

***

### LoggerOptions

Re-exports [LoggerOptions](logger/interfaces/LoggerOptions.md)

***

### ProviderOptions

Re-exports [ProviderOptions](provider/interfaces/ProviderOptions.md)

***

### RPC\_SYSTEM\_CONNECT\_RPC

Re-exports [RPC_SYSTEM_CONNECT_RPC](attributes/variables/RPC_SYSTEM_CONNECT_RPC.md)

***

### RpcClientMetrics

Re-exports [RpcClientMetrics](metrics/interfaces/RpcClientMetrics.md)

***

### RpcServerMetrics

Re-exports [RpcServerMetrics](metrics/interfaces/RpcServerMetrics.md)

***

### shutdownProvider

Re-exports [shutdownProvider](provider/functions/shutdownProvider.md)

***

### traceAll

Re-exports [traceAll](traceAll/functions/traceAll.md)

***

### traced

Re-exports [traced](traced/functions/traced.md)
