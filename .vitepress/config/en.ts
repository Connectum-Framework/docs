    import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress';
    import typedocSidebar from '../../en/api/typedoc-sidebar.json';

const guideSidebar: DefaultTheme.SidebarItem[] = [
    {
        text: 'Getting Started',
        items: [
            { text: 'About Connectum', link: '/en/guide/about' },
            { text: 'Quickstart', link: '/en/guide/quickstart' },
        ],
    },
    {
        text: 'Server',
        link: '/en/guide/server',
        collapsed: false,
        items: [
            { text: 'Lifecycle & Events', link: '/en/guide/server/lifecycle' },
            { text: 'Configuration', link: '/en/guide/server/configuration' },
            { text: 'Graceful Shutdown', link: '/en/guide/server/graceful-shutdown' },
        ],
    },
    {
        text: 'Interceptors',
        link: '/en/guide/interceptors',
        collapsed: false,
        items: [
            { text: 'Built-in Chain', link: '/en/guide/interceptors/built-in' },
            { text: 'Custom Interceptors', link: '/en/guide/interceptors/custom' },
            { text: 'Method Filtering', link: '/en/guide/interceptors/method-filtering' },
        ],
    },
    {
        text: 'Service Communication',
        link: '/en/guide/service-communication',
        collapsed: true,
        items: [
            { text: 'Communication Patterns', link: '/en/guide/service-communication/patterns' },
            { text: 'Client Interceptors', link: '/en/guide/service-communication/client-interceptors' },
        ],
    },
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
            { text: 'Context & Testing', link: '/en/guide/auth/context' },
        ],
    },
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
        text: 'Security (TLS)',
        link: '/en/guide/security',
        collapsed: true,
        items: [
            { text: 'TLS Configuration', link: '/en/guide/security/tls' },
            { text: 'Mutual TLS (mTLS)', link: '/en/guide/security/mtls' },
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
    {
        text: 'Testing',
        link: '/en/guide/testing',
        collapsed: true,
        items: [
            { text: 'runn', link: '/en/guide/testing/runn' },
            { text: 'scenarigo', link: '/en/guide/testing/scenarigo' },
        ],
    },
    {
        text: 'Production',
        collapsed: true,
        items: [
            { text: 'Architecture Patterns', link: '/en/guide/production/architecture' },
            { text: 'Docker', link: '/en/guide/production/docker' },
            { text: 'Kubernetes', link: '/en/guide/production/kubernetes' },
            { text: 'Envoy Gateway', link: '/en/guide/production/envoy-gateway' },
            { text: 'Service Mesh (Istio)', link: '/en/guide/production/service-mesh' },
        ],
    },
    {
        text: 'Packages',
        items: [
            { text: '@connectum/core', link: '/en/packages/core' },
            { text: '@connectum/auth', link: '/en/packages/auth' },
            { text: '@connectum/interceptors', link: '/en/packages/interceptors' },
            { text: '@connectum/healthcheck', link: '/en/packages/healthcheck' },
            { text: '@connectum/reflection', link: '/en/packages/reflection' },
            { text: '@connectum/otel', link: '/en/packages/otel' },
            { text: '@connectum/cli', link: '/en/packages/cli' },
        ],
    },
];

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
    title: 'Connectum',
    description: 'Production-ready gRPC/ConnectRPC framework for Node.js',
    themeConfig: {
        nav: [
            { text: 'Guide', link: '/en/guide/about' },
            { text: 'API', link: '/en/api/', activeMatch: '/en/api/' },
            { text: 'Contributing', link: '/en/contributing/', activeMatch: '/en/contributing/' },
            { text: 'Examples', link: 'https://github.com/Connectum-Framework/examples' },
        ],
        sidebar: {
            '/en/guide/': guideSidebar,
            '/en/packages/': guideSidebar,
            '/en/migration/': [
                {
                    text: 'Migration',
                    items: [
                        { text: 'Changelog & Breaking Changes', link: '/en/migration/index' },
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
