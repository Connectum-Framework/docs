import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createMarkdownRenderer, resolveConfig } from 'vitepress';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const config = await resolveConfig(root, 'build');
const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base);
const render = (source) => md.render(source, { relativePath: 'en/guide/typescript/patterns.md', cleanUrls: config.cleanUrls });
const checkboxes = (html) => [...html.matchAll(/<input\b[^>]*type="checkbox"[^>]*>/g)].map((match) => match[0]);

test('the shared renderer turns unchecked and checked list markers into labelled read-only inputs', () => {
    const source = '- [ ] Use `import type`\n- [x] Configure [the server](/en/guide/server)\n- [X] Finished\n';
    const html = render(source);
    assert.equal(checkboxes(html).length, 3);
    for (const input of checkboxes(html)) assert.match(input, /disabled="disabled"/);
    assert.equal(checkboxes(html).filter((input) => input.includes('checked="checked"')).length, 2);
    const ids = checkboxes(html).map((input) => input.match(/id="([^"]+)"/)[1]);
    assert.equal(new Set(ids).size, 3);
    for (const id of ids) assert.ok(html.includes(`for="${id}"`));
    assert.match(html, /<code>import type<\/code>/);
    assert.match(html, /href="\/en\/guide\/server"/);
    assert.equal(render(source), html, 'Fresh render environments must produce stable task IDs.');
});

test('the reported TypeScript checklist renders outside and inside both runtime panels', () => {
    const source = read('en/guide/typescript/patterns.md').split('## Checklist\n')[1].split('## Related')[0];
    const html = render(source);
    assert.equal(checkboxes(html).length, 11);
    const node = html.match(/<div class="runtime-panel" data-runtime-value="node">([\s\S]*?)<\/div>/)[1];
    const bun = html.match(/<div class="runtime-panel" data-runtime-value="bun">([\s\S]*?)<\/div>/)[1];
    assert.equal(checkboxes(node).length, 5);
    assert.equal(checkboxes(bun).length, 2);
    assert.doesNotMatch(html, /\[ \]/);
    const ids = checkboxes(html).map((input) => input.match(/id="([^"]+)"/)[1]);
    assert.equal(new Set(ids).size, 11, 'Runtime panels must not restart the task counter.');
});

test('nested and loose task lists retain their list structure and package-manager variants also work', () => {
    const nested = render('- [ ] Parent\n  - [x] Child\n\n- [ ] Loose item\n\n  More explanation.\n\n1. [x] Ordered task\n');
    assert.equal(checkboxes(nested).length, 4);
    assert.match(nested, /<ul class="task-list-container">/);
    assert.match(nested, /<ol class="task-list-container">/);
    assert.match(nested, /<p>More explanation\.<\/p>/);
    const variants = render('::: pm\n== npm\n- [ ] npm setup\n== pnpm\n- [x] pnpm setup\n== bun\n- [ ] Bun setup\n:::\n');
    assert.equal(checkboxes(variants).length, 3);
    for (const value of ['npm', 'pnpm', 'bun']) assert.ok(variants.includes(`data-pm-value="${value}"`));
});

test('task rendering leaves ordinary lists, inline brackets and code examples unchanged', () => {
    const html = render('A literal [ ] marker.\n\n- Ordinary item\n- Brackets [ ] inside text\n- `[ ]` code\n- \\[ ] escaped marker\n\n```md\n- [ ] Example source\n```\n');
    assert.equal(checkboxes(html).length, 0);
    assert.doesNotMatch(html, /class="task-list-/);
    assert.match(html, /<li>Ordinary item<\/li>/);
    assert.match(html, /A literal \[ \] marker/);
});

test('task-list styling is imported once and is scoped away from application controls', () => {
    assert.equal((read('.vitepress/theme/index.ts').match(/import '\.\/styles\/task-lists\.css'/g) ?? []).length, 1);
    const css = read('.vitepress/theme/styles/task-lists.css');
    assert.match(css, /\.vp-doc \.task-list-item\s*\{[^}]*list-style-type: none/);
    assert.match(css, /\.vp-doc \.task-list-item-checkbox\s*\{[^}]*appearance: auto/);
});
