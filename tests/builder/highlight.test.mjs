import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDiffHighlighter } from '../../.vitepress/builder/highlight.ts';
import { buildProject, compactDiff, defaultSelection, previewFiles } from '../../.vitepress/builder/model.ts';

const highlight = await createDiffHighlighter();

test('syntax tokens preserve every displayed character of the real TypeScript/proto/JSON/YAML diffs', () => {
    const baseline = buildProject(defaultSelection());
    const files = buildProject({ ...defaultSelection(), auth: true, otel: true, events: true, catalog: true, resilience: ['timeout', 'retry'] });
    const languages = new Set();
    for (const path of previewFiles(baseline, files)) {
        const before = baseline[path] ?? '';
        const after = files[path];
        const rows = compactDiff(before, after);
        const tokens = highlight({ path, before, after, rows });
        assert.equal(tokens.length, rows.length);
        rows.forEach((row, index) => {
            if (row.kind === 'gap') {
                assert.deepEqual(tokens[index], []);
                return;
            }
            assert.equal(tokens[index].map((token) => token.content).join(''), row.text, `${path}:${index}`);
            for (const token of tokens[index]) {
                assert.match(token.light, /^#[\da-f]{6}$/i);
                assert.match(token.dark, /^#[\da-f]{6}$/i);
            }
        });
        languages.add(path.split('.').at(-1));
    }
    assert.deepEqual([...languages].sort(), ['json', 'proto', 'ts', 'yaml']);
});

test('removed lines use their old multiline grammar state, not the modified document', () => {
    const before = '/*\nold comment\n*/\nconst value = 1;\n';
    const after = 'const value = 2;\n';
    const rows = compactDiff(before, after);
    const tokens = highlight({ path: 'src/server.ts', before, after, rows });
    const comment = rows.findIndex((row) => row.text === 'old comment');
    const original = highlight({ path: 'src/server.ts', before, after: before, rows: compactDiff(before, before) });
    assert.deepEqual(tokens[comment], original[1]);
    assert.equal(rows[comment].beforeNumber, 2);
    const added = rows.findIndex((row) => row.kind === 'added');
    assert.ok(new Set(tokens[added].map((token) => token.light)).size > 1);
});

test('unsupported files remain literal text, including markup-looking input', () => {
    const source = '<img src=x onerror="alert(1)">';
    const tokens = highlight({ path: 'notes.txt', before: '', after: source, rows: compactDiff('', source) });
    assert.equal(tokens[0].map((token) => token.content).join(''), source);
});
