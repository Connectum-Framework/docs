[Connectum API Reference](../../../index.md) / [@connectum/testing](../index.md) / index

# index

@connectum/testing — Testing utilities for the Connectum framework.

Provides a test server utility, in-process transport helpers, OTel
collectors, and a cross-transport parity driver to eliminate boilerplate
in ConnectRPC service tests.

Mock factories, assertion helpers and protobuf descriptor fixtures now
live in `@connectum/test-fixtures`. They are re-exported from this entry
for backwards compatibility — existing imports from `@connectum/testing`
continue to work unchanged.

## Classes

- [InMemoryMetricCollector](classes/InMemoryMetricCollector.md)
- [InMemorySpanCollector](classes/InMemorySpanCollector.md)

## Interfaces

- [CreateMockContextOptions](interfaces/CreateMockContextOptions.md)
- [FakeMethodOptions](interfaces/FakeMethodOptions.md)
- [FakeServiceOptions](interfaces/FakeServiceOptions.md)
- [MockCall](interfaces/MockCall.md)
- [MockDescFieldOptions](interfaces/MockDescFieldOptions.md)
- [MockDescMessageOptions](interfaces/MockDescMessageOptions.md)
- [MockDescMethodOptions](interfaces/MockDescMethodOptions.md)
- [MockFn](interfaces/MockFn.md)
- [MockNextOptions](interfaces/MockNextOptions.md)
- [MockRequestOptions](interfaces/MockRequestOptions.md)
- [MockService](interfaces/MockService.md)
- [MockStreamOptions](interfaces/MockStreamOptions.md)
- [NormalizedMetric](interfaces/NormalizedMetric.md)
- [NormalizedSpan](interfaces/NormalizedSpan.md)

## Variables

- [MOCK\_RESPONSE\_HEADER](variables/MOCK_RESPONSE_HEADER.md)
- [TRANSPORT\_METRIC\_ATTRIBUTE](variables/TRANSPORT_METRIC_ATTRIBUTE.md)
- [TRANSPORT\_SPAN\_ATTRIBUTE](variables/TRANSPORT_SPAN_ATTRIBUTE.md)

## Functions

- [assertConnectError](functions/assertConnectError.md)
- [createFakeMethod](functions/createFakeMethod.md)
- [createFakeService](functions/createFakeService.md)
- [createLocalClient](functions/createLocalClient.md)
- [createMockContext](functions/createMockContext.md)
- [createMockDescField](functions/createMockDescField.md)
- [createMockDescMessage](functions/createMockDescMessage.md)
- [createMockDescMethod](functions/createMockDescMethod.md)
- [createMockFn](functions/createMockFn.md)
- [createMockNext](functions/createMockNext.md)
- [createMockNextError](functions/createMockNextError.md)
- [createMockNextSlow](functions/createMockNextSlow.md)
- [createMockRequest](functions/createMockRequest.md)
- [createMockStream](functions/createMockStream.md)
- [createTestServer](functions/createTestServer.md)
- [mockResolver](functions/mockResolver.md)
- [mockService](functions/mockService.md)
- [withTestServer](functions/withTestServer.md)

## References

### CreateTestServerOptions

Re-exports [CreateTestServerOptions](../types/interfaces/CreateTestServerOptions.md)

***

### TestServer

Re-exports [TestServer](../types/interfaces/TestServer.md)
