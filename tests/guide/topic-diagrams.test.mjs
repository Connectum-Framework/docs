import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { diagrams } from '../../scripts/guide-diagrams/models.mjs';
import { syncOverview } from '../../scripts/guide-diagrams/pages.mjs';
import { escapeHtml } from '../../scripts/guide-diagrams/primitives.mjs';
import { renderHtml } from '../../scripts/guide-diagrams/render.mjs';
import { checkGeometry, geometry } from './diagram-geometry.mjs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const config = read('.vitepress/config/en.ts');
const declaration = config.slice(config.indexOf('const guideSidebar:'), config.indexOf('const packagesSidebar:'));
const groups = JSON.parse(JSON.stringify(runInNewContext(`${declaration.replace(': DefaultTheme.SidebarItem[]', '')}\nguideSidebar;`, {}, { timeout: 1000 })));
const roots = groups.flatMap((group) => group.items.filter((item) => item.link && item.items));
const descendants = (item) => (item.items ?? []).flatMap((child) => [child.link, ...descendants(child)]).filter(Boolean);

test('every root section visibly covers its sidebar subsections', () => {
    assert.equal(roots.length, 25);
    assert.equal(diagrams.length, roots.length);
    assert.equal(new Set(diagrams.map((diagram) => diagram.key)).size, diagrams.length);
    assert.deepEqual(diagrams.map((diagram) => diagram.route).sort(), roots.map((root) => root.link).sort());
    for (const diagram of diagrams) {
        const expected = descendants(roots.find((root) => root.link === diagram.route)).sort();
        const { nodes } = geometry(diagram.body);
        const covered = [...new Set(nodes.flatMap((node) => node.topics))].sort();
        assert.deepEqual(covered, expected, `${diagram.key}: subsection coverage differs from navigation`);
        for (const node of nodes.filter((node) => node.topics.length)) {
            assert.match(node.markup, /<text[^>]*>[^<]+<\/text>/, `${diagram.key}/${node.id}: metadata without a visible topic`);
            for (const route of node.topics) assert.ok(read(`${route.slice(1)}.md`).length > 100, route);
        }
    }
});

