import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

test('the generic animation player, clock and stylesheet are removed, not merely hidden', () => {
    for (const path of ['.vitepress/theme/components/GuideFlow.vue', '.vitepress/theme/styles/guide-flow.css', '.vitepress/guide/motion.ts'])
        assert.equal(existsSync(new URL(path, root)), false);
    assert.doesNotMatch(read('.vitepress/theme/index.ts'), /GuideFlow|guide\/motion|guide-flow/);
    let staticFigures = 0;
    function visit(path) {
        for (const entry of readdirSync(new URL(path, root), { withFileTypes: true })) {
            const file = join(path, entry.name);
            if (entry.isDirectory()) visit(file);
            else if (file.endsWith('.md')) {
                const source = read(file);
                assert.doesNotMatch(source, /GuideFlow|guide-flow/, `${file}: obsolete player remains`);
                staticFigures += (source.match(/<figure class="guide-map"/g) ?? []).length;
            }
        }
    }
    visit('en/guide');
    assert.equal(staticFigures, 23, 'The unchanged overview models should remain static pending diagram review');
});

test('the pilot diagrams explain dependencies, public composition and a call sequence', () => {
    const about = read('en/guide/about.md');
    const server = read('en/guide/server.md');
    const interceptors = read('en/guide/interceptors.md');
    for (const source of [about, server, interceptors]) {
        assert.match(source, /<figure class="technical-diagram"/);
        assert.match(source, /```mermaid/);
        assert.match(source, /accTitle:/);
        assert.match(source, /accDescr:/);
        assert.match(source, /<figcaption>/);
        assert.doesNotMatch(source, /<figure class="guide-map"/);
    }
    assert.match(about, /Handlers\[.*\] --> Service/);
    assert.match(server, /Optional\[.*\] -\.-> Server/);
    assert.match(server, /Server --> Local/);
    assert.match(server, /Server -->\|start\| Network/);
    assert.match(interceptors, /sequenceDiagram/);
    assert.match(interceptors, /I->>H: next\(request\)/);
    assert.match(interceptors, /H-->>I: Response or error/);
});

test('the accepted catalog and resolver retain their own visual mechanisms', () => {
    assert.match(read('en/guide/service-communication/service-catalog.md'), /<CatalogAssembly \/>/);
    assert.match(read('en/guide/service-communication/resolvers.md'), /<ResolverWalkthrough>/);
    assert.match(read('.vitepress/theme/index.ts'), /app\.component\('CatalogAssembly', CatalogAssembly\)/);
});
