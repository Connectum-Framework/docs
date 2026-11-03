#!/usr/bin/env node

// Checks every in-site link that carries a #fragment against the built HTML:
// the target page must contain an element with that id (or a named anchor).
// VitePress' own dead-link check ignores fragments, so a renamed or moved
// heading breaks links silently. Run after `pnpm docs:build`.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import process from 'node:process';

const projectRoot = resolve(import.meta.dirname, '..');
const distRoot = resolve(projectRoot, '.vitepress/dist');

if (!existsSync(distRoot)) {
    console.error('validate-anchors: .vitepress/dist is missing; run `pnpm docs:build` first.');
    process.exit(1);
}

function collectHtml(directory) {
    const files = [];
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== 'assets') files.push(...collectHtml(path));
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            files.push(path);
        }
    }
    return files.sort();
}

function decode(value) {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function decodeEntities(value) {
    return value
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', "'")
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>');
}

const pages = new Map();
for (const file of collectHtml(distRoot)) {
    const html = readFileSync(file, 'utf8');
    const ids = new Set();
    for (const match of html.matchAll(/\s(?:id|name)="([^"]*)"/g)) ids.add(decodeEntities(match[1]));
    pages.set(file, { html, ids });
}

// Maps a link path (already without query/hash) to the built file that serves it.
function resolveTarget(urlPath) {
    const base = resolve(distRoot, `.${urlPath}`);
    const candidates = [base, `${base}.html`, resolve(base, 'index.html')];
    return candidates.find((candidate) => pages.has(candidate) && statSync(candidate).isFile());
}

const broken = [];
let checked = 0;

for (const [file, { html }] of pages) {
    const pageUrl = `/${relative(distRoot, file).replaceAll('\\', '/')}`.replace(/(?:^|\/)index\.html$/, '/').replace(/\.html$/, '');
    for (const match of html.matchAll(/<a\b[^>]*?\shref="([^"]*#[^"]*)"/g)) {
        const href = decodeEntities(match[1]);
        if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) continue;
        const hashIndex = href.indexOf('#');
        const pathPart = href.slice(0, hashIndex).split('?')[0];
        const fragment = decode(href.slice(hashIndex + 1));
        if (fragment === '' || fragment === 'top') continue;

        let targetFile;
        if (pathPart === '') {
            targetFile = file;
        } else {
            const absolute = new URL(pathPart, `http://x${pageUrl}`).pathname;
            targetFile = resolveTarget(decode(absolute));
        }
        // Links to pages outside the build (or non-HTML files) are covered by the dead-link check.
        if (!targetFile) continue;

        checked += 1;
        if (!pages.get(targetFile).ids.has(fragment)) {
            broken.push(`${relative(distRoot, file)} -> ${href}`);
        }
    }
}

if (broken.length > 0) {
    console.error(`validate-anchors: ${broken.length} broken fragment link(s):`);
    for (const line of [...new Set(broken)].sort()) console.error(`  ${line}`);
    process.exit(1);
}
console.log(`validate-anchors: ${checked} fragment links checked, 0 broken.`);
