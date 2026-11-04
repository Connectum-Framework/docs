import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress';
import typedocSidebar from '../../en/api/typedoc-sidebar.json' with { type: 'json' };
import { guideSections, guideSidebar } from '../guide/navigation.ts';

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
    title: 'Connectum',
    description: 'gRPC and ConnectRPC framework for TypeScript',
    themeConfig: {
        nav: [
            { text: 'Get started', link: '/en/guide/about', activeMatch: '/en/guide/(about|quickstart|scaffolding)$' },
            { text: 'Guides', items: guideSections.filter(({ id }) => id !== 'get-started').map(({ text, link }) => ({ text, link })) },
            { text: 'API', link: '/en/api/', activeMatch: '/en/api/' },
            { text: 'Builder', link: '/en/builder' },
        ],
        sidebar: {
            '/en/guide/': guideSidebar,
            '/en/migration/': [
                {
                    text: 'Migration',
                    items: [
                        { text: 'Upgrade overview', link: '/en/migration/' },
                        { text: 'Migrating to 1.0', link: '/en/migration/1.0' },
                        { text: 'Service catalog', link: '/en/migration/service-catalog' },
                        { text: 'Custom protocols: setup/register', link: '/en/migration/protocol-setup' },
                        { text: 'Peer dependencies: protobuf and Connect', link: '/en/migration/peer-dependencies' },
                        { text: 'Erasable proto enums', link: '/en/migration/erasable-enums' },
                        { text: 'Signed tokens must carry exp', link: '/en/migration/token-expiration' },
                        { text: 'RPC telemetry attribute names', link: '/en/migration/otel-rpc-attributes' },
                        { text: 'OpenTelemetry configuration', link: '/en/migration/otel-configuration' },
                        { text: 'Kafka adapter options', link: '/en/migration/kafka-adapter-options' },
                        { text: 'Kafka adapter validation', link: '/en/migration/kafka-option-validation' },
                        { text: 'NATS adapter options', link: '/en/migration/events-nats-options' },
                        { text: 'Testing helper changes', link: '/en/migration/testing-helpers' },
                        { text: 'In-process calls on shutdown', link: '/en/migration/in-process-shutdown' },
                        { text: 'Streams cut by stop()', link: '/en/migration/shutdown-stream-cut' },
                        { text: 'Service catalog checks', link: '/en/migration/catalog-checks' },
                        { text: 'Shutdown behavior changes', link: '/en/migration/shutdown-behavior' },
                        { text: 'Event bus reception on shutdown', link: '/en/migration/events-reception-on-shutdown' },
                        { text: 'Event bus option checks', link: '/en/migration/events-option-checks' },
                        { text: 'Logger bodies are opt-in', link: '/en/migration/logger-bodies' },
                        { text: 'Error handler and client messages', link: '/en/migration/error-handler-messages' },
                        { text: 'Option descriptors from the packages', link: '/en/migration/option-descriptor-imports' },
                        { text: 'events-amqp 1.3 behavior changes', link: '/en/migration/events-amqp-1.3' },
                        { text: 'Redis adapter options', link: '/en/migration/redis-adapter-options' },
                        { text: 'events-amqp option validation', link: '/en/migration/events-amqp-options' },
                        { text: 'Auth identity handling', link: '/en/migration/auth-identity' },
                        { text: 'Auth authorization and JWT validation', link: '/en/migration/auth-authorization-validation' },
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
                        { text: 'Pull requests', link: '/en/contributing/pull-requests' },
                        { text: 'Commit messages', link: '/en/contributing/commit-messages' },
                        { text: 'Code style', link: '/en/contributing/code-style' },
                        { text: 'Testing the framework', link: '/en/contributing/testing' },
                        { text: 'Documentation style', link: '/en/contributing/documentation-style' },
                        { text: 'Parity invariant', link: '/en/contributing/parity-invariant' },
                        { text: 'Parity coverage', link: '/en/contributing/parity-coverage' },
                    ],
                },
                { text: 'Architecture decisions', items: [{ text: 'ADR index', link: '/en/contributing/adr/' }] },
            ],
        },
        editLink: {
            pattern: 'https://github.com/Connectum-Framework/docs/edit/main/:path',
            text: 'Edit this page on GitHub',
        },
    },
};
