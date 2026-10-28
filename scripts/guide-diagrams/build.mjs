import { edge, label, node, note, zone } from './primitives.mjs';

const quickstart = '/en/guide/quickstart-manual';
const scaffolding = '/en/guide/scaffolding-commands';
const validation = '/en/guide/validation-setup';
const openapi = '/en/guide/openapi-generation';
const runn = '/en/guide/testing/runn';
const scenarigo = '/en/guide/testing/scenarigo';
const reflection = '/en/guide/protocols/reflection-tools';
const custom = '/en/guide/protocols/custom-implementation';

export const diagrams = [
    {
        key: 'quickstart',
        route: '/en/guide/quickstart',
        type: 'architecture',
        width: 688,
        height: 600,
        title: 'Build and verify the first RPC',
        desc: 'Project setup and protobuf generation feed a typed handler and server, then real clients verify both a greeting and rejection of an invalid request.',
        caption:
            'grpcurl uses h2c; curl over plaintext HTTP/1.1 requires changing the listener mode and restarting. Verify a greeting and a rejected invalid request before adding TLS, authentication and resilience.',
        body: [
            edge(
                [
                    [312, 88],
                    [344, 88],
                ],
                { from: 'project', to: 'contract' },
            ),
            edge(
                [
                    [504, 152],
                    [504, 196],
                ],
                { from: 'contract', to: 'generated' },
            ),
            edge(
                [
                    [344, 244],
                    [312, 244],
                ],
                { from: 'generated', to: 'handler' },
            ),
            edge(
                [
                    [168, 292],
                    [168, 336],
                ],
                { from: 'handler', to: 'server' },
            ),
            edge(
                [
                    [376, 372],
                    [312, 372],
                ],
                { from: 'client', to: 'server' },
            ),
            edge(
                [
                    [312, 420],
                    [376, 420],
                ],
                { from: 'server', to: 'client', dashed: true },
            ),
            edge(
                [
                    [520, 456],
                    [520, 500],
                ],
                { from: 'client', to: 'assertions' },
            ),
            label(344, 356, 'CALL'),
            label(344, 404, 'REPLY'),
            node(
                'project',
                24,
                24,
                288,
                128,
                'Prepare the project',
                ['Native .ts: Node ≥25.2; tsx path ≥22.13', 'Bun tutorial: ≥1.3.6 · install dependencies', 'ESM · tsconfig · validator · build permissions'],
                { topics: [quickstart] },
            ),
            node(
                'contract',
                344,
                24,
                320,
                128,
                'Define contract + generation',
                ['GreeterService.SayHello; name min_len = 1', 'buf.yaml + buf.gen.yaml; fetch dependencies', 'Generate .ts imports and erasable enums'],
                { shape: 'document', topics: [quickstart] },
            ),
            node('generated', 344, 196, 320, 96, 'Types + descriptors', ['build:proto produces gen/greeter_pb.ts', 'include_imports includes validation rules'], {
                shape: 'document',
                topics: [quickstart],
            }),
            node('handler', 24, 196, 288, 96, 'Implement SayHello', ['defineService + response schema', 'Return a greeting'], { topics: [quickstart] }),
            node(
                'server',
                24,
                336,
                288,
                120,
                'Start the server',
                ['createServer + default validation', 'Healthcheck + Reflection; h2c listener', 'Ready / stopping; automatic shutdown'],
                { focal: true, topics: [quickstart] },
            ),
            node(
                'client',
                376,
                336,
                288,
                120,
                'Make a real call',
                ['grpcurl: list, call and health check', 'curl: restart in HTTP/1.1 mode', 'Use the fully qualified service name'],
                { topics: [quickstart] },
            ),
            node('assertions', 376, 500, 288, 76, 'Verify both outcomes', ['Greeting; empty name: INVALID_ARGUMENT'], { shape: 'state', topics: [quickstart] }),
            note(24, 508, ['Generation: check buf and .ts imports.', 'Calls: check port, service name and TLS.', 'Add TLS, auth and resilience after first call.']),
        ].join('\n'),
    },
    {
        key: 'scaffolding',
        route: '/en/guide/scaffolding',
        type: 'tree',
        width: 688,
        height: 600,
        title: 'Scaffolding commands and owned files',
        desc: 'The builder and three CLI workflows create an editable project, add service files or fetch reflected client contracts, with distinct setup and registration requirements.',
        caption:
            'The builder previews a pinned generator; documented 1.3 options and descriptor exports are not available in npm 1.2.x. Optional modules still need their broker, auth configuration and telemetry backend.',
        body: [
            edge(
                [
                    [208, 248],
                    [232, 248],
                    [232, 96],
                    [256, 96],
                ],
                { from: 'workflows', to: 'init', arrow: false },
            ),
            edge(
                [
                    [208, 280],
                    [256, 280],
                ],
                { from: 'workflows', to: 'generate', arrow: false },
            ),
            edge(
                [
                    [208, 312],
                    [232, 312],
                    [232, 464],
                    [256, 464],
                ],
                { from: 'workflows', to: 'sync', arrow: false },
            ),
            edge(
                [
                    [440, 96],
                    [480, 96],
                ],
                { from: 'init', to: 'project' },
            ),
            edge(
                [
                    [440, 280],
                    [480, 280],
                ],
                { from: 'generate', to: 'service-files' },
            ),
            edge(
                [
                    [440, 464],
                    [480, 464],
                ],
                { from: 'sync', to: 'client-contracts' },
            ),
            node('workflows', 24, 208, 184, 144, ['Scaffold', 'workflows'], ['Builder: inspect files', 'CLI runs on Node', 'Target: Node or Bun'], {
                focal: true,
                topics: [scaffolding],
            }),
            node('init', 256, 24, 184, 144, 'init', ['Pinned base + modules', 'Names + paths checked', '--force / --ref', 'Runtime ≠ package tool'], { topics: [scaffolding] }),
            node('project', 480, 24, 184, 144, 'Editable project', ['proto · server · tests', 'Shared option imports', 'Erasable proto enums', 'pnpm allowBuilds'], {
                shape: 'document',
                topics: [scaffolding],
            }),
            node('generate', 256, 208, 184, 144, ['generate', 'service'], ['Validate service names', '--with-events optional', 'No server.ts edits'], { topics: [scaffolding] }),
            node('service-files', 480, 208, 184, 144, 'Service files', ['proto + defineService', 'Generated handler stubs', 'Implement and test them', 'Register in server.ts'], {
                shape: 'document',
                topics: [scaffolding],
            }),
            node('sync', 256, 392, 184, 144, 'proto sync', ['Reflection over HTTP/2', 'buf + plugins + template', '--dry-run / --timeout', 'All descriptors or fail'], {
                topics: [scaffolding],
            }),
            node(
                'client-contracts',
                480,
                392,
                184,
                144,
                'Client contracts',
                ['Generated by buf', 'Path printed on success', 'No partial service set', 'Inspect generated output'],
                { shape: 'document', topics: [scaffolding] },
            ),
            note(24, 556, [
                'Inspect module order and generated scripts; implement and register new services.',
                '--no-sample needs a first proto; check the CLI release before choosing options.',
            ]),
        ].join('\n'),
    },
    {
        key: 'validation',
        route: '/en/guide/validation',
        type: 'flowchart',
        width: 688,
        height: 600,
        title: 'Validate structure before business work',
        desc: 'Installed validation middleware checks regenerated protobuf constraints before serialization and the handler, returning structured input errors while business decisions remain in application code.',
        caption:
            'Annotations require installed dependencies, regenerated descriptors and an active interceptor. Structural checks do not establish uniqueness, stock availability or a customer’s credit limit.',
        body: [
            edge(
                [
                    [312, 76],
                    [328, 76],
                    [328, 160],
                    [288, 160],
                    [288, 192],
                ],
                { from: 'setup', to: 'interceptor' },
            ),
            edge(
                [
                    [504, 128],
                    [504, 160],
                    [408, 160],
                    [408, 192],
                ],
                { from: 'constraints', to: 'interceptor' },
            ),
            edge(
                [
                    [168, 248],
                    [216, 248],
                ],
                { from: 'request', to: 'interceptor' },
            ),
            edge(
                [
                    [344, 304],
                    [344, 352],
                ],
                { from: 'interceptor', to: 'decision' },
            ),
            edge(
                [
                    [472, 392],
                    [548, 392],
                    [548, 496],
                ],
                { from: 'decision', to: 'business' },
            ),
            edge(
                [
                    [216, 392],
                    [160, 392],
                    [160, 496],
                ],
                { from: 'decision', to: 'error' },
            ),
            label(582, 448, 'VALID'),
            label(202, 448, 'INVALID'),
            node('setup', 24, 24, 288, 104, 'Install + fetch rules', ['@connectrpc/validate', '@bufbuild/protovalidate', 'buf.yaml; buf dep update'], { topics: [validation] }),
            node('constraints', 344, 24, 320, 104, 'Proto constraints', ['Field and message constraints', 'Regenerate descriptors after edits'], {
                shape: 'document',
                topics: [validation],
            }),
            node('request', 24, 208, 144, 80, 'Request', ['Untrusted input'], { shape: 'state', topics: [validation] }),
            node('interceptor', 216, 192, 256, 112, 'Validation interceptor', ['Default / standalone; can disable', 'Before serializer and handler'], {
                focal: true,
                topics: [validation],
            }),
            node('decision', 216, 352, 256, 80, 'Schema valid?', [], { shape: 'decision', topics: [validation] }),
            node('error', 24, 496, 272, 80, 'INVALID_ARGUMENT', ['Field path + violated rule', 'Constraint identifier'], { shape: 'state', topics: [validation] }),
            node('business', 432, 496, 232, 80, 'Business validation', ['Handler checks business state', 'Stock · uniqueness · credit'], { topics: [validation] }),
        ].join('\n'),
    },
    {
        key: 'openapi',
        route: '/en/guide/openapi',
        type: 'architecture',
        width: 688,
        height: 592,
        title: 'Generate OpenAPI and overlay auth metadata',
        desc: 'The same proto input produces a base OpenAPI document and TypeScript descriptors that meet in an example authorization overlay before the artifact is inspected and committed.',
        caption:
            'The overlay is an example script, not a connectum openapi command. It skips absent POST operations, including the documented streaming case. Credential schemes and extensions do not prove that runtime policy permits a call.',
        body: [
            edge(
                [
                    [272, 116],
                    [272, 140],
                    [168, 140],
                    [168, 164],
                ],
                { from: 'proto', to: 'base-generation' },
            ),
            edge(
                [
                    [416, 116],
                    [416, 128],
                    [520, 128],
                    [520, 164],
                ],
                { from: 'proto', to: 'descriptors' },
            ),
            edge(
                [
                    [144, 276],
                    [144, 320],
                ],
                { from: 'base-generation', to: 'base-spec' },
            ),
            edge(
                [
                    [520, 276],
                    [520, 320],
                ],
                { from: 'descriptors', to: 'overlay' },
            ),
            edge(
                [
                    [264, 376],
                    [328, 376],
                ],
                { from: 'base-spec', to: 'overlay' },
            ),
            edge(
                [
                    [496, 432],
                    [496, 480],
                ],
                { from: 'overlay', to: 'artifact' },
            ),
            node('proto', 192, 24, 304, 92, 'Proto contracts', ['Method schemas + authorization annotations'], { shape: 'document', topics: [openapi] }),
            node('base-generation', 24, 164, 288, 112, 'Base spec generation', ['Separate buf.gen.openapi.yaml', 'Remote Connect OpenAPI plugin', 'Network access required'], {
                topics: [openapi],
            }),
            node('descriptors', 376, 164, 288, 112, 'TypeScript descriptors', ['Regenerate from the same proto input', 'Auth options; offline TS template'], {
                shape: 'document',
                topics: [openapi],
            }),
            node('base-spec', 24, 320, 240, 112, 'Base OpenAPI 3.1', ['Connect POST operations', 'Request + response schemas'], { shape: 'document', topics: [openapi] }),
            node(
                'overlay',
                328,
                320,
                336,
                112,
                'Authz overlay (example)',
                ['resolveMethodAuth(method)', 'public / bearer / internal credentials', 'x-connectum roles + scopes', 'Match schemes to runtime trust sources'],
                { focal: true, topics: [openapi] },
            ),
            node('runtime', 24, 480, 240, 88, 'Runtime enforcement', ['Interceptors enforce access', 'Code rules + gates still apply'], { topics: [openapi] }),
            node('artifact', 328, 480, 336, 88, 'OpenAPI artifact', ['Verify security + omitted operations', 'Commit YAML for Swagger, SDKs, catalogs'], {
                shape: 'document',
                topics: [openapi],
            }),
        ].join('\n'),
    },
    {
        key: 'testing',
        route: '/en/guide/testing',
        type: 'nested',
        width: 688,
        height: 600,
        title: 'Choose the testing boundary',
        desc: 'runn and scenarigo cross the deployed transport boundary, in-process clients exercise routing and middleware, and handler checks isolate business decisions.',
        caption:
            'Local tests bypass network, certificate and proxy configuration. Run success and failure scenarios against the real listener; plaintext gRPC and HTTP/1.1 require separate listener modes.',
        body: [
            zone(24, 200, 640, 376, 'Service: transport, routing and handler'),
            zone(48, 320, 592, 232, 'In-process: routes + middleware'),
            zone(72, 416, 544, 112, 'Unit: handler decisions'),
            edge(
                [
                    [176, 160],
                    [176, 184],
                    [360, 184],
                    [360, 244],
                ],
                { from: 'runn', to: 'transport' },
            ),
            edge(
                [
                    [512, 160],
                    [512, 244],
                ],
                { from: 'scenarigo', to: 'transport' },
            ),
            edge(
                [
                    [488, 308],
                    [488, 356],
                ],
                { from: 'transport', to: 'router' },
            ),
            edge(
                [
                    [312, 384],
                    [360, 384],
                ],
                { from: 'local-client', to: 'router' },
            ),
            edge(
                [
                    [488, 412],
                    [488, 452],
                ],
                { from: 'router', to: 'handler' },
            ),
            edge(
                [
                    [312, 480],
                    [360, 480],
                ],
                { from: 'handler-checks', to: 'handler' },
            ),
            node(
                'runn',
                24,
                24,
                304,
                136,
                'runn',
                ['Install binary; YAML runbooks', 'gRPC reflection or local protos; HTTP', 'Health, auth, validation, TLS, streams', 'Variables + CI / Compose runners'],
                { topics: [runn] },
            ),
            node(
                'scenarigo',
                360,
                24,
                304,
                136,
                'scenarigo',
                ['Go install; config init; run', 'gRPC reflection + HTTP scenarios', 'Templates + Go plugins; JUnit / JSON', 'Streaming support is limited'],
                { topics: [scenarigo] },
            ),
            node('transport', 240, 244, 400, 64, 'Network / TLS / proxy', ['Exercise the deployed listener configuration'], { topics: [runn, scenarigo] }),
            node('local-client', 72, 356, 240, 56, 'createLocalClient'),
            node('router', 360, 356, 256, 56, 'Router + middleware'),
            node('handler-checks', 96, 452, 216, 52, 'Handler checks'),
            node('handler', 360, 452, 232, 52, 'Handler under test', [], { focal: true }),
            note(72, 548, ['Assert success and errors; avoid repeating every unit case through the network.']),
        ].join('\n'),
    },
    {
        key: 'reflection',
        route: '/en/guide/protocols/reflection',
        type: 'architecture',
        width: 688,
        height: 592,
        title: 'Reflection setup, queries and exposure',
        desc: 'Reflection indexes mounted services and their imported descriptors once per successful materialization, shares the index across routers, and answers external tool queries at a known server address.',
        caption:
            'Reflection exposes schemas at one known address; it does not locate servers or replace the generated catalog. Protocol order controls which mounted services appear. Disable or restrict production exposure.',
        body: [
            edge(
                [
                    [168, 152],
                    [168, 184],
                    [312, 184],
                    [312, 208],
                ],
                { from: 'setup', to: 'index' },
            ),
            edge(
                [
                    [520, 152],
                    [520, 208],
                ],
                { from: 'snapshot', to: 'index' },
            ),
            edge(
                [
                    [184, 272],
                    [216, 272],
                ],
                { from: 'exposure', to: 'index', dashed: true },
            ),
            edge(
                [
                    [232, 388],
                    [232, 336],
                ],
                { from: 'tools', to: 'index' },
            ),
            edge(
                [
                    [280, 336],
                    [280, 388],
                ],
                { from: 'index', to: 'tools', dashed: true },
            ),
            edge(
                [
                    [520, 336],
                    [520, 388],
                ],
                { from: 'index', to: 'results' },
            ),
            node(
                'setup',
                24,
                24,
                288,
                128,
                'Install + enable Reflection',
                ['@connectum/reflection + peer dependencies', 'Before start / first local client', 'Plaintext h2c: allowHTTP1: false'],
                { topics: [reflection] },
            ),
            node(
                'snapshot',
                376,
                24,
                288,
                128,
                'Mounted-service snapshot',
                ['Application + earlier protocol services', 'Healthcheck before Reflection is listed', 'Declared-only services excluded'],
                { shape: 'document', topics: [reflection] },
            ),
            node('exposure', 24, 208, 160, 128, ['Exposure', 'control'], ['Disable or restrict', 'Schema is exposed', 'Known address only'], { topics: [reflection] }),
            node(
                'index',
                216,
                208,
                448,
                128,
                'Shared reflection index',
                [
                    'v1 + v1alpha; HTTP and local routers',
                    'collectFileProtos: files + transitive imports',
                    'Filename, symbol + extension indexes',
                    'Setup retries if initial materialization fails',
                ],
                { focal: true, topics: [reflection] },
            ),
            node(
                'tools',
                24,
                388,
                288,
                144,
                'Client tools',
                ['grpcurl: list / describe / call', 'buf curl: Connect over HTTP/2', 'Postman · Insomnia · Warthog', 'TLS: trust the configured CA'],
                { topics: [reflection] },
            ),
            node(
                'results',
                376,
                388,
                288,
                144,
                'Reflection query results',
                ['Mounted services; descriptor imports', 'Unknown query target: NOT_FOUND', 'Unset query: INVALID_ARGUMENT', 'Errors leave the stream open'],
                { shape: 'document', topics: [reflection] },
            ),
            note(24, 568, ['The reflection service is reachable but does not include itself in its listing.']),
        ].join('\n'),
    },
    {
        key: 'custom-protocols',
        route: '/en/guide/protocols/custom',
        type: 'architecture',
        width: 688,
        height: 600,
        title: 'Custom protocol initialization and routing',
        desc: 'A per-server factory separates snapshot-based setup from repeatable router registration, while unmatched HTTP requests pass through explicit handlers to protocol-aware fallback errors.',
        caption:
            'Keep setup idempotent because failed initial materialization can retry it. Create a fresh protocol instance per server. Supported RPC content types receive protocol-aware unimplemented errors; other unmatched requests retain 404.',
        body: [
            edge(
                [
                    [168, 152],
                    [168, 216],
                ],
                { from: 'factory', to: 'setup' },
            ),
            edge(
                [
                    [520, 152],
                    [520, 184],
                    [256, 184],
                    [256, 216],
                ],
                { from: 'context', to: 'setup' },
            ),
            edge(
                [
                    [312, 272],
                    [376, 272],
                ],
                { from: 'setup', to: 'register' },
            ),
            edge(
                [
                    [568, 216],
                    [568, 188],
                    [616, 188],
                    [616, 216],
                ],
                { from: 'register', to: 'register', dashed: true },
            ),
            edge(
                [
                    [616, 328],
                    [616, 360],
                ],
                { from: 'register', to: 'rpc' },
            ),
            edge(
                [
                    [116, 360],
                    [116, 344],
                    [520, 344],
                    [520, 360],
                ],
                { from: 'request', to: 'rpc' },
            ),
            edge(
                [
                    [208, 408],
                    [248, 408],
                ],
                { from: 'request', to: 'http-handler' },
            ),
            edge(
                [
                    [340, 456],
                    [340, 500],
                ],
                { from: 'http-handler', to: 'fallback' },
            ),
            label(592, 172, 'NEW ROUTER'),
            label(374, 478, 'FALSE'),
            node(
                'factory',
                24,
                24,
                288,
                128,
                ['One factory instance', 'per server'],
                ['name; synchronous setup / register', 'Add before start or the first local client', 'Keep server state in a fresh closure'],
                { topics: [custom] },
            ),
            node(
                'context',
                376,
                24,
                288,
                128,
                'ProtocolContext snapshot',
                ['services: mounted service descriptors', 'registry: their files + imports', 'Application + preceding protocols'],
                { shape: 'document', topics: [custom] },
            ),
            node(
                'setup',
                24,
                216,
                288,
                112,
                'setup(context)',
                ['Read snapshot; prepare shared state', 'Once after successful materialization', 'Initial failure can rerun setup'],
                { focal: true, topics: [custom] },
            ),
            node('register', 376, 216, 288, 112, 'register(router)', ['Only add RPC routes', 'Repeats per HTTP / local router', 'No observable side effects'], {
                topics: [custom],
            }),
            node('request', 24, 360, 184, 96, 'HTTP request', ['RPC routes checked first', 'Then HTTP fallbacks'], { shape: 'state', topics: [custom] }),
            node('http-handler', 248, 360, 184, 96, 'Unmatched HTTP', ['httpHandler: /metrics', 'true handles; false passes'], { topics: [custom] }),
            node('rpc', 472, 360, 192, 96, 'Matched RPC route', ['ServerInfo endpoint', 'HTTP + local routers'], { topics: [custom] }),
            node('fallback', 248, 500, 416, 76, 'Default fallback', ['Unknown Connect / gRPC / gRPC-Web: unimplemented', 'Other requests: 404 Not Found'], {
                shape: 'state',
                topics: [custom],
            }),
        ].join('\n'),
    },
];
