import { edge, label, node, zone } from './primitives.mjs';

const calls = '/en/guide/service-communication/';
const events = '/en/guide/events/';
const observe = '/en/guide/observability/';
const health = '/en/guide/health-checks/';

export const diagrams = [
    {
        key: 'service-calls',
        route: '/en/guide/service-communication',
        type: 'architecture',
        width: 688,
        height: 600,
        title: 'Known contracts, selected routes and outgoing policy',
        desc: 'Generated contract knowledge supports catalog calls whose outgoing policy wraps either a local transport or a remote resolver transport across communication patterns and deployment roles.',
        caption:
            'The catalog supplies types and descriptors, without deployment addresses. Outgoing policy wraps each catalog call once, on local and remote routes. Locally mounted targets bypass the remote resolver.',
        body: [
            edge(
                [
                    [296, 76],
                    [336, 76],
                ],
                { from: 'catalog', to: 'caller' },
            ),
            edge(
                [
                    [500, 128],
                    [500, 164],
                    [424, 164],
                    [424, 196],
                ],
                { from: 'caller', to: 'policy' },
            ),
            edge(
                [
                    [192, 236],
                    [216, 236],
                ],
                { from: 'patterns', to: 'policy', dashed: true },
            ),
            edge(
                [
                    [580, 304],
                    [580, 396],
                    [472, 396],
                ],
                { from: 'example', to: 'dispatch', dashed: true },
            ),
            edge(
                [
                    [344, 284],
                    [344, 344],
                ],
                { from: 'policy', to: 'dispatch' },
            ),
            edge(
                [
                    [280, 424],
                    [280, 456],
                    [140, 456],
                    [140, 488],
                ],
                { from: 'dispatch', to: 'local' },
            ),
            edge(
                [
                    [408, 424],
                    [408, 456],
                    [528, 456],
                    [528, 488],
                ],
                { from: 'dispatch', to: 'remote' },
            ),
            node('catalog', 24, 24, 272, 104, 'Generated service catalog', ['Compile-time contract knowledge', 'Runtime descriptors; no endpoints'], {
                shape: 'document',
                topics: [`${calls}service-catalog`, '/en/reference/service-catalog'],
            }),
            node('caller', 336, 24, 328, 104, 'Catalog call', ['ctx.call / ctx.stream', 'Inherit handler deadline and signal']),
            node('patterns', 24, 176, 168, 128, 'Call patterns', ['Chains and fan-out', 'Streams + cancellation', 'Translate partial errors'], { topics: [`${calls}patterns`] }),
            node('policy', 216, 196, 256, 88, 'Outgoing client policy', ['Auth, traces and client-safe retry', 'Once on local + remote routes'], {
                focal: true,
                topics: [`${calls}client-interceptors`],
            }),
            node('example', 496, 176, 168, 128, ['Runnable routing', 'example'], ['Together / split roles', 'No route: Unavailable'], { topics: [`${calls}routing-example`] }),
            node('dispatch', 216, 344, 256, 80, 'Choose a route', ['Mounted local target wins'], { focal: true, topics: [`${calls}resolvers`] }),
            node('local', 24, 488, 232, 88, 'Local transport', ['Dispatches in-process', 'Remote resolver is bypassed']),
            node('remote', 392, 488, 272, 88, 'Remote resolver', ['Map / DNS / env → transport', 'Cache, endpoint hints and mocks'], {
                topics: [`${calls}resolvers`, `${calls}resolver-configuration`],
            }),
        ].join('\n'),
    },
    {
        key: 'mechanisms',
        route: '/en/guide/service-communication/choosing-a-mechanism',
        type: 'architecture',
        width: 688,
        height: 592,
        title: 'Choose the interaction and its recovery owner',
        desc: 'The interaction goal selects a service call, a stream or an event, while workflows needing durable progress use an external Temporal worker with explicit compensations.',
        caption:
            'Calls couple latency and availability; events add delivery and idempotency concerns. Temporal owns durable orchestration outside Connectum. Compensations can fail and do not make service changes atomic.',
        body: [
            zone(24, 400, 640, 168, 'External durable orchestration'),
            edge(
                [
                    [220, 88],
                    [264, 88],
                    [264, 68],
                    [288, 68],
                ],
                { from: 'goal', to: 'call' },
            ),
            edge(
                [
                    [220, 116],
                    [252, 116],
                    [252, 184],
                    [288, 184],
                ],
                { from: 'goal', to: 'stream' },
            ),
            edge(
                [
                    [220, 144],
                    [236, 144],
                    [236, 312],
                    [288, 312],
                ],
                { from: 'goal', to: 'event' },
            ),
            edge(
                [
                    [196, 168],
                    [196, 384],
                    [368, 384],
                    [368, 492],
                    [336, 492],
                ],
                { from: 'goal', to: 'workflow', dashed: true },
            ),
            edge(
                [
                    [336, 520],
                    [408, 520],
                ],
                { from: 'workflow', to: 'compensations', dashed: true },
            ),
            node('goal', 24, 48, 196, 120, 'Interaction goal', ['Reply now, react later,', 'or recover partial progress?'], { focal: true }),
            node('call', 288, 24, 376, 92, 'Service call', ['One reply now · ctx.call', 'Downstream failure affects this request'], { topics: [`${calls}mechanisms`] }),
            node('stream', 288, 140, 376, 92, 'Streaming', ['A sequence of replies · ctx.stream', 'Cancellation and completion are explicit'], { topics: [`${calls}mechanisms`] }),
            node('event', 288, 256, 376, 112, 'Event publication', ['Announce a fact · EventBus', 'Delivery, ordering and idempotency', 'Broker consumers finish independently'], {
                topics: [`${calls}mechanisms`],
            }),
            node('workflow', 48, 444, 288, 100, 'Temporal workflow', ['External service + dedicated worker', 'Durable steps and retry policy', 'HRIS / car-sharing examples'], {
                focal: true,
                topics: [`${calls}mechanisms`],
            }),
            node('compensations', 408, 444, 232, 100, 'Compensations', ['Unwind registered steps', 'Each can fail; not atomic'], { topics: [`${calls}mechanisms`] }),
        ].join('\n'),
    },
    {
        key: 'events',
        route: '/en/guide/events',
        type: 'architecture',
        width: 688,
        height: 576,
        title: 'Publish, consume, recover and drain events',
        desc: 'A typed publication resolves its topic and passes through the chosen adapter to matching consuming middleware and a handler, with dead letters, AMQP recovery and shutdown relay as separate reliability concerns.',
        caption:
            'Publishing skips consuming middleware. Local retries re-enter the handler; exhausted failures can produce a DLQ copy, whose publication can also fail. Shutdown relay uses in-flight ctx.publish before the handler returns. Recovery and relay details marked Since 1.3.0 require that release.',
        body: [
            edge(
                [
                    [196, 68],
                    [240, 68],
                ],
                { from: 'publisher', to: 'topic' },
            ),
            edge(
                [
                    [448, 88],
                    [484, 88],
                ],
                { from: 'topic', to: 'adapter' },
            ),
            edge(
                [
                    [568, 152],
                    [568, 224],
                ],
                { from: 'adapter', to: 'subscription', dashed: true },
            ),
            edge(
                [
                    [484, 280],
                    [448, 280],
                ],
                { from: 'subscription', to: 'middleware' },
            ),
            edge(
                [
                    [240, 280],
                    [196, 280],
                ],
                { from: 'middleware', to: 'handler' },
            ),
            edge(
                [
                    [352, 336],
                    [352, 424],
                ],
                { from: 'middleware', to: 'dead-letter', dashed: true },
            ),
            edge(
                [
                    [112, 336],
                    [112, 424],
                ],
                { from: 'handler', to: 'relay', dashed: true },
            ),
            edge(
                [
                    [568, 424],
                    [568, 336],
                ],
                { from: 'recovery', to: 'subscription', dashed: true },
            ),
            edge(
                [
                    [640, 480],
                    [664, 480],
                    [664, 96],
                    [640, 96],
                ],
                { from: 'recovery', to: 'adapter', dashed: true },
            ),
            label(400, 380, 'EXHAUSTED'),
            label(156, 380, 'STOPPING'),
            node('publisher', 24, 24, 172, 88, 'Publish event', ['Typed protobuf', 'Await adapter outcome'], { topics: [`${events}getting-started`] }),
            node('topic', 240, 24, 208, 128, 'Resolve topic', ['Override, then declarations', 'Else schema.typeName', 'strictTopics can reject'], {
                focal: true,
                topics: [`${events}custom-topics`],
            }),
            node('adapter', 484, 24, 156, 128, 'Event adapter', ['Memory / NATS', 'Kafka / Redis / AMQP', 'Connect / disconnect'], { topics: [`${events}adapters`] }),
            node('subscription', 484, 224, 156, 112, ['Subscription', 'match'], ['Exact or wildcard', 'No route: ack + skip'], {
                topics: [`${events}concepts`, `${events}custom-topics`],
            }),
            node('middleware', 240, 224, 208, 112, 'Consume middleware', ['Custom → DLQ → retry', 'Retries re-enter handler'], { focal: true, topics: [`${events}middleware`] }),
            node('handler', 24, 224, 172, 112, 'Event handler', ['Side effects, then ack', 'Idempotent on redelivery'], {
                topics: [`${events}getting-started`, `${events}concepts`],
            }),
            node('dead-letter', 240, 424, 208, 128, 'Dead-letter topic', ['Copy after retry exhaustion', 'Acknowledge after publication', 'Publish failure can lose event'], {
                topics: [`${events}middleware`],
            }),
            node('recovery', 484, 424, 156, 128, ['AMQP', 'recovery'], ['Reconnect + replay', 'Restore consumers', 'Observe terminal loss'], {
                topics: [`${events}amqp-reliability`],
            }),
            node('relay', 24, 424, 172, 128, ['Shutdown', 'relay'], ['In-flight ctx.publish', 'Drain + abort grace', 'Then disconnect'], {
                topics: [`${events}concepts`, `${events}relay-during-shutdown`],
            }),
        ].join('\n'),
    },
    {
        key: 'observability',
        route: '/en/guide/observability',
        type: 'architecture',
        width: 688,
        height: 552,
        title: 'Create signals and configure their destination',
        desc: 'RPC and application instrumentation create spans, metrics and structured logs that configured providers export, with explicit resource metadata, initialization and shutdown behavior.',
        caption:
            'Instrumentation creates signals; providers configure their resources and destinations. Log correlation needs an active span. Configure remote-parent trust and data recording deliberately.',
        body: [
            edge(
                [
                    [208, 200],
                    [232, 200],
                    [232, 76],
                    [256, 76],
                ],
                { from: 'work', to: 'spans' },
            ),
            edge(
                [
                    [208, 240],
                    [256, 240],
                ],
                { from: 'work', to: 'meters' },
            ),
            edge(
                [
                    [208, 280],
                    [232, 280],
                    [232, 452],
                    [256, 452],
                ],
                { from: 'work', to: 'logs' },
            ),
            edge(
                [
                    [456, 76],
                    [480, 76],
                    [480, 168],
                    [504, 168],
                ],
                { from: 'spans', to: 'provider' },
            ),
            edge(
                [
                    [456, 260],
                    [504, 260],
                ],
                { from: 'meters', to: 'provider' },
            ),
            edge(
                [
                    [456, 452],
                    [480, 452],
                    [480, 320],
                    [504, 320],
                ],
                { from: 'logs', to: 'provider' },
            ),
            edge(
                [
                    [584, 360],
                    [584, 424],
                ],
                { from: 'provider', to: 'backend' },
            ),
            node('work', 24, 168, 184, 144, ['RPC + application', 'instrumentation'], ['Server + client RPC hooks', 'traced() / traceAll()', 'getMeter() / getLogger()']),
            node('spans', 256, 24, 200, 104, 'Traces', ['Spans + propagation', 'Errors + remote-parent trust'], { topics: [`${observe}tracing`] }),
            node('meters', 256, 208, 200, 104, 'Metrics', ['RPC duration + app meters', 'Streaming sizes are zero'], { topics: [`${observe}metrics`] }),
            node('logs', 256, 392, 200, 120, 'Logs', ['Structured event records', 'Trace IDs from active spans'], { topics: [`${observe}logging`] }),
            node(
                'provider',
                504,
                128,
                160,
                232,
                ['Provider and', 'exporters'],
                ['Service metadata', 'Per-signal exporters', 'OTLP / console / none', 'Init before first use', 'Flush at shutdown'],
                { focal: true, topics: [`${observe}backends`] },
            ),
            node('backend', 504, 424, 160, 96, ['Telemetry', 'destination'], ['Collector or console'], { topics: [`${observe}backends`] }),
        ].join('\n'),
    },
    {
        key: 'health',
        route: '/en/guide/health-checks',
        type: 'architecture',
        width: 688,
        height: 600,
        title: 'One health registry, multiple protocol views',
        desc: 'Application lifecycle and dependency checks update a shared health registry, whose gRPC and HTTP views supply platform probes without separate status state for HTTP aliases.',
        caption:
            'The application owns transitions. /healthz, /health and /readyz report the same aggregate state. Different liveness and readiness semantics require application-owned checks; changing the path name does not create another state.',
        body: [
            edge(
                [
                    [256, 84],
                    [304, 84],
                ],
                { from: 'application', to: 'manager' },
            ),
            edge(
                [
                    [384, 168],
                    [384, 208],
                    [160, 208],
                    [160, 252],
                ],
                { from: 'manager', to: 'grpc' },
            ),
            edge(
                [
                    [560, 168],
                    [560, 252],
                ],
                { from: 'manager', to: 'http' },
            ),
            edge(
                [
                    [160, 356],
                    [160, 444],
                ],
                { from: 'grpc', to: 'platform' },
            ),
            edge(
                [
                    [528, 380],
                    [528, 444],
                ],
                { from: 'http', to: 'platform' },
            ),
            node('application', 24, 24, 232, 144, ['Application', 'lifecycle + dependencies'], ['ready / stopping / checks', 'Set service / component state']),
            node(
                'manager',
                304,
                24,
                360,
                144,
                'One health registry',
                ['Services + application components', 'All must be SERVING; empty is unhealthy', 'Read aggregate or select one named entry'],
                { focal: true, topics: [`${health}protocol`] },
            ),
            node('grpc', 24, 252, 272, 104, 'gRPC health views', ['Check / Watch / List', 'Router request gate applies', 'gRPC probes need HTTP/2'], {
                topics: [`${health}protocol`],
            }),
            node('http', 392, 252, 272, 128, 'HTTP views (opt-in)', ['Aliases: /healthz /health /readyz', 'SERVING 200; unhealthy 503', '?service selects one entry'], {
                topics: [`${health}protocol`],
            }),
            node(
                'platform',
                24,
                444,
                640,
                132,
                'Platform probes and termination',
                [
                    'HTTP/1.1 or plaintext gRPC/HTTP/2, matching the server',
                    'Readiness controls traffic; liveness can restart the container',
                    'Grace period covers preStop, request drain and shutdown hooks',
                ],
                { topics: [`${health}kubernetes`] },
            ),
        ].join('\n'),
    },
];
