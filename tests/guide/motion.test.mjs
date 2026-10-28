import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { GUIDE_STEP_MS, guideBeats, guideFrame } from '../../.vitepress/guide/motion.ts';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('every narrated overview stage has a reachable frame and loops without changing its source data', () => {
    assert.equal(Object.keys(guideBeats).length, 26);
    for (const [scene, beats] of Object.entries(guideBeats)) {
        const route = `en/guide/${scene}.md`;
        const source = read(route);
        assert.ok(source.includes(`<GuideFlow scene="${scene}">`), `${route}: animation is not mounted`);
        const model = source.slice(source.indexOf('<figure class="guide-map"'), source.indexOf('</figure>'));
        assert.equal((model.match(/<li>/g) ?? []).length, beats.length, `${route}: stages do not match the diagram`);
        assert.equal(new Set(beats.map((beat) => beat.token)).size, beats.length, `${scene}: stages need distinct output`);
        for (const [index, beat] of beats.entries()) {
            for (const offset of [0, 1, GUIDE_STEP_MS - 1]) {
                const frame = guideFrame({ scene, elapsedMs: index * GUIDE_STEP_MS + offset });
                assert.equal(frame.index, index);
                assert.equal(frame.beat, beat);
                assert.ok(frame.progress >= 0 && frame.progress < 1);
            }
        }
        const duration = beats.length * GUIDE_STEP_MS;
        assert.deepEqual(guideFrame({ scene, elapsedMs: duration }), guideFrame({ scene, elapsedMs: 0 }));
        assert.deepEqual(guideFrame({ scene, elapsedMs: duration * 3 + 1250 }), guideFrame({ scene, elapsedMs: 1250 }));
    }
});

test('there are no orphaned scenes or unanimated overview figures', () => {
    const wrappers = [];
    function visit(path) {
        for (const entry of readdirSync(new URL(`../../${path}`, import.meta.url), { withFileTypes: true })) {
            const file = join(path, entry.name);
            if (entry.isDirectory()) visit(file);
            else if (entry.name.endsWith('.md')) {
                const source = read(file);
                if (source.includes('<figure class="guide-map"')) assert.match(source, /<GuideFlow scene="[^"]+">/);
                for (const match of source.matchAll(/<GuideFlow scene="([^"]+)">/g)) wrappers.push(match[1]);
            }
        }
    }
    visit('en/guide');
    assert.deepEqual(wrappers.sort(), Object.keys(guideBeats).sort());
    const resolver = read('en/guide/service-communication/resolvers.md');
    assert.match(resolver, /<ResolverWalkthrough>/);
});

test('the shared clock rejects invalid time instead of rendering a missing stage', () => {
    for (const elapsedMs of [-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) assert.throws(() => guideFrame({ scene: 'server', elapsedMs }), RangeError);
});

test('catalog uses its own composition model rather than the generic player', () => {
    const catalog = read('en/guide/service-communication/service-catalog.md');
    assert.match(catalog, /<CatalogAssembly \/>/);
    assert.doesNotMatch(catalog, /GuideFlow/);
    assert.ok(!Object.hasOwn(guideBeats, 'service-communication/service-catalog'));
});
