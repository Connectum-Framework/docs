import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { movedTestingSections } from '../../.vitepress/guide/testing-sections.ts';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('the former testing details retain focused destinations and a shared no-JS fallback', () => {
    assert.deepEqual(
        movedTestingSections.map(({ id }) => id),
        ['test-server', 'mock-context', 'parity-scenarios'],
    );
    for (const { id, to } of movedTestingSections) {
        assert.equal(to, `/en/guide/testing/integration#${id}`);
        assert.ok(read('en/guide/testing/integration.md').includes(`{#${id}}`));
    }
    assert.match(read('en/guide/testing.md'), /<MovedGuideSections :entries="movedTestingSections"/);
    const component = read('.vitepress/theme/components/MovedGuideSections.vue');
    for (const required of ['target.search = location.search', "window.addEventListener('hashchange'", 'onBeforeUnmount', '<details', ':id="entry.id"', ':href="entry.to"']) {
        assert.ok(component.includes(required), required);
    }
});

test('the released fallback order and streaming scope agree across focused guides and migration', () => {
    const fallback = read('en/guide/interceptors/fallback.md');
    for (const edge of ['Validation --> Fallback', 'Fallback --> Breaker', 'Breaker --> Retry']) assert.ok(fallback.includes(edge), edge);
    assert.match(fallback, /only message is the fallback/);
    assert.match(fallback, /already opened response is not replaced/);
    assert.match(read('en/migration/interceptor-options.md'), /bulkhead, validation, fallback, circuitBreaker, retry, serializer/);
});
