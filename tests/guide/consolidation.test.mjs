import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('the catalog aggregate strategy correction belongs to the reference while the overview retains its links', () => {
    const reference = read('en/reference/service-catalog.md');
    assert.match(reference, /local: protoc-gen-connectum-catalog\n {4}strategy: all/);
    assert.match(reference, /duplicate generated file name/);
    assert.match(read('en/guide/service-communication/service-catalog.md'), /\/en\/reference\/service-catalog#generating-the-catalog/);
});

test('the moved transport reference preserves the Workers support distinction and its former fragment', () => {
    const detail = read('en/guide/production/transport-matrix-details.md');
    assert.match(detail, /Cloudflare Workers.*Not supported by Connectum/);
    assert.match(detail, /### Cloudflare Workers \{#cloudflare-workers\}/);
    assert.match(detail, /Connectum has no Fetch-style handler for Workers/);
    const section = JSON.parse(read('.vitepress/guide/sections.json')).find((page) => page.route === '/en/guide/production/transport-matrix');
    assert.ok(section.anchors.some((anchor) => anchor.id === 'cloudflare-workers'));
});

test('catalog call patterns and the detailed contribution guides remain reachable after consolidation', () => {
    const patterns = read('en/guide/service-communication/patterns.md');
    assert.match(patterns, /ctx\.call\(/);
    assert.match(patterns, /ctx\.stream/);
    assert.match(patterns, /Calls Outside the Catalog/);
    const config = read('.vitepress/config/en.ts');
    for (const page of ['code-style', 'commit-messages', 'pull-requests', 'testing']) {
        assert.ok(read(`en/contributing/${page}.md`).length > 300);
        assert.ok(config.includes(`/en/contributing/${page}`));
    }
});
