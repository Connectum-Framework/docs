import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { Code, ConnectError } from '@connectrpc/connect';
import { runInterceptors } from '../../.vitepress/interceptors/runtime.ts';
import { chains, handlerOutcomes, initialSettings } from '../../.vitepress/interceptors/settings.ts';
import loader from '../../.vitepress/interceptors/showcase.data.ts';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const data = await loader.load();
const recording = JSON.parse(read('.vitepress/interceptors/recording.json'));
const decoded = (html) =>
    html
        .match(/<code>([\s\S]*?)<\/code>/)[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');

test('Interceptors starts with a successful executable composition and static run', async () => {
    assert.equal(handlerOutcomes[0].id, 'success');
    assert.equal(chains[0].id, 'audit-first');
    assert.equal(data.initial.code, 'OK');
    assert.deepEqual(data.initial, await runInterceptors(initialSettings));
    assert.deepEqual(
        data.comparisons.slice(0, 3).map(({ result }) => result.code),
        ['OK', 'OK', 'OK'],
    );
});

test('moving audit inside stockTag changes its actual header observation but not the caller header', async () => {
    const outside = await runInterceptors({ chain: 'audit-first', outcome: 'success' });
    assert.deepEqual(outside.events, ['audit: before', 'stockTag: before', 'handler: return 7 units', 'stockTag: after (set header)', 'audit: after (header = fixture)']);
    const inside = await runInterceptors({ chain: 'tag-first', outcome: 'success' });
    assert.deepEqual(inside.events, ['stockTag: before', 'audit: before', 'handler: return 7 units', 'audit: after (header = unset)', 'stockTag: after (set header)']);
    assert.equal(outside.sourceHeader, 'fixture');
    assert.equal(inside.sourceHeader, 'fixture');
    assert.deepEqual(outside.response, { units: 7 });
    assert.deepEqual(inside.response, outside.response);
});

test('omitting stockTag removes both its execution and its real response header', async () => {
    const result = await runInterceptors({ chain: 'audit-only', outcome: 'success' });
    assert.deepEqual(result.events, ['audit: before', 'handler: return 7 units', 'audit: after (header = unset)']);
    assert.equal(result.sourceHeader, null);
    assert.equal(result.handlerCalls, 1);
});

test('a rejected next skips both after-steps and returns the actual handler failure', async () => {
    for (const chain of chains) {
        const result = await runInterceptors({ chain: chain.id, outcome: 'failure' });
        assert.equal(result.code, 'NotFound');
        assert.equal(result.error, 'SKU not found');
        assert.equal(result.sourceHeader, null);
        assert.equal(result.handlerCalls, 1);
        assert.equal(result.response, undefined);
        assert.deepEqual(result.events, [...chain.order.map((name) => `${name}: before`), 'handler: throw NotFound']);
    }
});

test('concurrent local calls isolate their logs and caller headers', async () => {
    const [success, failure] = await Promise.all([runInterceptors({ chain: 'audit-first', outcome: 'success' }), runInterceptors({ chain: 'audit-only', outcome: 'failure' })]);
    assert.equal(success.code, 'OK');
    assert.equal(success.events.length, 5);
    assert.equal(failure.code, 'NotFound');
    assert.deepEqual(failure.events, ['audit: before', 'handler: throw NotFound']);
    assert.notEqual(success.events, failure.events);
});

test('cancelled and unknown configurations never silently produce the default success', async () => {
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(runInterceptors(initialSettings, controller.signal), (error) => error instanceof ConnectError && error.code === Code.Canceled);
    await assert.rejects(runInterceptors({ chain: 'unknown', outcome: 'success' }), RangeError);
    await assert.rejects(runInterceptors({ chain: 'audit-first', outcome: 'unknown' }), RangeError);
});

test('in-memory execution matches all six real HTTP captures and their unchanged sources', async () => {
    assert.equal(recording.records.length, 6);
    for (const record of recording.records) assert.deepEqual(await runInterceptors(record.settings), record.result);
    for (const [path, hash] of Object.entries(recording.sources)) {
        assert.equal(
            createHash('sha256')
                .update(read(`.vitepress/interceptors/example/${path}`))
                .digest('hex'),
            hash,
            `${path}: regenerate the HTTP parity recording`,
        );
    }
});

test('native copyable source and composition snippets match executed implementations', () => {
    for (const [key, file] of Object.entries({ audit: 'audit', stockTag: 'stockTag', handler: 'inventory' })) {
        const source = data.sources[key].html;
        assert.equal(decoded(source), read(`.vitepress/interceptors/example/src/${file}.ts`).trimEnd());
        assert.match(source, /vp-adaptive-theme line-numbers-mode/);
        assert.match(source, /title="Copy Code" class="copy"/);
        assert.match(source, /--shiki-light:/);
    }
    for (const chain of chains) assert.equal(decoded(data.compositions[chain.id]), `interceptors: [${chain.order.join(', ')}]`);
    const component = read('.vitepress/theme/components/InterceptorsShowcase.vue');
    assert.doesNotMatch(component, /setInterval|setTimeout|Replay|fetch\(/);
    assert.match(component, /No network request is sent/);
});

test('the full section model, native setup and detailed destinations are preserved', () => {
    const page = read('en/guide/interceptors.md');
    assert.match(page, /<InterceptorsShowcase \/>/);
    assert.match(page, /::: details How composition and selection fit together\n<figure/);
    assert.match(page, /<GuideOverview :source="overview" \/>/);
    assert.match(page, /interceptors: createDefaultInterceptors\(\)/);
    for (const route of ['built-in', 'custom', 'method-filtering']) assert.ok(page.includes(`/en/guide/interceptors/${route}`));
});
