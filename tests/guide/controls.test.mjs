import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const controls = read('.vitepress/theme/styles/controls.css');

test('the shared control stylesheet is loaded once for every route', () => {
    assert.equal(read('.vitepress/theme/index.ts').split("import './styles/controls.css';").length - 1, 1);
});

test('route styles cannot reintroduce a second custom focus frame', () => {
    for (const path of readdirSync(new URL('.vitepress/theme/', root), { recursive: true }).filter((path) => path.endsWith('.css') && !path.endsWith('controls.css'))) {
        const source = read(`.vitepress/theme/${path}`);
        for (const [, selectors, declarations] of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
            if (selectors.includes(':focus-visible') || selectors.includes(':focus-within')) {
                assert.doesNotMatch(declarations, /(?:outline|box-shadow|border-color)\s*:/, `${path}: focus styling belongs to controls.css`);
            }
        }
    }
});

test('native selects retain an explicit arrow fallback and guarded themed picker', () => {
    assert.match(controls, /--control-select-arrow:\s*url/);
    assert.match(controls, /background-image: var\(--control-select-arrow\)/);
    assert.match(controls, /@supports \(appearance: base-select\) and selector\(::picker\(select\)\)/);
    assert.match(controls, /::picker-icon/);
    assert.match(controls, /option::checkmark/);
    assert.match(controls, /@media \(forced-colors: active\)/);
    assert.match(read('.vitepress/theme/components/InterceptorsShowcase.vue'), /<select id="interceptors-chain" v-model="chain"/);
    assert.match(read('.vitepress/theme/components/ServiceBuilder.vue'), /<select id="builder-node-exec"/);
});

test('text errors and selected controls remain semantic states, independent of focus', () => {
    assert.match(read('.vitepress/theme/styles/validation-showcase.css'), /input\[aria-invalid="true"\]/);
    assert.match(read('.vitepress/theme/components/ValidationShowcase.vue'), /:aria-invalid="quantityIssues.length > 0"/);
    assert.match(controls, /border-color: transparent/);
    assert.match(controls, /outline-offset: -1px/);
    assert.match(controls, /:has\(input:focus-visible\)/);
    assert.match(controls, /search-bar:has\(\.search-input:focus-visible\)/);
});

test('hidden VitePress code-group radios put their single focus frame on the visible tab label', () => {
    assert.match(controls, /\.vp-code-group \.tabs input:focus-visible \+ label\s*\{[^}]*outline: 2px solid[^}]*outline-offset: -2px/);
    assert.match(controls, /\.vp-code-group \.tabs input:focus-visible \+ label::after\s*\{\s*background-color: transparent/);
});

test('the diagram dialog gives its single control initial focus and contains Tab navigation', () => {
    const layout = read('.vitepress/theme/Layout.vue');
    assert.match(layout, /else if \(e.key === 'Tab'\) \{\s*e.preventDefault\(\)\s*closeButton.focus\(\)/);
    assert.match(layout, /document.body.appendChild\(overlay\)\s*closeButton.focus\(\)/);
    assert.match(layout, /previousFocus\?\.focus\(\)/);
});
