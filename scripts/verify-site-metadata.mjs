#!/usr/bin/env node

// After docs:build, run: node scripts/verify-site-metadata.mjs <evidence-directory> <baseline-llm-directory>
// Keep evidence outside the site sources. Each deliberate output corruption is restored
// before the next check, even if validation fails for an unexpected reason.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { findRedirect } from '../.vitepress/data/redirects.ts';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, '.vitepress/dist');
const [evidenceDirectory, baselineDirectory] = process.argv.slice(2);
assert.ok(evidenceDirectory && baselineDirectory, 'Pass existing evidence and baseline LLM directories.');
const read = (file) => readFileSync(resolve(dist, file), 'utf8');
const files = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
});
const decode = (value) => value.replace(/&(amp|quot|apos|lt|gt|#39);/g, (_, entity) => ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', '#39': "'" })[entity]);
const meta = (html, property) => decode(html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`))?.[1] ?? '');
const sitemap = read('sitemap.xml');

assert.equal(existsSync(resolve(dist, 'README.html')), false);
assert.equal(existsSync(resolve(dist, 'README.md')), false);
assert.doesNotMatch(sitemap, /<loc>[^<]*\/README(?:[./?#]|<)/i);
const searchFiles = files(resolve(dist, 'assets')).filter((file) => file.includes('@localSearchIndex'));
assert.ok(searchFiles.length > 0, 'The build must contain a local search index.');
for (const file of searchFiles) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /\/README(?:[#"\\/]|\.html)/i, file);
    console.log(`No README entry: ${file}`);
}
let checked = 0;
for (const file of files(dist).filter((file) => file.endsWith('.html') && !file.startsWith(resolve(dist, 'assets') + '/'))) {
    const html = readFileSync(file, 'utf8').split('</head>')[0];
    assert.equal(meta(html, 'og:title'), decode(html.match(/<title>(.*?)<\/title>/s)[1]), file);
    assert.equal(meta(html, 'og:description'), decode(html.match(/<meta name="description" content="([^"]*)"/)[1]), file);
    const route = '/' + file.slice(dist.length + 1).replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
    const redirect = findRedirect(route);
    const url = meta(html, 'og:url');
    const canonicalLink = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    if (canonicalLink) assert.equal(url, canonicalLink, file);
    if (redirect) {
        assert.equal(url, html.match(/<link rel="canonical" href="([^"]*)"/)[1], file);
        assert.match(html, /<meta name="robots" content="noindex,follow">/);
    } else if (route !== '/404') {
        assert.ok(sitemap.includes(`<loc>${url}</loc>`), `${file}: ${url} absent from sitemap`);
    }
    checked += 1;
}
console.log(`${checked} pages: Open Graph title/description equal rendered metadata; URLs agree with sitemap or redirect canonical.`);

function validate(name, expectedStatus, expectedMessage) {
    const result = spawnSync(process.execPath, ['scripts/docs-validate.mjs', '--built'], { cwd: root, encoding: 'utf8' });
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
    writeFileSync(resolve(evidenceDirectory, `${name}.log`), `$ node scripts/docs-validate.mjs --built\n${output}\nExit status: ${result.status}\n`);
    assert.equal(result.status, expectedStatus, output);
    if (expectedMessage) assert.match(output, expectedMessage);
    console.log(`${name}: exit ${result.status}, expected ${expectedStatus}`);
}

validate('metadata-clean-before-mutations', 0);
const page = 'en/guide/quickstart.html';
const mutations = [
    ['wrong-sitemap', 'robots.txt', (text) => text.replace('https://connectum.dev/sitemap.xml', 'https://example.invalid/sitemap.xml'), /robots\.txt:.*example\.invalid/],
    ['readme-page', 'README.html', () => read(page), /README\.html: found repository-only page/],
    ['readme-sitemap', 'sitemap.xml', (text) => text.replace('</urlset>', '<url><loc>https://connectum.dev/README</loc></url></urlset>'), /sitemap\.xml: found repository-only URL https:\/\/connectum\.dev\/README/],
    ['wrong-og-url', page, (text) => text.replace(/(<meta property="og:url" content=")[^"]*/, '$1https://connectum.dev/'), /quickstart\.html: expected og:url.*found "https:\/\/connectum\.dev\/"/],
    ...['title', 'description', 'url'].map((property) => [
        `duplicate-og-${property}`, page,
        (text) => text.replace('</head>', `<meta property="og:${property}" content="duplicate"></head>`),
        new RegExp(`quickstart\\.html: expected exactly one og:${property}, found .*duplicate`),
    ]),
    ...['title', 'description', 'url'].map((property) => [
        `missing-og-${property}`, page,
        (text) => text.replace(new RegExp(`<meta property="og:${property}"[^>]*>`), ''),
        new RegExp(`quickstart\\.html: expected exactly one og:${property}, found \\[\\]`),
    ]),
];
for (const [name, file, corrupt, expectedMessage] of mutations) {
    const path = resolve(dist, file);
    const original = existsSync(path) ? readFileSync(path) : undefined;
    try {
        const broken = corrupt(original?.toString() ?? '');
        assert.notEqual(broken, original?.toString(), `${name}: mutation must change output`);
        writeFileSync(path, broken);
        validate(name, 1, expectedMessage);
    } finally {
        if (original === undefined) unlinkSync(path);
        else writeFileSync(path, original);
    }
}
validate('metadata-restored', 0);

const changedLlmFiles = [];
for (const name of ['llms.txt', 'llms-full.txt']) {
    const before = readFileSync(resolve(baselineDirectory, name));
    const after = readFileSync(resolve(dist, name));
    const identical = after.equals(before);
    console.log(`${name}: byte-identical=${identical}, sha256=${createHash('sha256').update(after).digest('hex')}`);
    if (!identical) {
        changedLlmFiles.push(name);
        // Diagnose ordering separately without weakening the byte-equality requirement.
        const sections = (buffer) => name === 'llms.txt' ? buffer.toString().split('\n') : buffer.toString().split(/\n---\n\n(?=---\nurl: )/);
        assert.deepEqual(sections(after).sort(), sections(before).sort(), `${name}: content differs beyond section order`);
        if (name === 'llms.txt') {
            const titles = (buffer) => [...buffer.toString().matchAll(/^- \[(.*)\]\(/gm)].map((match) => match[1]);
            assert.deepEqual(titles(after), titles(before), 'Only equal-title entries may trade places.');
        }
        console.log(`${name}: section contents are identical; only order differs.`);
    }
}
assert.deepEqual(changedLlmFiles, [], 'LLM files must be byte-identical to the baseline.');
