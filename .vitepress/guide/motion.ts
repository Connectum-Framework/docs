type GuideBeat = { message: string; token: string };

// these are narrated illustrations, never substitutes for an RPC, generator or deployment.
export const guideBeats = {
    about: [
        { message: 'The contract names the RPC and its messages.', token: 'InventoryService/CheckStock' },
        { message: 'A typed handler implements that contract.', token: 'defineService(InventoryService, handlers)' },
        { message: 'The implementation is registered on one server.', token: 'createServer({ services: [inventory] })' },
    ],
    quickstart: [
        { message: 'Describe the greeting request and response.', token: 'GreeterService/SayHello' },
        { message: 'Generate the types and implement the handler.', token: 'sayHello({ name: "Alice" })' },
        { message: 'The example returns its greeting to the caller.', token: '{ message: "Hello, Alice!" }' },
    ],
    scaffolding: [
        { message: 'Choose the project runtime and capabilities.', token: 'Node.js + pnpm' },
        { message: 'Inspect the starting contract, handler and tests.', token: 'proto/ · src/ · tests/' },
        { message: 'Edit your own files and regenerate after contract changes.', token: 'change proto → regenerate → implement' },
    ],
    server: [
        { message: 'Register the services and explicit capabilities.', token: 'services: [orders, inventory]' },
        { message: 'Start the configured network listener.', token: 'await server.start()' },
        { message: 'Stop the listener and run configured shutdown hooks.', token: 'await server.stop()' },
    ],
    interceptors: [
        { message: 'An outer interceptor receives the request first.', token: 'next(request)' },
        { message: 'The inner chain reaches the business handler.', token: 'handler(request, context)' },
        { message: 'The response or error unwinds through the outer layers.', token: 'handler → inner interceptor → outer interceptor' },
    ],
    validation: [
        { message: 'A request carries a non-empty SKU.', token: '{ sku: "A-1" }' },
        { message: 'The configured interceptor checks the proto constraint.', token: 'string.min_len = 1' },
        { message: 'This valid request can reach the stock handler.', token: 'handler receives { sku: "A-1" }' },
    ],
    openapi: [
        { message: 'The contract supplies methods and auth annotations.', token: 'InventoryService/CheckStock' },
        { message: 'The base generator and authz overlay build the artifact.', token: 'base spec + resolveMethodAuth(method)' },
        { message: 'HTTP tooling reads the generated API document.', token: 'OpenAPI 3.1 · schemas + security metadata' },
    ],
    testing: [
        { message: 'Check the handler decision with a focused test.', token: 'expected stock.units === 7' },
        { message: 'Exercise the router and configured middleware locally.', token: 'createLocalClient(server, InventoryService)' },
        { message: 'Check the live protocol and deployment boundary too.', token: 'real connection · auth · probes · TLS' },
    ],
    'service-communication/choosing-a-mechanism': [
        { message: 'Orders waits for a stock answer from Inventory.', token: 'CheckStock({ sku: "A-1" })' },
        { message: 'Orders uses the answer to make its business decision.', token: '{ units: 7 }' },
        { message: 'An accepted order can be announced to later subscribers.', token: 'OrderCreated' },
    ],
    'service-communication': [
        { message: 'Orders asks Inventory about one SKU.', token: 'shop.v1.InventoryService/CheckStock' },
        { message: 'Inventory returns the stock count for that SKU.', token: '{ units: 7 }' },
        { message: 'Orders uses the count in its availability response.', token: '{ sku: "A-1", available: true }' },
    ],
    events: [
        { message: 'Orders publishes a typed event about an accepted order.', token: 'OrderCreated { orderId: "order-42" }' },
        { message: 'The adapter handles delivery through its broker or memory.', token: 'adapter.publish(topic, payload)' },
        { message: 'A matching subscriber processes the delivered event.', token: 'onOrderCreated(message, context)' },
    ],
    auth: [
        { message: 'Authentication verifies the supplied credential.', token: 'credential → AuthContext' },
        { message: 'Authorization checks access to this RPC method.', token: 'identity + method policy' },
        { message: 'Only an admitted call reaches protected business logic.', token: 'authorized request → handler' },
    ],
    security: [
        { message: 'The client verifies the destination certificate.', token: 'trusted server certificate' },
        { message: 'TLS protects the connection; mTLS also verifies a client.', token: 'encrypted connection' },
        { message: 'The application still applies its request access policy.', token: 'authentication + authorization' },
    ],
    observability: [
        { message: 'Configured instrumentation observes the RPC work.', token: 'InventoryService/CheckStock' },
        { message: 'Instrumentation creates the selected telemetry signals.', token: 'traces · metrics · logs' },
        { message: 'A configured provider and exporter send those signals.', token: 'exporter → telemetry destination' },
    ],
    'health-checks': [
        { message: 'The application decides that it can accept useful work.', token: 'application readiness decision' },
        { message: 'The manager reports the application state to probes.', token: 'ServingStatus.SERVING' },
        { message: 'The platform can route traffic to a ready destination.', token: 'readiness probe → traffic routing' },
    ],
    'protocols/reflection': [
        { message: 'A tool connects to an address it already knows.', token: 'grpcurl -plaintext localhost:5000 list' },
        { message: 'Reflection returns the mounted service descriptors.', token: 'shop.v1.InventoryService' },
        { message: 'The tool can describe the method and construct a call.', token: 'CheckStockRequest · CheckStockResponse' },
    ],
    'production/docker': [
        { message: 'Install locked dependencies and generate contract code.', token: 'lockfile + generated descriptors' },
        { message: 'Package the application and production runtime files.', token: 'image: orders-service' },
        { message: 'Supply deployment configuration when the image runs.', token: 'runtime configuration + mounted secrets' },
    ],
    'production/kubernetes': [
        { message: 'A caller uses the configured stable Service address.', token: 'inventory:5000' },
        { message: 'Readiness selects eligible pod endpoints.', token: 'Service → ready pod endpoint' },
        { message: 'The selected process runs its normal RPC handler.', token: 'InventoryService/CheckStock' },
    ],
    'production/envoy-gateway': [
        { message: 'An HTTP client sends a request to an annotated path.', token: 'HTTP + JSON' },
        { message: 'Configured routing and descriptors translate the call.', token: 'gateway route + protobuf descriptor set' },
        { message: 'The gRPC handler applies its usual application policy.', token: 'gRPC → service handler' },
    ],
    'production/service-mesh': [
        { message: 'Orders makes its ordinary application call.', token: 'Orders → Inventory' },
        { message: 'The configured mesh applies connection and traffic policy.', token: 'workload identity + mTLS' },
        { message: 'Inventory still enforces its application access policy.', token: 'request authorization → handler' },
    ],
    'production/architecture': [
        { message: 'A network or local RPC reaches the registered router.', token: 'registered service + method' },
        { message: 'Configured admission and interceptors apply to the RPC.', token: 'request admission → server interceptors' },
        { message: 'The matched typed handler executes business logic.', token: 'handler(request, context)' },
    ],
    'runtime-compatibility': [
        { message: 'Start with the published package engine requirement.', token: 'Node.js ≥22.13.0' },
        { message: 'Choose how the application executes TypeScript.', token: 'native Node.js ≥25.2.0 · tsx · Bun' },
        { message: 'Check the actual transport and optional integrations.', token: 'tested boundary ≠ universal runtime support' },
    ],
    typescript: [
        { message: 'Write source compatible with the chosen execution model.', token: 'src/index.ts' },
        { message: 'The selected runtime executes the application source.', token: 'Node.js type stripping · tsx · Bun' },
        { message: 'Framework imports load compiled ESM with declarations.', token: '@connectum packages: .js + .d.ts' },
    ],
    'production/in-process-transport': [
        { message: 'Orders calls the contract of a locally mounted service.', token: 'server.client(InventoryService)' },
        { message: 'The in-memory boundary encodes and decodes protobuf.', token: 'protobuf bytes · no socket' },
        { message: 'Configured admission and middleware guard the handler.', token: 'Inventory handler receives its own message' },
    ],
    'production/transport-matrix': [
        { message: 'Identify the protocol and RPC kind the client needs.', token: 'native gRPC requires HTTP/2' },
        { message: 'Check the upstream connection through any intermediary.', token: 'client → proxy → upstream protocol' },
        { message: 'Choose a compatible listener mode on the server.', token: 'HTTP/1.1 · h2c · TLS + ALPN' },
    ],
    'protocols/custom': [
        { message: 'Prepare per-server state from the mounted-service snapshot.', token: 'setup(context)' },
        { message: 'Add routes whenever the server materializes a router.', token: 'register(router)' },
        { message: 'Handle a registered RPC or an explicit HTTP fallback.', token: 'RPC handler or httpHandler' },
    ],
    'service-communication/service-catalog': [
        { message: 'The proto defines Inventory and its stock RPC.', token: 'CheckStockRequest → CheckStockResponse' },
        { message: 'Buf runs the configured message and catalog plugins.', token: 'protoc-gen-es + protoc-gen-connectum-catalog' },
        { message: 'Generated descriptors and call-map types become available.', token: 'catalog.gen.ts · serviceCatalog' },
        { message: 'Orders can make a type-checked call to the known contract.', token: 'shop.v1.InventoryService/CheckStock' },
    ],
} satisfies Record<string, readonly [GuideBeat, GuideBeat, ...GuideBeat[]]>;

export type GuideScene = keyof typeof guideBeats;
export const GUIDE_STEP_MS = 3000;
export const GUIDE_PAUSE_KEY = 'connectum-guide-animation-paused';

export function guideFrame(options: { scene: GuideScene; elapsedMs: number }) {
    if (!Number.isFinite(options.elapsedMs) || options.elapsedMs < 0) throw new RangeError('Animation time must be finite and non-negative.');
    const beats = guideBeats[options.scene];
    const time = options.elapsedMs % (beats.length * GUIDE_STEP_MS);
    const index = Math.floor(time / GUIDE_STEP_MS);
    return { index, progress: time / (beats.length * GUIDE_STEP_MS), beat: beats[index] };
}
