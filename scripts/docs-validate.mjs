#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import process from 'node:process';
import { publicModules } from '../.vitepress/data/modules.ts';

const projectRoot = resolve(import.meta.dirname, '..');
const workspaceRoot = resolve(projectRoot, '..');
const contentRoot = resolve(projectRoot, 'en');
const buildRoot = resolve(projectRoot, '.vitepress/dist');
const site = JSON.parse(readFileSync(resolve(projectRoot, '.vitepress/data/site.json'), 'utf8'));
const checkBuiltOutputs = process.argv.includes('--built');
const errors = [];

function collectFiles(directory, extension) {
    const files = [];
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) files.push(...collectFiles(path, extension));
        else if (entry.isFile() && entry.name.endsWith(extension)) files.push(path);
    }
    return files.sort();
}

function routeFor(file) {
    const sourcePath = relative(projectRoot, file).replaceAll('\\', '/');
    const route = `/${sourcePath.replace(/\.md$/, '')}`;
    return route.endsWith('/index') ? route.slice(0, -5) : route;
}

function cleanHeading(value) {
    return value
        .replace(/\s+\{#[^}]+\}\s*$/, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[`*_~]/g, '')
        .trim();
}

function slugify(value) {
    return cleanHeading(value)
        .normalize('NFKD')
        .toLowerCase()
        .replace(/[^\p{Letter}\p{Number}\s_-]/gu, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function anchorsFor(source) {
    const anchors = new Set();
    const counts = new Map();
    let inFence = false;
    for (const line of source.split(/\r?\n/)) {
        if (/^\s*```/.test(line)) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;
        const match = line.match(/^#{1,6}\s+(.+)$/);
        if (!match) continue;
        const custom = match[1].match(/\s+\{#([^}]+)\}\s*$/)?.[1];
        const base = custom ?? slugify(match[1]);
        const seen = counts.get(base) ?? 0;
        counts.set(base, seen + 1);
        anchors.add(seen === 0 ? base : `${base}-${seen}`);
    }
    return anchors;
}

function internalLinks(source) {
    const links = [];
    const pattern = /(?:\[[^\]]*\]\(|href=["'])(\/en\/[A-Za-z0-9@_./#-]*)/g;
    for (const match of source.matchAll(pattern)) links.push(match[1]);
    return links;
}

const markdownFiles = collectFiles(contentRoot, '.md');
const pages = new Map(markdownFiles.map((file) => {
    const source = readFileSync(file, 'utf8');
    return [routeFor(file), { file, source, anchors: anchorsFor(source) }];
}));

function resolveRoute(path) {
    if (pages.has(path)) return path;
    if (path.endsWith('/index') && pages.has(path.slice(0, -5))) return path.slice(0, -5);
    if (path.endsWith('/') && pages.has(path.slice(0, -1))) return path.slice(0, -1);
    if (!path.endsWith('/') && pages.has(`${path}/`)) return `${path}/`;
    return null;
}

for (const [sourceRoute, page] of pages) {
    if (sourceRoute.startsWith('/en/api/')) continue;
    for (const link of internalLinks(page.source)) {
        const [path, fragment] = link.split('#');
        const targetRoute = resolveRoute(path || sourceRoute);
        if (!targetRoute) {
            errors.push(`${relative(projectRoot, page.file)}: missing internal target ${link}`);
            continue;
        }
        if (fragment && !pages.get(targetRoute).anchors.has(fragment)) {
            errors.push(`${relative(projectRoot, page.file)}: missing anchor ${link}`);
        }
    }
}

const redirectsBySource = new Map();
for (const redirect of site.redirects) {
    if (redirectsBySource.has(redirect.from)) errors.push(`duplicate redirect source ${redirect.from}`);
    redirectsBySource.set(redirect.from, redirect.to);
    if (!resolveRoute(redirect.from)) errors.push(`redirect source page is missing: ${redirect.from}`);
    if (!resolveRoute(redirect.to)) errors.push(`redirect target page is missing: ${redirect.to}`);
    if (redirect.from === redirect.to) errors.push(`redirect points to itself: ${redirect.from}`);
}

const packageRoot = resolve(workspaceRoot, 'connectum/packages');
const publicPackages = readdirSync(packageRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => JSON.parse(readFileSync(resolve(packageRoot, entry.name, 'package.json'), 'utf8')))
    .filter((pkg) => pkg.private !== true)
    .map((pkg) => pkg.name)
    .sort();
const registryNames = publicModules.map((module) => module.name).sort();

if (JSON.stringify(publicPackages) !== JSON.stringify(registryNames)) {
    errors.push(`module registry mismatch:\n  packages: ${publicPackages.join(', ')}\n  registry: ${registryNames.join(', ')}`);
}

const seenSlugs = new Set();
for (const module of publicModules) {
    if (seenSlugs.has(module.slug)) errors.push(`duplicate module slug: ${module.slug}`);
    seenSlugs.add(module.slug);
    if (!resolveRoute(module.hub)) errors.push(`${module.name}: missing package hub ${module.hub}`);
    if (!resolveRoute(module.api)) errors.push(`${module.name}: missing generated API destination ${module.api}`);
    if (!resolveRoute(module.guide)) errors.push(`${module.name}: missing guide destination ${module.guide}`);
}

const navigationSource = readFileSync(resolve(projectRoot, '.vitepress/config/en.ts'), 'utf8');
for (const redirect of site.redirects) {
    if (navigationSource.includes(`link: '${redirect.from}'`) || navigationSource.includes(`link: "${redirect.from}"`)) {
        errors.push(`compatibility route remains in primary navigation: ${redirect.from}`);
    }
}

if (!/^\d+\.\d+\.x$/.test(site.documentedVersion)) {
    errors.push(`documentedVersion must be a release line such as 1.2.x, got ${site.documentedVersion}`);
}

if (checkBuiltOutputs) {
    const requiredOutputs = ['sitemap.xml', 'hashmap.json', 'llms.txt', 'llms-full.txt', 'en.md'];
    for (const output of requiredOutputs) {
        if (!existsSync(resolve(buildRoot, output))) errors.push(`missing built output: ${output}`);
    }

    if (errors.length === 0) {
        const sitemap = readFileSync(resolve(buildRoot, 'sitemap.xml'), 'utf8');
        const search = JSON.parse(readFileSync(resolve(buildRoot, 'hashmap.json'), 'utf8'));
        const llms = `${readFileSync(resolve(buildRoot, 'llms.txt'), 'utf8')}\n${readFileSync(resolve(buildRoot, 'llms-full.txt'), 'utf8')}`;

        for (const route of ['/en/', '/en/guide/quickstart', '/en/packages/', '/en/reference/', '/en/guide/runtime-compatibility', '/en/migration/']) {
            if (!sitemap.includes(`https://connectum.dev${route}`)) errors.push(`sitemap missing canonical route ${route}`);
        }

        const searchKeys = Object.keys(search);
        const expectedSearchKeys = [
            'en_guide_quickstart.md',
            'en_guide_runtime-compatibility.md',
            'en_reference_index.md',
            'en_api_@connectum_auth_interfaces_jwtauthinterceptoroptions.md',
            'en_api_@connectum_core_types_interfaces_createserveroptions.md',
        ];
        for (const key of expectedSearchKeys) {
            if (!searchKeys.includes(key)) errors.push(`local search missing ${key}`);
        }

        for (const phrase of ['Build your first service', 'Runtime Compatibility', 'JwtAuthInterceptorOptions']) {
            if (!llms.toLowerCase().includes(phrase.toLowerCase())) errors.push(`LLM outputs missing ${phrase}`);
        }
    }
}

if (errors.length > 0) {
    process.stderr.write(`Documentation validation failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join('\n')}\n`);
    process.exit(1);
}

process.stdout.write(
    `Documentation validation passed: ${markdownFiles.length} pages, ${publicModules.length} public modules${checkBuiltOutputs ? ', built outputs checked' : ''}.\n`,
);
