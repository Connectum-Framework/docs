import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { getOption } from '@bufbuild/protobuf';
import { RuntimeError } from '@bufbuild/protovalidate';
import { field } from '@bufbuild/protovalidate/gen/buf/validate/validate_pb.js';
import { CheckStockRequestSchema } from '../../.vitepress/validation/gen/shop/v1/inventory_pb.ts';
import { evaluateInput } from '../../.vitepress/validation/runtime.ts';
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

test('the initial form and static examples begin with an actual successful check', () => {
    assert.deepEqual(data.initialInput, { sku: 'A-1', quantity: '2' });
    assert.deepEqual(data.initial, evaluateInput(data.initialInput));
    assert.equal(data.initial.kind, 'valid');
    assert.equal(data.scenarios[0].code, 'OK');
    assert.match(read('en/contributing/documentation-style.md'), /Start each code\/result showcase with a successful scenario/);
});

test('editing quantity 2 to 0 to 2 changes real proto violations and the handler boundary', () => {
    const run = (quantity) => evaluateInput({ sku: 'A-1', quantity });
    assert.deepEqual(run('2').response, { units: 7 });
    const rejected = run('0');
    assert.equal(rejected.kind, 'invalid');
    assert.equal(rejected.handlerCalls, 0);
    assert.deepEqual(rejected.issues, [{ field: 'quantity', rule: 'int32.gt', message: 'must be greater than 0' }]);
    assert.equal(rejected.response, undefined);
    assert.deepEqual(run('2'), data.initial);
});

test('proto violations remain distinct from business-level SKU errors', () => {
    const empty = evaluateInput({ sku: '', quantity: '2' });
    assert.equal(empty.issues[0].rule, 'string.min_len');
    assert.equal(empty.handlerCalls, 0);
    const unknown = evaluateInput({ sku: 'UNKNOWN', quantity: '2' });
    assert.equal(unknown.validation, 'passed');
    assert.equal(unknown.kind, 'business-error');
    assert.equal(unknown.code, 'NotFound');
    assert.equal(unknown.handlerCalls, 1);
    const both = evaluateInput({ sku: '', quantity: '0' });
    assert.deepEqual(
        both.issues.map(({ field, rule }) => ({ field, rule })),
        [
            { field: 'sku', rule: 'string.min_len' },
            { field: 'quantity', rule: 'int32.gt' },
        ],
    );
});

test('unfinished, nonnumeric and unrepresentable quantities never become successful requests', () => {
    for (const quantity of ['', ' ', '-', '1.5', 'NaN', 'Infinity', 'abc', '1e3', '2147483648', '-2147483649', '9999999999999999999999999']) {
        const result = evaluateInput({ sku: 'A-1', quantity });
        assert.equal(result.kind, 'input-error', quantity);
        assert.equal(result.validation, 'not-run', quantity);
        assert.equal(result.issues[0].field, 'quantity', quantity);
        assert.equal(result.issues[0].rule, undefined, quantity);
        assert.equal(result.handlerCalls, 0, quantity);
        assert.equal(result.response, undefined, quantity);
    }
    assert.equal(evaluateInput({ sku: 'A-1', quantity: '-2147483648' }).kind, 'invalid');
    assert.equal(evaluateInput({ sku: 'A-1', quantity: '2147483647' }).kind, 'valid');
    assert.equal(evaluateInput({ sku: 'A-1', quantity: ' 2 ' }).kind, 'valid');
});

test('validator failures are not presented as validation success or a business rejection', () => {
    const result = evaluateInput(data.initialInput, { validate: (_schema, message) => ({ kind: 'error', message, error: new RuntimeError('Cannot evaluate rules') }) });
    assert.equal(result.kind, 'runtime-error');
    assert.equal(result.validation, 'error');
    assert.equal(result.handlerCalls, 0);
    assert.equal(result.message, 'Cannot evaluate rules');
    assert.equal(result.response, undefined);
});

test('the live evaluator matches captured real HTTP RPCs and cannot outlive their sources', () => {
    for (const record of recording.records) {
        const result = evaluateInput({ sku: record.request.sku, quantity: String(record.request.quantity) });
        assert.equal(result.code, record.code);
        assert.equal(result.handlerCalls, record.handlerCalls);
        assert.deepEqual(result.response, record.response);
        assert.deepEqual(result.issues, record.validation.issues);
    }
    for (const [path, hash] of Object.entries(recording.sources)) {
        assert.equal(
            createHash('sha256')
                .update(read(`.vitepress/validation/example/${path}`))
                .digest('hex'),
            hash,
            `${path}: regenerate the RPC parity recording`,
        );
    }
});

test('the displayed contract and browser descriptor retain both actual proto rules', () => {
    const request = read('.vitepress/validation/example/proto/shop/v1/inventory.proto').match(/message CheckStockRequest \{[\s\S]*?\n\}/)[0];
    assert.ok(read('en/guide/validation.md').includes(`\`\`\`proto{4,9}\n${request}\n\`\`\``));
    const skuRule = getOption(CheckStockRequestSchema.field.sku, field).type;
    assert.equal(skuRule.case, 'string');
    assert.equal(skuRule.value.minLen, 1n);
    const quantityRule = getOption(CheckStockRequestSchema.field.quantity, field).type;
    assert.equal(quantityRule.case, 'int32');
    assert.deepEqual(quantityRule.value.greaterThan, { case: 'gt', value: 0 });
    assert.match(read('.vitepress/validation/gen/shop/v1/inventory_pb.ts'), /@bufbuild\/protovalidate\/gen\/buf\/validate\/validate_pb.js/);
});

test('native source examples remain highlighted and copyable without a browser highlighter', () => {
    for (const html of [data.handler, data.server, data.proto, data.commands, ...data.scenarios.flatMap(({ request, result }) => [request, result])]) {
        assert.match(html, /vp-adaptive-theme line-numbers-mode/);
        assert.match(html, /shiki-themes github-light github-dark vp-code/);
        assert.match(html, /title="Copy Code" class="copy"/);
        assert.equal((html.match(/class="line-number"/g) ?? []).length, decoded(html).split('\n').length);
    }
    assert.equal(decoded(data.handler), read('.vitepress/validation/example/src/inventory.ts').trimEnd());
    const component = read('.vitepress/theme/components/ValidationShowcase.vue');
    assert.match(component, /await import\('\.\.\/\.\.\/validation\/runtime.ts'\)/);
    assert.doesNotMatch(component, /Replay path|Recorded RPC result|validation-scenarios|setInterval|setTimeout|createServer\(/);
    assert.match(component, /No RPC is sent/);
});

test('the original section-wide model and every detailed section remain reachable', () => {
    const page = read('en/guide/validation.md');
    assert.match(page, /::: details How validation is wired\n<figure/);
    assert.match(page, /<GuideOverview :source="overview" \/>/);
    assert.match(page, /<GuideSections route="\/en\/guide\/validation" \/>/);
    assert.match(page, /\/en\/guide\/validation-setup#proto-constraints/);
});
