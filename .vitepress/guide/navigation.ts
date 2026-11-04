import type { DefaultTheme } from 'vitepress';

export interface GuideSection {
    id: string;
    text: string;
    link: string;
    items: DefaultTheme.SidebarItem[];
}

export const guideSections: GuideSection[] = [
    {
        id: 'get-started',
        text: 'Get started',
        link: '/en/guide/about',
        items: [
            { text: 'Build your first service', link: '/en/guide/quickstart', collapsed: true, items: [{ text: 'Step-by-step tutorial', link: '/en/guide/quickstart-manual' }] },
            { text: 'Scaffold a service', link: '/en/guide/scaffolding' },
            { text: 'Service builder', link: '/en/builder' },
        ],
    },
    {
        id: 'build-a-service',
        text: 'Build a service',
        link: '/en/guide/build-a-service',
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
            { text: 'Scaffold structure and CLI', link: '/en/guide/scaffolding-commands' },
            {
                text: 'Interceptors',
                link: '/en/guide/interceptors',
                collapsed: true,
                items: [
                    { text: 'Usage and chain composition', link: '/en/guide/interceptors/built-in' },
                    { text: 'Error handling', link: '/en/guide/interceptors/error-handling' },
                    { text: 'Timeout', link: '/en/guide/interceptors/timeout' },
                    { text: 'Bulkhead', link: '/en/guide/interceptors/bulkhead' },
                    { text: 'Circuit breaker', link: '/en/guide/interceptors/circuit-breaker' },
                    { text: 'Retry', link: '/en/guide/interceptors/retry' },
                    { text: 'Fallback', link: '/en/guide/interceptors/fallback' },
                    { text: 'Validation', link: '/en/guide/validation', collapsed: true, items: [{ text: 'Setup, constraints and errors', link: '/en/guide/validation-setup' }] },
                    { text: 'Serialization', link: '/en/guide/interceptors/serialization' },
                    { text: 'Request logging', link: '/en/guide/interceptors/logging' },
                    { text: 'Custom interceptors', link: '/en/guide/interceptors/custom' },
                    { text: 'Method filtering', link: '/en/guide/interceptors/method-filtering' },
                ],
            },
            { text: 'OpenAPI', link: '/en/guide/openapi', collapsed: true, items: [{ text: 'Generation and authz overlay', link: '/en/guide/openapi-generation' }] },
        ],
    },
    {
        id: 'communication',
        text: 'Communication',
        link: '/en/guide/communication',
        items: [
            {
                text: 'Choose a mechanism',
                link: '/en/guide/service-communication/choosing-a-mechanism',
                collapsed: true,
                items: [{ text: 'Examples and failure trade-offs', link: '/en/guide/service-communication/mechanisms' }],
            },
            {
                text: 'Service calls',
                link: '/en/guide/service-communication',
                collapsed: true,
                items: [
                    { text: 'Communication patterns', link: '/en/guide/service-communication/patterns' },
                    {
                        text: 'Service catalog',
                        link: '/en/guide/service-communication/service-catalog',
                        collapsed: true,
                        items: [{ text: 'Configuration and behavior', link: '/en/guide/service-communication/catalog-configuration' }],
                    },
                    {
                        text: 'Remote resolvers',
                        link: '/en/guide/service-communication/resolvers',
                        collapsed: true,
                        items: [
                            { text: 'Run the routing example', link: '/en/guide/service-communication/routing-example' },
                            { text: 'Configuration, cache and mocks', link: '/en/guide/service-communication/resolver-configuration' },
                        ],
                    },
                    { text: 'Client interceptors', link: '/en/guide/service-communication/client-interceptors' },
                ],
            },
            {
                text: 'In-process transport',
                link: '/en/guide/production/in-process-transport',
                collapsed: true,
                items: [{ text: 'API, guarantees and limitations', link: '/en/guide/production/in-process-transport-details' }],
            },
            {
                text: 'Transport matrix',
                link: '/en/guide/production/transport-matrix',
                collapsed: true,
                items: [{ text: 'Full matrix and measurements', link: '/en/guide/production/transport-matrix-details' }],
            },
            {
                text: 'Events',
                link: '/en/guide/events',
                collapsed: true,
                items: [
                    { text: 'Concepts and shutdown behavior', link: '/en/guide/events/concepts' },
                    { text: 'Publish and subscribe', link: '/en/guide/events/getting-started' },
                    { text: 'Choose an adapter', link: '/en/guide/events/adapters' },
                    { text: 'AMQP reliability', link: '/en/guide/events/amqp-reliability' },
                    { text: 'Custom topics', link: '/en/guide/events/custom-topics' },
                    { text: 'Middleware', link: '/en/guide/events/middleware' },
                    { text: 'Relay during shutdown', link: '/en/guide/events/relay-during-shutdown' },
                ],
            },
        ],
    },
    {
        id: 'testing',
        text: 'Testing',
        link: '/en/guide/testing',
        items: [
            { text: 'Unit tests and fixtures', link: '/en/guide/testing/unit' },
            { text: 'Integration tests', link: '/en/guide/testing/integration' },
            {
                text: 'End-to-end tests',
                link: '/en/guide/testing/e2e',
                collapsed: true,
                items: [
                    { text: 'runn', link: '/en/guide/testing/runn' },
                    { text: 'scenarigo', link: '/en/guide/testing/scenarigo' },
                ],
            },
        ],
    },
    {
        id: 'secure-services',
        text: 'Secure services',
        link: '/en/guide/secure-services',
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
                    { text: 'Request admission', link: '/en/guide/security/request-admission' },
                ],
            },
        ],
    },
    {
        id: 'observe-and-operate',
        text: 'Observe and operate',
        link: '/en/guide/observe-and-operate',
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
            {
                text: 'Server reflection',
                link: '/en/guide/protocols/reflection',
                collapsed: true,
                items: [{ text: 'Setup, client tools and exposure', link: '/en/guide/protocols/reflection-tools' }],
            },
        ],
    },
    {
        id: 'deploy',
        text: 'Deploy',
        link: '/en/guide/deploy',
        items: [
            {
                text: 'Docker',
                link: '/en/guide/production/docker',
                collapsed: true,
                items: [{ text: 'Image, probes and runtime recipe', link: '/en/guide/production/docker-configuration' }],
            },
            {
                text: 'Kubernetes',
                link: '/en/guide/production/kubernetes',
                collapsed: true,
                items: [{ text: 'Resources and deployment recipe', link: '/en/guide/production/kubernetes-configuration' }],
            },
            {
                text: 'Envoy Gateway',
                link: '/en/guide/production/envoy-gateway',
                collapsed: true,
                items: [{ text: 'Routes and transcoding setup', link: '/en/guide/production/envoy-gateway-setup' }],
            },
            {
                text: 'Service mesh',
                link: '/en/guide/production/service-mesh',
                collapsed: true,
                items: [{ text: 'Istio configuration and policy', link: '/en/guide/production/service-mesh-setup' }],
            },
        ],
    },
    {
        id: 'advanced',
        text: 'Advanced',
        link: '/en/guide/advanced',
        items: [
            { text: 'Architecture', link: '/en/guide/production/architecture' },
            { text: 'Guarantees and limits', link: '/en/guide/guarantees' },
            {
                text: 'Runtime compatibility',
                link: '/en/guide/runtime-compatibility',
                collapsed: true,
                items: [{ text: 'Requirements, coverage and limits', link: '/en/guide/runtime-compatibility-details' }],
            },
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
            {
                text: 'Custom protocols',
                link: '/en/guide/protocols/custom',
                collapsed: true,
                items: [{ text: 'Implement a protocol plugin', link: '/en/guide/protocols/custom-implementation' }],
            },
        ],
    },
];

export const guideSidebar: DefaultTheme.SidebarItem[] = guideSections.map(({ text, link, items }) => ({ text, link, items }));

function contains(items: DefaultTheme.SidebarItem[], path: string): boolean {
    return items.some((item) => item.link === path || (item.items && contains(item.items, path)));
}

export function sectionForRoute(route: string): GuideSection | undefined {
    const path = route.replace(/\.html$/, '').replace(/\/$/, '');
    return guideSections.find((section) => section.link === path || contains(section.items, path));
}
