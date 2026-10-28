import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const topics = [
    'auth',
    'validation',
    'security',
    'health-checks',
    'observability',
    'events',
    'openapi',
    'service-communication',
    'service-communication/choosing-a-mechanism',
    'testing',
    'quickstart',
    'scaffolding',
    'typescript',
    'runtime-compatibility',
    'protocols/reflection',
    'protocols/custom',
    'production/architecture',
    'production/in-process-transport',
    'production/docker',
    'production/kubernetes',
    'production/envoy-gateway',
    'production/service-mesh',
    'production/transport-matrix',
];
const page = (topic) => read(`en/guide/${topic}.md`);

test('all 23 former card models have named, captioned subject diagrams', () => {
    assert.equal(topics.length, 23);
    for (const topic of topics) {
        const source = page(topic);
        assert.match(source, /<figure class="technical-diagram/);
        assert.match(source, /```mermaid\n(?:flowchart TD|sequenceDiagram)/);
        assert.match(source, /accTitle: .+/);
        assert.match(source, /accDescr: .+/);
        assert.match(source, /<figcaption>.+<\/figcaption>/);
        assert.doesNotMatch(source, /guide-map|GuideFlow|classDef|%%\{init:/, topic);
    }
});

test('decisions, artifact inputs and call/return messages are not a repeated stage template', () => {
    assert.match(page('auth'), /Auth -->\|no\| Reject/);
    assert.match(page('auth'), /Policy -->\|no\| Reject/);
    assert.match(page('auth'), /Auth\{.*\} -->\|AuthContext\| Policy/);
    assert.match(page('validation'), /Rules\[.*\] -\.-> Check/);
    assert.match(page('validation'), /Check -->\|no\| Error/);
    assert.match(page('events'), /Adapter -->\|memory\| Memory/);
    assert.match(page('events'), /Adapter -->\|broker\| Broker/);
    assert.match(page('openapi'), /Base --> Overlay/);
    assert.match(page('openapi'), /Descriptors --> Overlay/);
    assert.match(page('typescript'), /Types --> Check/);
    assert.match(page('typescript'), /JS --> Runtime/);
    assert.match(page('service-communication'), /O->>I: CheckStock\(sku\)/);
    assert.match(page('service-communication'), /I-->>O: Stock result or error/);
    assert.match(page('service-communication/choosing-a-mechanism'), /Choice -->\|later reaction\| Event/);
    assert.match(page('protocols/reflection'), /S-->>T: Mounted descriptors/);
    assert.match(page('protocols/custom'), /Routes -\.->\|rebuild router\| Register/);
});

test('production diagrams distinguish control, transport and application boundaries', () => {
    assert.match(page('production/kubernetes'), /Readiness -\.->\|membership\| Endpoints/);
    assert.match(page('production/kubernetes'), /Endpoints --> RPC/);
    assert.match(page('production/envoy-gateway'), /Descriptors\[.*\] -\.-> Transcode/);
    assert.match(page('production/service-mesh'), /Outbound -->\|workload mTLS\| Inbound/);
    assert.match(page('production/service-mesh'), /Inbound\[.*\] --> Policy/);
    assert.match(page('production/transport-matrix'), /Proxy -->\|HTTP\/2 upstream\| Server/);
    assert.match(page('production/in-process-transport'), /One server · no socket/);
    assert.doesNotMatch(read('.vitepress/theme/styles/guide-overview.css'), /guide-map|guide-step/);
    assert.match(read('.vitepress/theme/styles/guide-overview.css'), /guide-topic-diagram--wide/);
});
