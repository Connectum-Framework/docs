import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import loader from '../../.vitepress/validation/showcase.data.ts';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const recording = JSON.parse(read('.vitepress/validation/recording.json'));
const data = await loader.load();
const decoded = (html) =>
    html
        .match(/<code>([\s\S]*?)<\/code>/)[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');

test('each request selects its own recorded RPC result and handler boundary', () => {
    assert.deepEqual(
        data.scenarios.map(({ id, code, handlerCalls }) => ({ id, code, handlerCalls })),
        [
            { id: 'known', code: 'OK', handlerCalls: 1 },
            { id: 'empty', code: 'InvalidArgument', handlerCalls: 0 },
            { id: 'unknown', code: 'NotFound', handlerCalls: 1 },
        ],
    );
    for (const scenario of data.scenarios) {
        const record = recording.records.find(({ id }) => id === scenario.id);
        assert.deepEqual(JSON.parse(decoded(scenario.request)), record.request);
        assert.deepEqual(JSON.parse(decoded(scenario.result)), record.response ?? record.error);
    }
});

test('the first scenario is successful and supplies the initial selected state', () => {
    assert.equal(data.scenarios[0].id, 'known');
    assert.equal(data.scenarios[0].code, 'OK');
    assert.match(read('.vitepress/theme/components/ValidationShowcase.vue'), /const selected = ref<ValidationScenarioId>\(data\.scenarios\[0\]\.id\)/);
    assert.match(read('en/contributing/documentation-style.md'), /Start each code\/result showcase with a successful scenario/);
});

test('recorded results cannot silently outlive their executable sources', () => {
    for (const [path, hash] of Object.entries(recording.sources)) {
        const source = read(`.vitepress/validation/example/${path}`);
        assert.equal(createHash('sha256').update(source).digest('hex'), hash, `${path}: regenerate the validation recording`);
    }
    const request = read('.vitepress/validation/example/proto/shop/v1/inventory.proto').match(/message CheckStockRequest \{[\s\S]*?\n\}/)[0];
    assert.ok(read('en/guide/validation.md').includes(`\`\`\`proto\n${request}\n\`\`\``), 'The visible rule differs from the executed contract');
});

test('source, input and output use native highlighted copyable code without a browser highlighter', () => {
    const blocks = [data.handler, data.server, data.proto, data.commands, ...data.scenarios.flatMap(({ request, result }) => [request, result])];
    for (const html of blocks) {
        assert.match(html, /vp-adaptive-theme line-numbers-mode/);
        assert.match(html, /shiki-themes github-light github-dark vp-code/);
        assert.match(html, /title="Copy Code" class="copy"/);
        assert.match(html, /--shiki-light:#[\da-f]{6};--shiki-dark:#[\da-f]{6}/i);
        assert.equal((html.match(/class="line-number"/g) ?? []).length, decoded(html).split('\n').length);
    }
    assert.equal(decoded(data.handler), read('.vitepress/validation/example/src/inventory.ts').trimEnd());
    const component = read('.vitepress/theme/components/ValidationShowcase.vue');
    assert.doesNotMatch(component, /<pre\b|fetch\(|setInterval|setTimeout|createServer\(/);
    assert.match(component, /No RPC runs in this browser/);
    assert.match(component, /Compare all three requests without animation/);
});

test('the original section-wide model and every detailed section remain reachable', () => {
    const page = read('en/guide/validation.md');
    assert.match(page, /::: details How validation is wired\n<figure/);
    assert.match(page, /<GuideOverview :source="overview" \/>/);
    assert.match(page, /<GuideSections route="\/en\/guide\/validation" \/>/);
    assert.match(page, /\/en\/guide\/validation-setup#proto-constraints/);
});
