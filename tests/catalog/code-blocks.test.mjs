import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { assemblyLayouts } from '../../.vitepress/catalog/assembly.ts';
import loader from '../../.vitepress/catalog/assembly-code.data.ts';

const blocks = await loader.load();
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('every catalog import example uses a native highlighted TypeScript block', () => {
    assert.deepEqual(
        Object.keys(blocks),
        assemblyLayouts.map((layout) => layout.id),
    );
    for (const layout of assemblyLayouts) {
        const html = blocks[layout.id];
        assert.match(html, /class="language-typescript vp-adaptive-theme line-numbers-mode"/);
        assert.match(html, /class="shiki shiki-themes github-light github-dark vp-code"/);
        assert.match(html, /<button title="Copy Code" class="copy"><\/button>/);
        assert.match(html, /--shiki-light:#[\da-f]{6};--shiki-dark:#[\da-f]{6}/i);
        assert.equal((html.match(/class="line-number"/g) ?? []).length, layout.code.split('\n').length);
        const code = html
            .match(/<code>([\s\S]*?)<\/code>/)[1]
            .replace(/<[^>]+>/g, '')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&');
        assert.equal(code, layout.code, `${layout.id}: highlighting changed the executable source`);
    }
});

test('both dynamic catalog locations consume the build-time native blocks, not plain pre tags', () => {
    const component = read('.vitepress/theme/components/CatalogAssembly.vue');
    assert.match(component, /codeBlock: assemblyCode\[item.id\]/);
    assert.match(component, /v-html="layout.codeBlock"/);
    assert.match(component, /v-html="item.codeBlock"/);
    assert.doesNotMatch(component, /<pre\b/);
    assert.doesNotMatch(read('.vitepress/theme/styles/catalog-assembly.css'), /white-space: pre-wrap/);
    const overview = read('en/guide/service-communication/service-catalog.md');
    assert.match(overview, /```typescript\ncreateServer\(\{/);
    assert.doesNotMatch(overview, /`createServer\(/);
});
