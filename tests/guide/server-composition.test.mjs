import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { model, partGeometry, project, renderHtml, renderSvg } from '../../scripts/server-composition.mjs';

test('the embedded artwork is reproducible from its checked-in HTML source', () => {
    const html = readFileSync(new URL('../../.vitepress/theme/assets/diagrams/server-composition.html', import.meta.url), 'utf8');
    assert.equal(html, renderHtml());
    assert.equal(html.match(/<svg\b[\s\S]*?<\/svg>/)?.[0], renderSvg());
    assert.doesNotMatch(renderSvg(), /<script\b|<foreignObject\b|<image\b|\bon\w+=|\bhref=|NaN|Infinity/);
    assert.match(renderSvg(), /viewBox="84 0 688 440"/);
});

test('three compact prisms share one projection, equal gaps and one focal part', () => {
    assert.equal(model.parts.length, 3);
    assert.deepEqual(
        model.parts.filter((part) => part.focal).map((part) => part.key),
        ['services'],
    );
    assert.equal(model.gap, 60);
    assert.deepEqual(project(4, 0, 0), [model.origin[0] + 4, model.origin[1] + 2]);
    assert.deepEqual(project(0, 4, 0), [model.origin[0] - 4, model.origin[1] + 2]);
    const geometries = model.parts.map((part) => partGeometry(part.level));
    assert.equal(geometries[0].z, 0);
    for (let i = 1; i < geometries.length; i++) {
        assert.equal(geometries[i].z - geometries[i - 1].z - model.thickness, model.gap);
        assert.equal(geometries[i].right[0], geometries[0].right[0]);
        assert.ok(geometries[i - 1].labelY - geometries[i].labelY >= 36);
    }
    for (const geometry of geometries) {
        assert.ok(geometry.right[0] + 6 < model.labelX - 12);
        assert.ok(geometry.labelY > 40 && geometry.labelY < model.height - 40);
        for (const path of [geometry.silhouette, geometry.top, geometry.left, geometry.rightFace, geometry.rim]) {
            assert.match(path, /^M /);
            assert.doesNotMatch(path, /[a-z]|NaN|Infinity/);
            assert.ok([...path.matchAll(/-?\d+(?:\.\d+)?/g)].every(([value]) => Number.isFinite(Number(value))));
        }
    }
});

test('the HTML source has a complete accessible static SVG and local scrolling', () => {
    const html = renderHtml();
    assert.match(html, /<svg[^>]+role="img"[^>]+aria-labelledby="server-composition-title server-composition-desc">\s*<title/);
    for (const id of ['server-composition-title', 'server-composition-desc']) {
        assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) ?? []).length, 1);
    }
    assert.equal((html.match(/data-part=/g) ?? []).length, 3);
    assert.equal((html.match(/data-focal>/g) ?? []).length, 1);
    assert.match(html, /min-width: 688px/);
    assert.match(html, /overflow-x: auto/);
    assert.match(html, /@media print[^\n]+min-width: 0/);
    for (const part of model.parts) assert.ok(html.includes(part.name) && html.includes(part.detail));
    assert.doesNotMatch(html, /animation:|requestAnimationFrame|box-shadow|linearGradient/);
});
