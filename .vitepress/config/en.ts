    import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress';
    import typedocSidebar from '../../en/api/typedoc-sidebar.json';

const guideSidebar: DefaultTheme.SidebarItem[] = [
    {
        text: 'Introduction',
        items: [
            { text: 'About Connectum', link: '/en/guide/about' },
            { text: 'Quickstart', link: '/en/guide/quickstart' },
            { text: 'Architecture Overview', link: '/en/guide/production/architecture' },
            { text: 'Runtime Compatibility', link: '/en/guide/runtime-compatibility' },
        ],
    },
    {
        text: 'Build a Service',
        items: [
            {
                text: 'Server',
                link: '/en/guide/server',
                collapsed: true,
                items: [
                    { text: 'Lifecycle & Events', link: '/en/guide/server/lifecycle' },
                    { text: 'Configuration', link: '/en/guide/server/configuration' },
                    { text: 'Graceful Shutdown', link: '/en/guide/server/graceful-shutdown' },
                ],
            },
            {
                text: 'Interceptors',
                link: '/en/guide/interceptors',
                collapsed: true,
                items: [
                    { text: 'Built-in Chain', link: '/en/guide/interceptors/built-in' },
                    { text: 'Custom Interceptors', link: '/en/guide/interceptors/custom' },
                    { text: 'Method Filtering', link: '/en/guide/interceptors/method-filtering' },
                ],
            },
            { text: 'Validation', link: '/en/guide/validation' },
            {
                text: 'TypeScript',
                link: '/en/guide/typescript',
                collapsed: true,
                items: [
                    { text: 'Runtime Support', link: '/en/guide/typescript/runtime-support' },
                    { text: 'Erasable Syntax', link: '/en/guide/typescript/erasable-syntax' },
                    { text: 'Proto Generation', link: '/en/guide/typescript/proto-enums' },
                    { text: 'Patterns', link: '/en/guide/typescript/patterns' },
                ],
            },
        ],
    },
    {
        text: 'Connect Services',
        items: [
            {
                text: 'Service Communication',
                link: '/en/guide/service-communication',
                collapsed: true,
                items: [
                    { text: 'Communication Patterns', link: '/en/guide/service-communication/patterns' },
                    { text: 'Service Catalog', link: '/en/guide/service-communication/service-catalog' },
                    { text: 'Remote Resolvers', link: '/en/guide/service-communication/resolvers' },
                    { text: 'Client Interceptors', link: '/en/guide/service-communication/client-interceptors' },
                    { text: 'In-Process Transport', link: '/en/guide/production/in-process-transport' },
                    { text: 'Transport Matrix', link: '/en/guide/production/transport-matrix' },
                ],
            },
            {
                text: 'Events',
                link: '/en/guide/events',
                collapsed: true,
                items: [
                    { text: 'Getting Started', link: '/en/guide/events/getting-started' },
                    { text: 'Custom Topics', link: '/en/guide/events/custom-topics' },
                    { text: 'Middleware', link: '/en/guide/events/middleware' },
                    { text: 'Adapters', link: '/en/guide/events/adapters' },
                ],
            },
        ],
    },
    {
        text: 'Secure',
        items: [
            {
                text: 'Auth & Authz',
                link: '/en/guide/auth',
                collapsed: true,
                items: [
                    { text: 'JWT', link: '/en/guide/auth/jwt' },
                    { text: 'Gateway', link: '/en/guide/auth/gateway' },
                    { text: 'Session', link: '/en/guide/auth/session' },
                    { text: 'Authorization (RBAC)', link: '/en/guide/auth/authorization' },
                    { text: 'Proto-Based Authz', link: '/en/guide/auth/proto-authz' },
                    { text: 'Client Interceptors', link: '/en/guide/auth/client-interceptors' },
                    { text: 'Context & Testing', link: '/en/guide/auth/context' },
                ],
            },
            {
                text: 'TLS & mTLS',
                link: '/en/guide/security',
                collapsed: true,
                items: [
                    { text: 'TLS Configuration', link: '/en/guide/security/tls' },
                    { text: 'Mutual TLS (mTLS)', link: '/en/guide/security/mtls' },
                ],
            },
        ],
    },
    {
        text: 'Operate',
        items: [
            {
                text: 'Observability',
                link: '/en/guide/observability',
                collapsed: true,
                items: [
                    { text: 'Distributed Tracing', link: '/en/guide/observability/tracing' },
                    { text: 'Metrics', link: '/en/guide/observability/metrics' },
                    { text: 'Logging', link: '/en/guide/observability/logging' },
                    { text: 'Backends & Config', link: '/en/guide/observability/backends' },
                ],
            },
            {
                text: 'Health Checks',
                link: '/en/guide/health-checks',
                collapsed: true,
                items: [
                    { text: 'gRPC & HTTP Protocol', link: '/en/guide/health-checks/protocol' },
                    { text: 'Kubernetes Integration', link: '/en/guide/health-checks/kubernetes' },
                ],
            },
            {
                text: 'Protocols',
                link: '/en/guide/protocols',
                collapsed: true,
                items: [
                    { text: 'Server Reflection', link: '/en/guide/protocols/reflection' },
                    { text: 'Custom Protocols', link: '/en/guide/protocols/custom' },
                ],
            },
            {
                text: 'Testing',
                link: '/en/guide/testing',
                collapsed: true,
                items: [
                    { text: 'runn', link: '/en/guide/testing/runn' },
                    { text: 'scenarigo', link: '/en/guide/testing/scenarigo' },
                ],
            },
        ],
    },
    {
        text: 'Deploy',
        items: [
            { text: 'Docker', link: '/en/guide/production/docker' },
            { text: 'Kubernetes', link: '/en/guide/production/kubernetes' },
            { text: 'Envoy Gateway', link: '/en/guide/production/envoy-gateway' },
            { text: 'Service Mesh (Istio)', link: '/en/guide/production/service-mesh' },
        ],
    },
];

