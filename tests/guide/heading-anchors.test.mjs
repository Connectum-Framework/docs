import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createMarkdownRenderer, resolveConfig } from 'vitepress';
import { slugify } from '../../scripts/lib/heading-anchors.mjs';

const root = new URL('../../', import.meta.url).pathname;
const config = await resolveConfig(root, 'build');
const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base);

for (const heading of [
    '`foo_bar`',
    'snake_case name',
    '_emphasis_',
    '*emphasis*',
    '`foo*bar`',
    '`foo~bar`',
    '~~strikethrough~~',
    '[a link](/en/guide/quickstart)',
    'Explicit anchor {#custom-id}',
    '123 heading',
]) {
    test(`the validator matches the rendered anchor for ${heading}`, () => {
        const html = md.render(`### ${heading}\n`, { relativePath: 'en/guide/service-communication/service-catalog.md' });
        const rendered = html.match(/<h3 id="([^"]+)"/)?.[1];
        const computed = slugify(heading);
        console.log(JSON.stringify({ heading, rendered, validator: computed }));
        assert.equal(computed, rendered);
    });
}

test('the validator preserves the em dash and separates the dot in the rendered streaming anchor', () => {
    const source = readFileSync(new URL('../../en/guide/service-communication/service-catalog.md', import.meta.url), 'utf8');
    const heading = source.match(/^### (Streaming calls — `ctx\.stream`)$/m)?.[1];
    assert.ok(heading, 'The streaming section must remain available to incoming fragment links.');
    // Captured from the service-catalog HTML in a production VitePress build.
    const expected = 'streaming-calls-—-ctx-stream';
    const html = md.render(`### ${heading}\n`, { relativePath: 'en/guide/service-communication/service-catalog.md' });
    assert.equal(html.match(/<h3 id="([^"]+)"/)?.[1], expected);
    assert.equal(slugify(heading), expected);
    assert.notEqual(slugify(heading), 'streaming-calls-ctxstream');
    console.log(`Streaming anchor: VitePress=${expected}, validator=${slugify(heading)}`);
});
