import { edge, label, node, note, text, zone } from './primitives.mjs';

const auth = '/en/guide/auth/';
const server = '/en/guide/server/';
const interceptors = '/en/guide/interceptors/';
const security = '/en/guide/security/';
const typescript = '/en/guide/typescript/';

export const diagrams = [
    {
        key: 'auth',
        route: '/en/guide/auth',
        type: 'architecture',
        width: 688,
        height: 592,
        title: 'Authentication and authorization',
        desc: 'Client credentials are verified by a chosen authentication strategy, which establishes the shared identity used by code or proto-based authorization and by context-aware application code and tests.',
        caption:
            'Choose authentication for the trust boundary and authorization for the method policy. Context, propagation and testing share the verified identity; attaching client credentials does not verify them.',
        body: [
            zone(40, 120, 608, 128, ''),
            text(176, 144, 'Choose a verifier', 'heading'),
            edge(
                [
                    [264, 88],
                    [264, 104],
                    [144, 104],
                    [144, 160],
                ],
                { from: 'client', to: 'jwt' },
            ),
            edge(
                [
                    [344, 88],
                    [344, 160],
                ],
                { from: 'client', to: 'gateway' },
            ),
            edge(
                [
                    [424, 88],
                    [424, 104],
                    [536, 104],
                    [536, 160],
                ],
                { from: 'client', to: 'session' },
            ),
            edge(
                [
                    [144, 224],
                    [144, 280],
                    [264, 280],
                    [264, 320],
                ],
                { from: 'jwt', to: 'context' },
            ),
            edge(
                [
                    [344, 224],
                    [344, 320],
                ],
                { from: 'gateway', to: 'context' },
            ),
            edge(
                [
                    [536, 224],
                    [536, 280],
                    [424, 280],
                    [424, 320],
                ],
                { from: 'session', to: 'context' },
            ),
            edge(
                [
                    [264, 400],
                    [264, 432],
                    [180, 432],
                    [180, 464],
                ],
                { from: 'context', to: 'code' },
            ),
            edge(
                [
                    [424, 400],
                    [424, 432],
                    [508, 432],
                    [508, 464],
                ],
                { from: 'context', to: 'proto' },
            ),
            node('client', 184, 24, 320, 64, 'Client credentials', ['Bearer token or trusted gateway headers'], { topics: [`${auth}client-interceptors`] }),
            node('jwt', 56, 160, 176, 64, 'JWT', ['Signature · claims'], { topics: [`${auth}jwt`] }),
            node('gateway', 248, 160, 176, 64, 'Gateway', ['Trust source · headers'], { topics: [`${auth}gateway`] }),
            node('session', 440, 160, 192, 64, 'Session', ['Verify · map identity'], { topics: [`${auth}session`] }),
            node('context', 184, 320, 320, 80, 'Auth context and testing', ['Request / stream identity · propagation', 'Mock context · signed test JWTs'], {
                focal: true,
                topics: [`${auth}context`],
            }),
            node('code', 40, 464, 280, 80, 'Code authorization', ['Rules · callback · default policy'], { topics: [`${auth}authorization`] }),
            node('proto', 368, 464, 280, 80, 'Proto-based authorization', ['Public / internal · roles / scopes'], { topics: [`${auth}proto-authz`] }),
            note(40, 576, ['A valid credential is not permission to invoke every method.']),
        ].join('\n'),
    },
    {
        key: 'server',
        route: '/en/guide/server',
        type: 'state',
        width: 688,
        height: 416,
        title: 'Configure, run and stop a server',
        desc: 'Validated configuration feeds the server lifecycle, while shutdown signals cancellation, drains network connections and executes dependency-ordered hooks before the server stops.',
        caption:
            'Configuration, lifecycle and graceful shutdown own different tasks. The drain timeout does not bound shutdown hooks; in-process cancellation remains cooperative.',
        body: [
            edge(
                [
                    [100, 88],
                    [100, 160],
                ],
                { from: 'configuration', to: 'created' },
            ),
            edge(
                [
                    [160, 192],
                    [204, 192],
                ],
                { from: 'created', to: 'starting' },
            ),
            edge(
                [
                    [324, 192],
                    [368, 192],
                ],
                { from: 'starting', to: 'running' },
            ),
            edge(
                [
                    [488, 192],
                    [532, 192],
                ],
                { from: 'running', to: 'stopping' },
            ),
            edge(
                [
                    [588, 224],
                    [588, 248],
                    [140, 248],
                    [140, 296],
                ],
                { from: 'stopping', to: 'drain' },
            ),
            edge(
                [
                    [240, 328],
                    [288, 328],
                ],
                { from: 'drain', to: 'hooks' },
            ),
            edge(
                [
                    [456, 328],
                    [504, 328],
                ],
                { from: 'hooks', to: 'stopped' },
            ),
            node('configuration', 40, 24, 608, 64, 'Configuration', ['Validate and wire options · environment · TLS · shutdown policy'], { topics: [`${server}configuration`] }),
            text(204, 132, 'Lifecycle and application-owned readiness', 'heading'),
            node('created', 40, 160, 120, 64, 'created', [], { shape: 'state', topics: [`${server}lifecycle`] }),
            node('starting', 204, 160, 120, 64, 'starting', ['start()'], { shape: 'state', topics: [`${server}lifecycle`] }),
            node('running', 368, 160, 120, 64, 'running', ['ready event'], { shape: 'state', focal: true, topics: [`${server}lifecycle`] }),
            node('stopping', 532, 160, 116, 64, 'stopping', ['stop() · abort'], { shape: 'state', topics: [`${server}graceful-shutdown`] }),
            node('drain', 40, 296, 200, 64, 'Connection drain', ['Network · timeout'], { topics: [`${server}graceful-shutdown`] }),
            node('hooks', 288, 296, 168, 64, 'Shutdown hooks', ['Dependency order'], { topics: [`${server}graceful-shutdown`] }),
            node('stopped', 504, 296, 144, 64, 'stopped', ['No restart'], { shape: 'state', topics: [`${server}lifecycle`] }),
            note(40, 396, ['Use the ready / stopping events to update application health explicitly.']),
        ].join('\n'),
    },
    {
        key: 'interceptors',
        route: '/en/guide/interceptors',
        type: 'architecture',
        width: 688,
        height: 536,
        title: 'Compose and select RPC interceptors',
        desc: 'Built-in and custom wrappers are selected by service scope and method filters, then wrap the handler through next with result and error handling on the return path.',
        caption:
            'Composition and selection are separate: service options replace the global chain, while method filtering selects applicable wrappers. Each wrapper can act before next and on its result or error.',
        body: [
            text(40, 40, 'Compose the behavior', 'heading'),
            edge(
                [
                    [136, 184],
                    [136, 220],
                    [256, 220],
                    [256, 264],
                ],
                { from: 'built-in', to: 'applied' },
            ),
            edge(
                [
                    [344, 184],
                    [344, 264],
                ],
                { from: 'custom', to: 'applied' },
            ),
            edge(
                [
                    [552, 184],
                    [552, 220],
                    [432, 220],
                    [432, 264],
                ],
                { from: 'filter', to: 'applied' },
            ),
            edge(
                [
                    [280, 360],
                    [280, 432],
                ],
                { from: 'applied', to: 'handler' },
            ),
            edge(
                [
                    [408, 432],
                    [408, 360],
                ],
                { from: 'handler', to: 'applied', dashed: true },
            ),
            label(250, 396, 'NEXT'),
            label(446, 396, 'RESULT'),
            node('built-in', 40, 80, 192, 104, 'Built-in chain', ['Error handling · validation', 'Resilience: opt in'], { topics: [`${interceptors}built-in`] }),
            node('custom', 248, 80, 192, 104, 'Custom wrappers', ['Before · after · catch', 'Test behavior'], { topics: [`${interceptors}custom`] }),
            node('filter', 456, 80, 192, 104, 'Method filtering', ['Patterns · call kinds', 'Dynamic: custom wrapper'], { topics: [`${interceptors}method-filtering`] }),
            node('applied', 168, 264, 352, 96, 'Applied chain', ['Global defaults OR service replacement', 'Error handler first · explicit policy order'], {
                focal: true,
                topics: [`${interceptors}built-in`, `${interceptors}custom`, `${interceptors}method-filtering`],
            }),
            node('handler', 168, 432, 352, 64, 'RPC handler', ['Business behavior'], { topics: [`${interceptors}custom`] }),
        ].join('\n'),
    },
    {
        key: 'security',
        route: '/en/guide/security',
        type: 'architecture',
        width: 688,
        height: 568,
        title: 'Connection trust and request admission',
        desc: 'TLS and optional enforced mTLS protect the configured connection, while RPC request gates and message limits run before application interceptors and do not guard raw HTTP fallback handlers.',
        caption:
            'Connection trust, pre-body admission and application policy protect different boundaries. Raw HTTP handlers, including HTTP health aliases, bypass RPC admission.',
        body: [
            edge(
                [
                    [216, 144],
                    [216, 208],
                ],
                { from: 'connection', to: 'gate' },
            ),
            edge(
                [
                    [552, 144],
                    [552, 208],
                ],
                { from: 'connection', to: 'http' },
            ),
            edge(
                [
                    [216, 280],
                    [216, 328],
                ],
                { from: 'gate', to: 'limit' },
            ),
            edge(
                [
                    [216, 400],
                    [216, 448],
                ],
                { from: 'limit', to: 'application' },
            ),
            node(
                'connection',
                40,
                40,
                608,
                104,
                'TLS: verify the server; optional mTLS: verify the client',
                ['Certificate + key · trusted CA · deployment-managed rotation', 'Enforced mTLS needs both requestCert and rejectUnauthorized'],
                { topics: [`${security}tls`, `${security}mtls`] },
            ),
            node('gate', 40, 208, 352, 72, 'Request gate', ['Headers only · before body and interceptors'], { focal: true, topics: [`${security}request-admission`] }),
            node('limit', 40, 328, 352, 72, 'Message-size limit', ['readMaxBytes · each RPC message'], { topics: [`${security}request-admission`] }),
            node('application', 40, 448, 352, 72, 'Application interceptors and handler', ['Authentication · authorization · validation']),
            node('http', 456, 208, 192, 112, 'Raw HTTP', ['Explicit fallback', 'Own admission policy'], { topics: [`${security}request-admission`] }),
            note(456, 380, ['RPC admission also applies', 'to local clients and to', 'Health / Reflection RPCs.']),
            note(40, 552, ['Gate errors must already be client-safe; gate auditing is application-owned.']),
        ].join('\n'),
    },
    {
        key: 'runtime',
        route: '/en/guide/runtime-compatibility',
        type: 'tree',
        width: 688,
        height: 512,
        title: 'Runtime requirements and feature coverage',
        desc: 'Requirements depend on whether the application executes compiled JavaScript, native TypeScript or Bun, while client transport, testing helpers, CLI and telemetry each need their own recorded coverage.',
        caption:
            'A package engine floor, an application execution requirement and a tested integration are separate claims. Contributor and CI environments have their own requirements.',
        body: [
            edge(
                [
                    [184, 104],
                    [184, 136],
                    [132, 136],
                    [132, 176],
                ],
                { from: 'artifact', to: 'compiled', arrow: false },
            ),
            edge(
                [
                    [344, 104],
                    [344, 176],
                ],
                { from: 'artifact', to: 'native', arrow: false },
            ),
            edge(
                [
                    [504, 104],
                    [504, 136],
                    [556, 136],
                    [556, 176],
                ],
                { from: 'artifact', to: 'bun', arrow: false },
            ),
            node('artifact', 40, 40, 608, 64, 'What executes the application?', ['Choose the artifact first; then check the modules and transport you use.'], {
                focal: true,
                topics: ['/en/guide/runtime-compatibility-details'],
            }),
            node('compiled', 40, 176, 184, 104, ['Compiled JS / tsx'], ['Node ≥22.13.0', 'Published package floor'], { topics: ['/en/guide/runtime-compatibility-details'] }),
            node('native', 252, 176, 184, 104, 'Native .ts', ['Node ≥25.2.0', 'Erasable source'], { topics: ['/en/guide/runtime-compatibility-details'] }),
            node('bun', 464, 176, 184, 104, 'Bun', ['Check feature limits', 'HTTP/2 client boundary'], { topics: ['/en/guide/runtime-compatibility-details'] }),
            node(
                'coverage',
                40,
                336,
                608,
                136,
                'Coverage is feature-specific',
                [
                    'Transport / streaming · local testing versus Node-only parity',
                    'CLI: Node exercised · Bun telemetry: not validated',
                    'Exact versions and untested combinations belong to the coverage table.',
                ],
                { topics: ['/en/guide/runtime-compatibility-details'] },
            ),
        ].join('\n'),
    },
    {
        key: 'typescript',
        route: '/en/guide/typescript',
        type: 'architecture',
        width: 688,
        height: 512,
        title: 'TypeScript source, generation and execution',
        desc: 'Erasable application source and regenerated proto enums feed runtime execution and separate type checking, while published framework packages provide executable ESM and declarations for the development workflow.',
        caption:
            'Runtime execution consumes JavaScript; type checking consumes declarations. Native stripping requires erasable source, including generated proto enums, and does not replace tsc.',
        body: [
            edge(
                [
                    [180, 152],
                    [180, 232],
                ],
                { from: 'source', to: 'runtime' },
            ),
            edge(
                [
                    [508, 152],
                    [508, 232],
                ],
                { from: 'source', to: 'checking' },
            ),
            edge(
                [
                    [180, 400],
                    [180, 320],
                ],
                { from: 'published', to: 'runtime' },
            ),
            edge(
                [
                    [508, 400],
                    [508, 320],
                ],
                { from: 'published', to: 'checking' },
            ),
            node(
                'source',
                40,
                40,
                608,
                112,
                'Application source and generated protobuf code',
                ['Erasable syntax · explicit type imports · source import extensions', 'Proto enums: regenerate with protoc-gen-es erasable_syntax=true'],
                { topics: [`${typescript}erasable-syntax`, `${typescript}proto-enums`] },
            ),
            node('runtime', 40, 232, 280, 88, 'Execute', ['Node stripping / tsx / Bun', 'Loads compiled ESM .js'], { topics: [`${typescript}runtime-support`] }),
            node('checking', 368, 232, 280, 88, 'Check and develop', ['tsc --noEmit + declarations', 'Patterns · generation · watch workflow'], {
                focal: true,
                topics: [`${typescript}patterns`],
            }),
            node('published', 40, 400, 608, 80, 'Published Connectum packages', ['Compiled ESM JavaScript + .d.ts type declarations'], {
                topics: [`${typescript}runtime-support`],
            }),
        ].join('\n'),
    },
    {
        key: 'transport',
        route: '/en/guide/production/transport-matrix',
        type: 'tree',
        width: 688,
        height: 552,
        title: 'Choose the complete transport path',
        desc: 'The wire protocol and RPC kind determine the listener choice, and each proxy leg and runtime-specific measurement must be checked independently before claiming a supported end-to-end path.',
        caption:
            'Native gRPC always needs HTTP/2; Connect bidirectional streaming also needs it. A plaintext listener chooses HTTP/1.1 or h2c. A mixed port needs TLS/ALPN or a suitable proxy.',
        body: [
            edge(
                [
                    [184, 104],
                    [184, 136],
                    [132, 136],
                    [132, 176],
                ],
                { from: 'requirements', to: 'http1', arrow: false },
            ),
            edge(
                [
                    [344, 104],
                    [344, 176],
                ],
                { from: 'requirements', to: 'h2c', arrow: false },
            ),
            edge(
                [
                    [504, 104],
                    [504, 136],
                    [556, 136],
                    [556, 176],
                ],
                { from: 'requirements', to: 'tls', arrow: false },
            ),
            node('requirements', 40, 40, 608, 64, 'Wire protocol + RPC kind', ['Connect or native gRPC · unary or streaming'], {
                focal: true,
                topics: ['/en/guide/production/transport-matrix-details'],
            }),
            node('http1', 40, 176, 184, 120, ['Plain HTTP/1.1'], ['Connect', 'No bidirectional stream'], { topics: ['/en/guide/production/transport-matrix-details'] }),
            node('h2c', 252, 176, 184, 120, 'Plaintext h2c', ['HTTP/2 only', 'Native gRPC + Connect'], { topics: ['/en/guide/production/transport-matrix-details'] }),
            node('tls', 464, 176, 184, 120, 'TLS + ALPN', ['Negotiated HTTP/1.1 / h2', 'gRPC / bidi: use h2'], { topics: ['/en/guide/production/transport-matrix-details'] }),
            text(40, 356, 'Check configuration and evidence separately', 'heading'),
            node('proxy', 40, 392, 280, 104, 'Every proxy leg', ['Listener · upstream negotiation', 'Startup checks and warnings'], {
                topics: ['/en/guide/production/transport-matrix-details'],
            }),
            node('evidence', 368, 392, 280, 104, 'Recorded coverage', ['Runtime / client versions', 'Measurements · untested rows'], {
                topics: ['/en/guide/production/transport-matrix-details'],
            }),
            note(40, 532, ['HTTP/2 at the edge does not guarantee HTTP/2 reaches the application.']),
        ].join('\n'),
    },
];
