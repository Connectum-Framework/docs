import { edge, label, node, note, text, zone } from './primitives.mjs';

const topics = {
    docker: ['/en/guide/production/docker-configuration'],
    kubernetes: ['/en/guide/production/kubernetes-configuration'],
    envoy: ['/en/guide/production/envoy-gateway-setup'],
    mesh: ['/en/guide/production/service-mesh-setup'],
    architecture: ['/en/guide/production/architecture-details'],
    inProcess: ['/en/guide/production/in-process-transport-details'],
};

export const diagrams = [
    {
        key: 'docker',
        route: '/en/guide/production/docker',
        type: 'architecture',
        width: 688,
        height: 600,
        title: 'Package the process before launch',
        desc: 'Build-time dependencies and generated code form a runtime image, while launch configuration, protocol-aware probes and termination handling remain explicit.',
        caption:
            'Recipe overview, not a live-validated image. Supply secrets at launch, install startup dependencies during the build, and validate the selected runtime and probe.',
        body: [
            zone(24, 24, 304, 480, 'Build environment'),
            zone(368, 24, 296, 480, 'Runtime container'),
            edge(
                [
                    [172, 176],
                    [172, 220],
                ],
                { from: 'docker-inputs', to: 'docker-build' },
            ),
            edge(
                [
                    [304, 268],
                    [344, 268],
                    [344, 144],
                    [392, 144],
                ],
                { from: 'docker-build', to: 'docker-image' },
            ),
            edge(
                [
                    [640, 168],
                    [652, 168],
                    [652, 408],
                    [640, 408],
                ],
                { from: 'docker-image', to: 'docker-service' },
            ),
            edge(
                [
                    [496, 336],
                    [496, 368],
                ],
                { from: 'docker-config', to: 'docker-service', dashed: true },
            ),
            node('docker-inputs', 40, 80, 264, 96, 'Build inputs', ['lockfile copied before sources', '.dockerignore keeps proto inputs'], {
                shape: 'document',
                topics: topics.docker,
            }),
            node('docker-build', 40, 220, 264, 100, 'Build stage', ['locked install + buf generate', 'prune caches and dev tooling'], { topics: topics.docker }),
            node(
                'docker-image',
                392,
                80,
                248,
                128,
                'Runtime image',
                ['app + generated + prod deps', 'Node / Bun runtime', 'non-root; pin runtime digest', 'Alpine: validate libc / arch'],
                { focal: true, topics: topics.docker },
            ),
            node('docker-config', 392, 248, 248, 88, 'Launch configuration', ['environment / service / port', 'secrets supplied at launch'], { topics: topics.docker }),
            node('docker-service', 392, 368, 248, 104, 'Service process', ['h2c probe speaks HTTP/2', '/healthz: 200 or 503', 'termination signal + drain'], {
                topics: topics.docker,
            }),
            node(
                'docker-command',
                40,
                344,
                264,
                144,
                'Choose execution mode',
                ['JS / tsx: Node ≥22.13.0', 'native TS: Node ≥25.2.0', 'Bun: execute TypeScript', 'tsx: production dependency', 'no registry download at start'],
                { topics: topics.docker },
            ),
            node('docker-compose', 24, 520, 640, 56, 'Local Compose + OTel', ['services → collector → traces / metrics backends; verify your chosen stack'], {
                topics: topics.docker,
            }),
        ].join('\n'),
    },
    {
        key: 'kubernetes',
        route: '/en/guide/production/kubernetes',
        type: 'architecture',
        width: 688,
        height: 600,
        title: 'Configure replicas and control readiness',
        desc: 'A namespace contains deployment configuration, scaling and access controls, while a separate readiness path controls which pod addresses receive RPC traffic.',
        caption:
            'Configuration recipes are not a live-validated rollout. Derive resources and scaling from the workload. Keep readiness separate from RPC traffic and budget termination for preStop, drain, hooks and a safety margin.',
        body: [
            zone(24, 24, 640, 552, 'Namespace per environment'),
            edge(
                [
                    [368, 132],
                    [320, 132],
                ],
                { from: 'kubernetes-config', to: 'kubernetes-deployment', dashed: true },
            ),
            edge(
                [
                    [368, 280],
                    [344, 280],
                    [344, 164],
                    [320, 164],
                ],
                { from: 'kubernetes-scaling', to: 'kubernetes-deployment', dashed: true },
            ),
            edge(
                [
                    [164, 312],
                    [164, 360],
                ],
                { from: 'kubernetes-service', to: 'kubernetes-endpoints' },
            ),
            edge(
                [
                    [280, 396],
                    [368, 396],
                ],
                { from: 'kubernetes-endpoints', to: 'kubernetes-pod' },
            ),
            edge(
                [
                    [536, 432],
                    [536, 464],
                ],
                { from: 'kubernetes-pod', to: 'kubernetes-readiness', dashed: true },
            ),
            edge(
                [
                    [368, 500],
                    [340, 500],
                    [340, 412],
                    [280, 412],
                ],
                { from: 'kubernetes-readiness', to: 'kubernetes-endpoints', dashed: true },
            ),
            node('kubernetes-deployment', 48, 80, 272, 104, 'Deployment', ['rolling updates + pod security', 'requests / limits + topology'], { topics: topics.kubernetes }),
            node(
                'kubernetes-config',
                368,
                80,
                272,
                104,
                'ConfigMap + Secret',
                ['config separate from credentials', 'mount TLS only for app TLS', 'role / port / OTel / upstream'],
                { topics: topics.kubernetes },
            ),
            node('kubernetes-scaling', 368, 224, 272, 104, 'HPA + RBAC', ['scale for your measured workload', 'dedicated ServiceAccount', 'RoleBindings only if needed'], {
                topics: topics.kubernetes,
            }),
            node('kubernetes-service', 48, 224, 272, 88, 'Service', ['ClusterIP :5000; appProtocol grpc', 'external: verify TLS + HTTP/2'], { topics: topics.kubernetes }),
            node('kubernetes-endpoints', 48, 360, 232, 72, 'Ready endpoints', ['only ready pod addresses'], { focal: true, topics: topics.kubernetes }),
            node('kubernetes-pod', 368, 360, 272, 72, 'Connectum pod', ['RPC handlers + middleware :5000'], { topics: topics.kubernetes }),
            node(
                'kubernetes-readiness',
                368,
                464,
                272,
                96,
                'Readiness and probes',
                ['startup and liveness are separate', '/healthz and /readyz share state', 'h2c: gRPC / HTTP/2 exec probe'],
                { topics: topics.kubernetes },
            ),
            node('kubernetes-termination', 48, 464, 272, 96, 'Termination budget', ['NOT_SERVING before drain', 'grace ≥ preStop + drain + hooks', '+ application safety margin'], {
                topics: topics.kubernetes,
            }),
        ].join('\n'),
    },
    {
        key: 'envoy',
        route: '/en/guide/production/envoy-gateway',
        type: 'architecture',
        width: 688,
        height: 600,
        title: 'Keep gateway artifacts separate',
        desc: 'Annotated protobuf contracts produce descriptors and documentation separately, while explicitly configured gateway routes and a transcoder reach the backend over HTTP/2.',
        caption:
            'Integration plan, not a live-validated manifest set. OpenAPI and Swagger UI document the API; descriptors, mounts, routes and the enabled filter implement transcoding. Native gRPC keeps its own route.',
        body: [
            zone(264, 152, 400, 304, 'Optional Envoy Gateway edge'),
            edge(
                [
                    [240, 72],
                    [296, 72],
                ],
                { from: 'envoy-proto', to: 'envoy-descriptor', dashed: true },
            ),
            edge(
                [
                    [132, 120],
                    [132, 164],
                ],
                { from: 'envoy-proto', to: 'envoy-openapi', dashed: true },
            ),
            edge(
                [
                    [320, 120],
                    [320, 136],
                    [272, 136],
                    [272, 388],
                    [288, 388],
                ],
                { from: 'envoy-descriptor', to: 'envoy-transcoder', dashed: true },
            ),
            edge(
                [
                    [376, 288],
                    [376, 344],
                ],
                { from: 'envoy-config', to: 'envoy-transcoder', dashed: true },
            ),
            edge(
                [
                    [568, 288],
                    [568, 344],
                ],
                { from: 'envoy-config', to: 'envoy-native', dashed: true },
            ),
            edge(
                [
                    [384, 432],
                    [384, 480],
                ],
                { from: 'envoy-transcoder', to: 'envoy-backend' },
            ),
            edge(
                [
                    [568, 432],
                    [568, 480],
                ],
                { from: 'envoy-native', to: 'envoy-backend' },
            ),
            node('envoy-proto', 24, 24, 216, 96, 'Proto annotations', ['google.api.http bindings', 'Google API BSR imports'], { shape: 'document', topics: topics.envoy }),
            node('envoy-descriptor', 296, 24, 344, 96, 'Protobuf descriptor set', ['buf build; regenerate on proto change', 'mount file read-only in data-plane pods'], {
                shape: 'document',
                topics: topics.envoy,
            }),
            node(
                'envoy-openapi',
                24,
                164,
                216,
                116,
                'OpenAPI + /docs',
                ['canonical OpenAPI + authz', 'Swagger UI serves /docs', 'documentation artifact', 'does not add a transcoder'],
                { shape: 'document', topics: topics.envoy },
            ),
            node(
                'envoy-config',
                288,
                192,
                352,
                96,
                'Listeners and policies',
                ['GatewayClass / Gateway listeners', 'HTTPRoute / GRPCRoute + policy', 'enable patch; installed xDS names'],
                { topics: topics.envoy },
            ),
            node('envoy-transcoder', 288, 344, 192, 88, 'REST transcoder', ['filter before router', 'JSON ↔ gRPC bindings'], {
                focal: true,
                topics: topics.envoy,
            }),
            node('envoy-native', 504, 344, 136, 88, 'Native gRPC', ['GRPCRoute', ':9090'], { topics: topics.envoy }),
            node('envoy-backend', 288, 480, 352, 96, 'Connectum backend', ['gRPC over HTTP/2 :5000', 'middleware + application authz', 'verify upstream TLS / protocol'], {
                topics: topics.envoy,
            }),
            node(
                'envoy-operations',
                24,
                328,
                216,
                248,
                'Deploy and check',
                [
                    'install matching Gateway',
                    'L7 request load balancing',
                    'rate limits via policy',
                    'CI updates descriptor',
                    'restart data-plane pods',
                    'inspect route conditions',
                    'valid + rejected JSON',
                    'recipe not live-validated',
                ],
                { topics: topics.envoy },
            ),
        ].join('\n'),
    },
    {
        key: 'mesh',
        route: '/en/guide/production/service-mesh',
        type: 'architecture',
        width: 688,
        height: 600,
        title: 'Separate mesh and application policy',
        desc: 'Optional Istio sidecars apply configured workload mTLS and traffic policy, while the application retains user authorization, contracts, resilience and explicit telemetry instrumentation.',
        caption:
            'Recipe overview, not a live-validated mesh deployment. Workload identity does not authorize a user RPC. Retain application TLS when required by the deployment, and coordinate retry ownership and budgets.',
        body: [
            zone(264, 24, 400, 312, 'Optional mesh and application boundary'),
            edge(
                [
                    [240, 104],
                    [288, 104],
                ],
                { from: 'mesh-install', to: 'mesh-caller', dashed: true },
            ),
            edge(
                [
                    [432, 124],
                    [496, 124],
                ],
                { from: 'mesh-caller', to: 'mesh-peer' },
            ),
            edge(
                [
                    [568, 168],
                    [568, 216],
                ],
                { from: 'mesh-peer', to: 'mesh-application' },
            ),
            edge(
                [
                    [240, 280],
                    [264, 280],
                    [264, 188],
                    [504, 188],
                    [504, 168],
                ],
                { from: 'mesh-policy', to: 'mesh-peer', dashed: true },
            ),
            edge(
                [
                    [464, 320],
                    [464, 368],
                ],
                { from: 'mesh-application', to: 'mesh-telemetry', dashed: true },
            ),
            label(464, 108, 'MTLS'),
            node(
                'mesh-install',
                24,
                24,
                216,
                120,
                'Istio installation',
                ['optional infrastructure', 'install Istio + webhook', 'label namespace; new pods', 'inspect pod containers'],
                { topics: topics.mesh },
            ),
            node(
                'mesh-policy',
                24,
                184,
                216,
                224,
                'Mesh policy',
                [
                    'PeerAuthentication STRICT',
                    'AuthorizationPolicy',
                    'VirtualService: canary',
                    'header routing',
                    'add subsets + pod labels',
                    'DestinationRule: outliers',
                    'connection pooling',
                    'sidecar CPU / memory',
                    'h2c-aware health probes',
                ],
                { topics: topics.mesh },
            ),
            node('mesh-caller', 288, 80, 144, 88, ['Caller +', 'sidecar'], ['HTTP/2'], { topics: topics.mesh }),
            node('mesh-peer', 496, 80, 144, 88, ['Target', 'sidecar'], ['h2c to app'], { topics: topics.mesh }),
            node(
                'mesh-application',
                288,
                216,
                352,
                104,
                'Application policy',
                ['user identity + method authz', 'proto contracts stay in application', 'h2c needs matching proxy upstream'],
                { focal: true, topics: topics.mesh },
            ),
            node(
                'mesh-telemetry',
                288,
                368,
                352,
                96,
                'Telemetry integration',
                ['mesh Telemetry + application OTel', 'W3C trace context; explicit hooks', 'OTLP / metrics + Kiali visibility'],
                { topics: topics.mesh },
            ),
            node(
                'mesh-migration',
                24,
                432,
                216,
                144,
                'Migration',
                ['core TLS / OTel w/o mesh', 'keep app chain + OTel', 'pick proxy-app transport', 'app retry / breaker', 'one retry owner + budgets'],
                { topics: topics.mesh },
            ),
            node('mesh-rollout', 288, 504, 352, 72, 'Rollout validation', ['check injection, subsets, unhealthy probe', 'recipes need live deployment validation'], {
                topics: topics.mesh,
            }),
        ].join('\n'),
    },
    {
        key: 'architecture',
        route: '/en/guide/production/architecture',
        type: 'architecture',
        width: 688,
        height: 600,
        title: 'One process and its extension seams',
        desc: 'One Connectum process composes shared RPC dispatch, protocol HTTP fallbacks and optional catalog, EventBus and telemetry capabilities while deployment infrastructure and remote systems remain outside.',
        caption:
            'createServer() owns one process. Catalog, EventBus and OTel are explicit additions; the bus can stay in memory. Protocol HTTP fallbacks sit outside the RPC chain. External infrastructure is selected independently.',
        body: [
            text(24, 32, 'Compose one process with createServer()', 'heading'),
            note(24, 56, ['Build time: schemas, descriptors and optional generated catalog']),
            zone(24, 80, 424, 496, 'One process / createServer()'),
            text(48, 124, 'register · start · drain · stop', 'tag'),
            text(488, 104, 'Outside runtime', 'heading'),
            edge(
                [
                    [144, 216],
                    [144, 248],
                ],
                { from: 'architecture-adapter', to: 'architecture-rpc' },
            ),
            edge(
                [
                    [356, 216],
                    [356, 248],
                ],
                { from: 'architecture-adapter', to: 'architecture-http' },
            ),
            edge(
                [
                    [152, 368],
                    [152, 400],
                ],
                { from: 'architecture-rpc', to: 'architecture-catalog' },
            ),
            edge(
                [
                    [48, 444],
                    [36, 444],
                    [36, 308],
                    [48, 308],
                ],
                { from: 'architecture-catalog', to: 'architecture-rpc', dashed: true },
            ),
            edge(
                [
                    [256, 444],
                    [272, 444],
                    [272, 388],
                    [488, 388],
                ],
                { from: 'architecture-catalog', to: 'architecture-remote' },
            ),
            edge(
                [
                    [424, 444],
                    [456, 444],
                    [456, 480],
                    [488, 480],
                ],
                { from: 'architecture-bus', to: 'architecture-backends', dashed: true },
            ),
            edge(
                [
                    [424, 532],
                    [488, 532],
                ],
                { from: 'architecture-otel', to: 'architecture-backends', dashed: true },
            ),
            node('architecture-adapter', 48, 144, 376, 72, 'Network adapter + routes', ['TransportManager owns HTTP', 'service / protocol RPC routes'], {
                topics: topics.architecture,
            }),
            node('architecture-rpc', 48, 248, 208, 120, ['Shared RPC', 'boundary'], ['network + local callers', 'admission + interceptors', 'typed handler + Context'], {
                focal: true,
                topics: topics.architecture,
            }),
            node('architecture-http', 292, 248, 132, 120, ['HTTP', 'fallback'], ['/healthz', 'outside RPC', 'interceptors'], { topics: topics.architecture }),
            node('architecture-catalog', 48, 400, 208, 88, 'Optional catalog', ['ctx.call / ctx.stream', 'local or remoteResolver'], { focal: true, topics: topics.architecture }),
            node('architecture-bus', 292, 400, 132, 88, 'EventBus', ['supplied bus', 'start / stop'], { topics: topics.architecture }),
            node('architecture-otel', 48, 504, 376, 56, 'Opt-in telemetry', ['provider + server / client interceptors'], { topics: topics.architecture }),
            node('architecture-infrastructure', 488, 136, 176, 120, 'Infrastructure', ['gateway / mesh', 'scheduler / registry', 'outside process'], {
                topics: topics.architecture,
            }),
            node('architecture-remote', 488, 296, 176, 104, 'Remote RPC', ['resolver transport', 'crosses process'], { topics: topics.architecture }),
            node('architecture-backends', 488, 440, 176, 120, ['Broker /', 'OTLP backend'], ['explicit integration', 'outside process'], { topics: topics.architecture }),
        ].join('\n'),
    },
    {
        key: 'in-process',
        route: '/en/guide/production/in-process-transport',
        type: 'architecture',
        width: 688,
        height: 600,
        title: 'Local calls retain the application boundary',
        desc: 'Local client APIs exchange copied protobuf messages through shared admission and server middleware for all four RPC kinds, with cooperative cancellation and explicit transport, security and telemetry limits.',
        caption:
            'Local and HTTP clients can coexist. server.client() selects a local service or configured remoteResolver; local tests do not establish wire, TLS or proxy guarantees. The documented 1.3 stop-abort and parked-yield fixes are not yet published.',
        body: [
            zone(24, 24, 640, 320, 'One Server / monolith, BFF or tests'),
            edge(
                [
                    [180, 184],
                    [180, 208],
                ],
                { from: 'inprocess-api', to: 'inprocess-codec' },
            ),
            edge(
                [
                    [312, 268],
                    [368, 268],
                ],
                { from: 'inprocess-codec', to: 'inprocess-rpc' },
            ),
            edge(
                [
                    [504, 184],
                    [504, 208],
                ],
                { from: 'inprocess-http', to: 'inprocess-rpc' },
            ),
            node('inprocess-api', 48, 80, 264, 104, 'Choose the client API', ['server.client(): local / remote', 'localClient(): local only', 'hasService(): typeName lookup'], {
                topics: topics.inProcess,
            }),
            node('inprocess-http', 368, 80, 272, 104, 'HTTP coexistence', ['server.start() binds a listener', 'local works before start()', 'check TLS / framing / proxies'], {
                topics: topics.inProcess,
            }),
            node(
                'inprocess-codec',
                48,
                208,
                264,
                120,
                'In-memory boundary',
                ['createLocalTransport()', 'Protobuf copies · cloned headers', 'No sockets / TLS', 'Best-effort back-pressure'],
                { focal: true, topics: topics.inProcess },
            ),
            node(
                'inprocess-rpc',
                368,
                208,
                272,
                120,
                'Shared RPC boundary',
                ['requestGate + readMaxBytes', 'configured server interceptors', 'validation / authz / errors', 'URL + marker never grant access'],
                { focal: true, topics: topics.inProcess },
            ),
            node(
                'inprocess-kinds',
                24,
                368,
                640,
                80,
                'Four RPC kinds',
                ['unary · server-stream · client-stream · bidirectional', 'All preserve order; break does not cancel a stream'],
                { topics: topics.inProcess },
            ),
            node(
                'inprocess-cancel',
                24,
                472,
                280,
                104,
                'Cooperative cancellation',
                ['handler observes AbortSignal', 'stop neither waits nor kills work', '1.3 abort / yield: unpublished'],
                { shape: 'state', topics: topics.inProcess },
            ),
            node(
                'inprocess-tests',
                336,
                472,
                328,
                104,
                'Testing and observability',
                ['transportParityTest + in-memory OTel', 'span parents differ; sizes not wire bytes', 'test HTTP / TLS / proxies separately'],
                { shape: 'document', topics: topics.inProcess },
            ),
        ].join('\n'),
    },
];