const packagesSidebar: DefaultTheme.SidebarItem[] = [
    {
        text: 'Layer 0 — Foundation',
        items: [
            { text: '@connectum/core', link: '/en/packages/core' },
        ],
    },
    {
        text: 'Layer 1 — Capabilities',
        items: [
            { text: '@connectum/auth', link: '/en/packages/auth' },
            { text: '@connectum/interceptors', link: '/en/packages/interceptors' },
            { text: '@connectum/healthcheck', link: '/en/packages/healthcheck' },
            { text: '@connectum/reflection', link: '/en/packages/reflection' },
            { text: '@connectum/events', link: '/en/packages/events' },
        ],
    },
    {
        text: 'Layer 2 — Tooling & Adapters',
        items: [
            { text: '@connectum/otel', link: '/en/packages/otel' },
            { text: '@connectum/cli', link: '/en/packages/cli' },
            { text: '@connectum/protoc-gen-catalog', link: '/en/packages/protoc-gen-catalog' },
            { text: '@connectum/testing', link: '/en/packages/testing' },
            { text: '@connectum/test-fixtures', link: '/en/packages/test-fixtures' },
            { text: '@connectum/events-nats', link: '/en/packages/events-nats' },
            { text: '@connectum/events-kafka', link: '/en/packages/events-kafka' },
            { text: '@connectum/events-redis', link: '/en/packages/events-redis' },
            { text: '@connectum/events-amqp', link: '/en/packages/events-amqp' },
        ],
    },
];

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
    title: 'Connectum',
    description: 'Production-ready gRPC/ConnectRPC framework for Node.js',
    themeConfig: {
        nav: [
            { text: 'Guide', link: '/en/guide/about' },
            { text: 'Packages', link: '/en/packages/core', activeMatch: '/en/packages/' },
            { text: 'API', link: '/en/api/', activeMatch: '/en/api/' },
            {
                text: 'Resources',
                items: [
                    { text: 'Migration & Changelog', link: '/en/migration/index' },
                    { text: 'Contributing', link: '/en/contributing/', activeMatch: '/en/contributing/' },
                    { text: 'Examples', link: 'https://github.com/Connectum-Framework/examples' },
                ],
            },
        ],
        sidebar: {
            '/en/guide/': guideSidebar,
            '/en/packages/': packagesSidebar,
            '/en/migration/': [
                {
                    text: 'Migration',
                    items: [
                        { text: 'Changelog & Breaking Changes', link: '/en/migration/index' },
                        { text: 'Service Catalog', link: '/en/migration/service-catalog' },
                    ],
                },
            ],
            '/en/api/': typedocSidebar as DefaultTheme.SidebarItem[],
            '/en/contributing/': [
                {
                    text: 'Contributing',
                    items: [
                        { text: 'Getting Started', link: '/en/contributing/' },
                        { text: 'Development Setup', link: '/en/contributing/development-setup' },
                        { text: 'CLI Commands', link: '/en/contributing/cli-commands' },
                        { text: 'Documentation Style Guide', link: '/en/contributing/documentation-style' },
                        { text: 'Parity Invariant', link: '/en/contributing/parity-invariant' },
                        { text: 'Parity Coverage', link: '/en/contributing/parity-coverage' },
                    ],
                },
                {
                    text: 'ADR',
                    collapsed: true,
                    items: [
                        { text: 'Index', link: '/en/contributing/adr/index' },
                        { text: 'ADR-001: Native TypeScript', link: '/en/contributing/adr/001-native-typescript-migration' },
                        { text: 'ADR-003: Package Decomposition', link: '/en/contributing/adr/003-package-decomposition' },
                        { text: 'ADR-005: Input Validation', link: '/en/contributing/adr/005-input-validation-strategy' },
                        { text: 'ADR-006: Resilience Patterns', link: '/en/contributing/adr/006-resilience-pattern-implementation' },
                        { text: 'ADR-007: Testing Strategy', link: '/en/contributing/adr/007-testing-strategy' },
                        { text: 'ADR-008: Performance Benchmarking', link: '/en/contributing/adr/008-performance-benchmarking' },
                        { text: 'ADR-009: Buf CLI Migration', link: '/en/contributing/adr/009-buf-cli-migration' },
                        { text: 'ADR-014: Method Filter Interceptor', link: '/en/contributing/adr/014-method-filter-interceptor' },
                        { text: 'ADR-020: Reflection Proto Sync', link: '/en/contributing/adr/020-reflection-proto-sync' },
                        { text: 'ADR-022: Protocol Extraction', link: '/en/contributing/adr/022-protocol-extraction' },
                        { text: 'ADR-023: Uniform Registration API', link: '/en/contributing/adr/023-uniform-registration-api' },
                        { text: 'ADR-024: Auth & Authz Strategy', link: '/en/contributing/adr/024-auth-authz-strategy' },
                        { text: 'ADR-025: Package Versioning Strategy', link: '/en/contributing/adr/025-package-versioning-strategy' },
                        { text: 'ADR-026: EventBus Architecture', link: '/en/contributing/adr/026-eventbus-architecture' },
                        { text: 'ADR-027: External Contracts vs EventBus', link: '/en/contributing/adr/027-external-contracts-vs-eventbus' },
                        { text: 'ADR-028: Service Catalog', link: '/en/contributing/adr/028-service-catalog' },
                    ],
                },
            ],
        },
        editLink: {
            pattern: 'https://github.com/Connectum-Framework/docs/edit/main/:path',
            text: 'Edit this page on GitHub',
        },
    },
};