test('self-contained accessible HTML and SSR embeds are reproducible', () => {
    for (const diagram of diagrams) {
        const html = read(`.vitepress/theme/assets/diagrams/guide/${diagram.key}.html`);
        assert.equal(html, renderHtml(diagram), `${diagram.key}: stale artwork`);
        assert.ok(html.includes(`<h1>${escapeHtml(diagram.title)}</h1>`), `${diagram.key}: standalone heading differs from the title`);
        const page = read(`${diagram.route.slice(1)}.md`);
        assert.equal(page, syncOverview(page, diagram), `${diagram.key}: stale embed or caption`);
        assert.match(page, /<GuideOverview :source="overview" \/>/);
        assert.doesNotMatch(page, /```mermaid|guide-map|GuideFlow/);
        assert.match(html, /<svg[^>]*role="img"[^>]*aria-labelledby="([a-z-]+)-title \1-desc"[^>]*>\s*<title/);
        assert.match(html, /<desc[^>]*>[^<]+<\/desc>/);
        assert.doesNotMatch(html, /<(?:script|link|img|iframe)\b|@import|href="https?:\/\/|box-shadow|GUIDE_SLUG/);
        assert.match(html, new RegExp(`min-width: ${diagram.width}px`));
        assert.match(html, /@media print/);
        assert.ok(diagram.title.length <= 60, diagram.key);
        const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
        assert.equal(new Set(ids).size, ids.length, `${diagram.key}: duplicate accessible IDs`);
    }
    const component = read('.vitepress/theme/components/GuideOverview.vue');
    assert.match(component, /props\.source/);
    assert.match(component, /v-html="artwork\.svg"/);
    assert.doesNotMatch(component, /onMounted|ClientOnly|fetch\(/);
});

test('auth maps credentials, each verifier, both policies and context testing', () => {
    const auth = diagrams.find((diagram) => diagram.key === 'auth');
    for (const concept of [
        'Client credentials',
        'JWT',
        'Gateway',
        'Session',
        'Auth context and testing',
        'Code authorization',
        'Proto-based authorization',
        'propagation',
        'Mock context',
    ])
        assert.ok(auth.body.includes(concept), concept);
    const { edges } = geometry(auth.body);
    for (const strategy of ['jwt', 'gateway', 'session']) {
        assert.ok(edges.some((edge) => edge.from === 'client' && edge.to === strategy));
        assert.ok(edges.some((edge) => edge.from === strategy && edge.to === 'context'));
    }
    for (const policy of ['code', 'proto']) assert.ok(edges.some((edge) => edge.from === 'context' && edge.to === policy));
});

test('every composition stays within the editorial geometry budget', () => {
    for (const diagram of diagrams) checkGeometry(diagram);
    assert.ok(new Set(diagrams.map((diagram) => diagram.type)).size >= 5, 'Subject-specific visual types must not collapse into one template');
});

test('section maps retain the broader setup, operation and failure topics', () => {
    const concepts = {
        auth: ['JWT', 'Gateway', 'Session', 'propagation', 'testing', 'Code authorization', 'Proto-based'],
        server: ['Configuration', 'created', 'running', 'stopping', 'Connection drain', 'Shutdown hooks'],
        interceptors: ['Built-in chain', 'Custom wrappers', 'Method filtering', 'service replacement', 'result'],
        security: ['TLS', 'mTLS', 'Request gate', 'Message-size', 'Raw HTTP'],
        runtime: ['Compiled JS', 'Native .ts', 'Bun', 'Coverage', 'CLI', 'telemetry'],
        typescript: ['Erasable syntax', 'Proto enums', 'Execute', 'Check and develop', 'declarations'],
        transport: ['HTTP/1.1', 'h2c', 'TLS', 'ALPN', 'Every proxy leg', 'Recorded coverage'],
        quickstart: ['Prepare the project', 'contract', 'Types', 'SayHello', 'real call', 'INVALID_ARGUMENT'],
        scaffolding: ['init', 'generate', 'service', 'proto sync', 'Register', 'Pinned base'],
        validation: ['Install', 'Proto constraints', 'Regenerate', 'interceptor', 'INVALID_ARGUMENT', 'Business validation'],
        openapi: ['Proto contracts', 'Base spec', 'descriptors', 'overlay', 'Runtime', 'artifact'],
        testing: ['runn', 'scenarigo', 'Network', 'Router', 'Handler checks', 'JUnit'],
        reflection: ['snapshot', 'reflection index', 'Client tools', 'Exposure', 'NOT_FOUND'],
        'custom-protocols': ['ProtocolContext', 'setup', 'register', 'HTTP request', 'Matched RPC', 'fallback'],
        'service-calls': ['Generated service catalog', 'Call patterns', 'Outgoing client policy', 'Local transport', 'Remote resolver', 'Runnable routing'],
        mechanisms: ['Service call', 'Streaming', 'Event publication', 'Temporal workflow', 'Compensations'],
        events: ['Publish event', 'Resolve topic', 'Event adapter', 'Subscription', 'Consume middleware', 'Dead-letter', 'recovery', 'relay'],
        observability: ['instrumentation', 'Traces', 'Metrics', 'Logs', 'Provider', 'exporters', 'shutdown'],
        health: ['dependencies', 'registry', 'gRPC health', 'HTTP views', 'Platform probes', 'termination'],
        docker: ['Build inputs', 'Build stage', 'Runtime image', 'Launch configuration', 'probe', 'Compose'],
        kubernetes: ['Deployment', 'ConfigMap', 'HPA', 'RBAC', 'Service', 'Ready endpoints', 'Termination'],
        envoy: ['Proto annotations', 'descriptor', 'OpenAPI', 'Listeners', 'REST transcoder', 'Native gRPC', 'Deploy and check'],
        mesh: ['Istio installation', 'Mesh policy', 'sidecar', 'Application policy', 'Telemetry', 'Migration', 'Rollout'],
        architecture: ['process', 'Shared RPC', 'HTTP', 'catalog', 'EventBus', 'telemetry', 'Infrastructure'],
        'in-process': ['client API', 'In-memory boundary', 'Shared RPC', 'Four RPC kinds', 'cancellation', 'Testing'],
    };
    for (const diagram of diagrams) {
        const visibleText = [...diagram.body.matchAll(/<text[^>]*>([^<]+)<\/text>/g)].map((match) => match[1]).join(' ');
        assert.ok(concepts[diagram.key], `${diagram.key}: missing content contract`);
        for (const concept of concepts[diagram.key]) assert.ok(visibleText.toLowerCase().includes(concept.toLowerCase()), `${diagram.key}: missing visible ${concept}`);
    }
});
