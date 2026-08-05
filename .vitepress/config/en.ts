import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress';
import typedocSidebar from '../../en/api/typedoc-sidebar.json';

const guideSidebar: DefaultTheme.SidebarItem[] = [
    {
        text: 'Get started',
        items: [
            { text: 'What is Connectum?', link: '/en/guide/about' },
            { text: 'Build your first service', link: '/en/guide/quickstart' },
            { text: 'Scaffold a service', link: '/en/guide/scaffolding' },
        ],
    },
    {
        text: 'Build a service',
        items: [
            {
                text: 'Server',
                link: '/en/guide/server',
                collapsed: true,
                items: [
                    { text: 'Lifecycle and events', link: '/en/guide/server/lifecycle' },
                    { text: 'Configuration', link: '/en/guide/server/configuration' },
                    { text: 'Graceful shutdown', link: '/en/guide/server/graceful-shutdown' },
                ],
            },
            {
                text: 'Interceptors',
                link: '/en/guide/interceptors',
                collapsed: true,
                items: [
                    { text: 'Built-in chain', link: '/en/guide/interceptors/built-in' },
                    { text: 'Custom interceptors', link: '/en/guide/interceptors/custom' },
                    { text: 'Method filtering', link: '/en/guide/interceptors/method-filtering' },
                ],
            },
            { text: 'Validation', link: '/en/guide/validation' },
            { text: 'OpenAPI', link: '/en/guide/openapi' },
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
        text: 'Connect services',
        items: [
            { text: 'Choose a mechanism', link: '/en/guide/service-communication/choosing-a-mechanism' },
            {
                text: 'Service calls',
                link: '/en/guide/service-communication',
                collapsed: true,
                items: [
                    { text: 'Communication patterns', link: '/en/guide/service-communication/patterns' },
                    { text: 'Service catalog', link: '/en/guide/service-communication/service-catalog' },
                    { text: 'Remote resolvers', link: '/en/guide/service-communication/resolvers' },
                    { text: 'Client interceptors', link: '/en/guide/service-communication/client-interceptors' },
                ],
            },
            {
                text: 'Events',
                link: '/en/guide/events',
                collapsed: true,
                items: [
                    { text: 'Publish and subscribe', link: '/en/guide/events/getting-started' },
                    { text: 'Choose an adapter', link: '/en/guide/events/adapters' },
                    { text: 'Custom topics', link: '/en/guide/events/custom-topics' },
                    { text: 'Middleware', link: '/en/guide/events/middleware' },
                ],
            },
        ],
    },
    {
        text: 'Secure services',
        items: [
            {
                text: 'Authentication and authorization',
                link: '/en/guide/auth',
                collapsed: true,
                items: [
                    { text: 'JWT authentication', link: '/en/guide/auth/jwt' },
                    { text: 'Gateway authentication', link: '/en/guide/auth/gateway' },
                    { text: 'Session authentication', link: '/en/guide/auth/session' },
                    { text: 'Authorization', link: '/en/guide/auth/authorization' },
                    { text: 'Proto-based authorization', link: '/en/guide/auth/proto-authz' },
                    { text: 'Client credentials', link: '/en/guide/auth/client-interceptors' },
                    { text: 'Auth context and testing', link: '/en/guide/auth/context' },
                ],
            },
            {
                text: 'Transport security',
                link: '/en/guide/security',
                collapsed: true,
                items: [
                    { text: 'TLS', link: '/en/guide/security/tls' },
                    { text: 'Mutual TLS', link: '/en/guide/security/mtls' },
                ],
            },
        ],
    },
    {
        text: 'Observe and operate',
        items: [
            {
                text: 'Observability',
                link: '/en/guide/observability',
                collapsed: true,
                items: [
                    { text: 'Tracing', link: '/en/guide/observability/tracing' },
                    { text: 'Metrics', link: '/en/guide/observability/metrics' },
                    { text: 'Logging', link: '/en/guide/observability/logging' },
                    { text: 'Backends and configuration', link: '/en/guide/observability/backends' },
                ],
            },
            {
                text: 'Health and readiness',
                link: '/en/guide/health-checks',
                collapsed: true,
                items: [
                    { text: 'gRPC and HTTP protocol', link: '/en/guide/health-checks/protocol' },
                    { text: 'Kubernetes integration', link: '/en/guide/health-checks/kubernetes' },
                ],
            },
            { text: 'Server reflection', link: '/en/guide/protocols/reflection' },
        ],
    },
    {
        text: 'Deploy',
        items: [
            { text: 'Docker', link: '/en/guide/production/docker' },
            { text: 'Kubernetes', link: '/en/guide/production/kubernetes' },
            { text: 'Envoy Gateway', link: '/en/guide/production/envoy-gateway' },
            { text: 'Service mesh', link: '/en/guide/production/service-mesh' },
        ],
    },
    {
        text: 'Advanced',
        collapsed: true,
        items: [
            { text: 'Architecture', link: '/en/guide/production/architecture' },
            { text: 'Runtime compatibility', link: '/en/guide/runtime-compatibility' },
            {
                text: 'TypeScript execution',
                link: '/en/guide/typescript',
                collapsed: true,
                items: [
                    { text: 'Runtime support', link: '/en/guide/typescript/runtime-support' },
                    { text: 'Erasable syntax', link: '/en/guide/typescript/erasable-syntax' },
                    { text: 'Proto enums', link: '/en/guide/typescript/proto-enums' },
                    { text: 'Patterns and workflow', link: '/en/guide/typescript/patterns' },
                ],
            },
            { text: 'In-process transport', link: '/en/guide/production/in-process-transport' },
            { text: 'Transport matrix', link: '/en/guide/production/transport-matrix' },
            { text: 'Custom protocols', link: '/en/guide/protocols/custom' },
        ],
    },
];

const packagesSidebar: DefaultTheme.SidebarItem[] = [
    { text: 'Package overview', link: '/en/packages/' },
    {
        text: 'Foundation',
        items: [
            { text: '@connectum/core', link: '/en/packages/core' },
            { text: '@connectum/interceptors', link: '/en/packages/interceptors' },
        ],
    },
    {
        text: 'Security',
        items: [{ text: '@connectum/auth', link: '/en/packages/auth' }],
    },
    {
        text: 'Communication',
        items: [
            { text: '@connectum/events', link: '/en/packages/events' },
            { text: '@connectum/events-nats', link: '/en/packages/events-nats' },
            { text: '@connectum/events-kafka', link: '/en/packages/events-kafka' },
            { text: '@connectum/events-redis', link: '/en/packages/events-redis' },
            { text: '@connectum/events-amqp', link: '/en/packages/events-amqp' },
        ],
    },
    {
        text: 'Operations',
        items: [
            { text: '@connectum/otel', link: '/en/packages/otel' },
            { text: '@connectum/healthcheck', link: '/en/packages/healthcheck' },
            { text: '@connectum/reflection', link: '/en/packages/reflection' },
        ],
    },
    {
        text: 'Tooling and testing',
        items: [
            { text: '@connectum/cli', link: '/en/packages/cli' },
            { text: '@connectum/protoc-gen-catalog', link: '/en/packages/protoc-gen-catalog' },
            { text: '@connectum/testing', link: '/en/packages/testing' },
            { text: '@connectum/test-fixtures', link: '/en/packages/test-fixtures' },
        ],
    },
];

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
    title: 'Connectum',
    description: 'Production-ready gRPC/ConnectRPC framework for Node.js',
    themeConfig: {
        nav: [
            { text: 'Get started', link: '/en/guide/quickstart' },
            { text: 'Guides', link: '/en/guide/about', activeMatch: '/en/guide/' },
            { text: 'Packages', link: '/en/packages/', activeMatch: '/en/packages/' },
            { text: 'API', link: '/en/reference/', activeMatch: '/en/(reference|api)/' },
            {
                text: 'Resources',
                items: [
                    { text: 'Runtime compatibility', link: '/en/guide/runtime-compatibility' },
                    { text: 'Migration', link: '/en/migration/' },
                    { text: 'Examples', link: 'https://github.com/Connectum-Framework/examples' },
                    { text: 'Contributing', link: '/en/contributing/' },
                ],
            },
            { text: 'GitHub', link: 'https://github.com/Connectum-Framework/connectum' },
        ],
        sidebar: {
            '/en/guide/': guideSidebar,
            '/en/packages/': packagesSidebar,
            '/en/reference/': [
                {
                    text: 'API and reference',
                    items: [
                        { text: 'Find a reference', link: '/en/reference/' },
                        { text: 'Generated API', link: '/en/api/' },
                        { text: 'Runtime compatibility', link: '/en/guide/runtime-compatibility' },
                        { text: 'Migration', link: '/en/migration/' },
                    ],
                },
            ],
            '/en/migration/': [
                {
                    text: 'Migration',
                    items: [
                        { text: 'Upgrade overview', link: '/en/migration/' },
                        { text: 'Migrating to 1.0', link: '/en/migration/1.0' },
                        { text: 'Service catalog', link: '/en/migration/service-catalog' },
                    ],
                },
            ],
            '/en/api/': typedocSidebar as DefaultTheme.SidebarItem[],
            '/en/contributing/': [
                {
                    text: 'Contributing',
                    items: [
                        { text: 'Overview', link: '/en/contributing/' },
                        { text: 'Development setup', link: '/en/contributing/development-setup' },
                        { text: 'CLI commands', link: '/en/contributing/cli-commands' },
                        { text: 'Documentation style', link: '/en/contributing/documentation-style' },
                        { text: 'Parity invariant', link: '/en/contributing/parity-invariant' },
                        { text: 'Parity coverage', link: '/en/contributing/parity-coverage' },
                    ],
                },
                {
                    text: 'Architecture decisions',
                    items: [{ text: 'ADR index', link: '/en/contributing/adr/' }],
                },
            ],
        },
        editLink: {
            pattern: 'https://github.com/Connectum-Framework/docs/edit/main/:path',
            text: 'Edit this page on GitHub',
        },
    },
};
