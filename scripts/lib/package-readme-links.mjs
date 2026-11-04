import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { canonicalDocumentationLink } from '../../.vitepress/data/redirects.ts';
import { movedInterceptorSections } from '../../.vitepress/guide/interceptor-sections.ts';
import { movedTestingSections } from '../../.vitepress/guide/testing-sections.ts';

const movedSections = [
    ...movedInterceptorSections.map((entry) => ({ ...entry, from: '/en/guide/interceptors/built-in' })),
    ...movedTestingSections.map((entry) => ({ ...entry, from: '/en/guide/testing' })),
];

export function documentationTargets(url) {
    const targets = [url];
    for (;;) {
        const current = targets.at(-1);
        const from = current.pathname.replace(/\.html$/, '').replace(/\/$/, '');
        const move = movedSections.find((entry) => entry.from === from && `#${entry.id}` === current.hash);
        const destination = move?.to ?? canonicalDocumentationLink(`${current.pathname}${current.hash}`);
        const next = new URL(destination, current);
        next.search = current.search;
        if (next.href === current.href) return targets;
        if (targets.some((target) => target.href === next.href)) throw new Error(`Compatibility redirect cycle at ${next.href}`);
        targets.push(next);
    }
}

export async function checkDocumentationLink({ siteRoot, url, siteUrl, fetchPage }) {
    const targets = documentationTargets(url);
    for (const target of targets) {
        const file = builtSiteTarget(siteRoot, target);
        if (!file) return { ok: false, reason: 'missing built route', target: target.href };
        if (!htmlHasFragment(readFileSync(file, 'utf8'), target.hash.slice(1))) return { ok: false, reason: 'missing built fragment', target: target.href };
        if (siteUrl) {
            const live = new URL(`${target.pathname}${target.search}${target.hash}`, siteUrl);
            const result = await checkHttpLink(live, fetchPage);
            if (!result.ok) return result;
        }
    }
    return { ok: true, target: targets.at(-1).href, chain: targets.map((target) => target.href) };
}

export function markdownLinks(markdown, source) {
    const links = [];
    const walk = (tokens) => {
        for (const token of tokens) {
            const href = token.attrGet?.(token.type === 'image' ? 'src' : 'href');
            if (href && token.attrGet?.('class') !== 'header-anchor') links.push(href);
            if (token.type.startsWith('html')) {
                for (const match of token.content.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) links.push(markdown.utils.unescapeAll(match[1]));
            }
            if (token.children) walk(token.children);
        }
    };
    walk(markdown.parse(source, {}));
    return [...new Set(links)];
}

export function htmlHasFragment(html, fragment) {
    if (!fragment || fragment === 'top' || fragment.startsWith(':~:text=')) return true;
    const decoded = decodeURIComponent(fragment);
    return [...html.matchAll(/\b(?:id|name)=["']([^"']*)["']/g)].some((match) => match[1] === decoded || match[1] === `user-content-${decoded}`);
}

export function builtSiteTarget(siteRoot, url) {
    const path = resolve(siteRoot, `.${decodeURIComponent(url.pathname)}`);
    return [path, `${path}.html`, resolve(path, 'index.html')].find((file) => existsSync(file) && statSync(file).isFile());
}

function markdownHasFragment(markdown, source, fragment) {
    if (!fragment || fragment === 'top') return true;
    if (htmlHasFragment(source, fragment)) return true;
    const counts = new Map();
    const tokens = markdown.parse(source, {});
    return tokens.some((token, index) => {
        if (token.type !== 'heading_open') return false;
        let visible = '';
        let permalink = false;
        for (const child of tokens[index + 1].children ?? []) {
            if (child.type === 'link_open' && child.attrGet('class') === 'header-anchor') permalink = true;
            else if (child.type === 'link_close') permalink = false;
            else if (!permalink && ['text', 'code_inline', 'image'].includes(child.type)) visible += child.content;
        }
        const heading = visible
            .replace(/<[^>]*>/g, '')
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{M}\p{N}_\-\s]/gu, '')
            .replace(/\s/g, '-');
        const count = counts.get(heading) ?? 0;
        counts.set(heading, count + 1);
        return `${heading}${count ? `-${count}` : ''}` === decodeURIComponent(fragment);
    });
}

export function checkLocalLink({ markdown, root, readme, href }) {
    const url = new URL(href, `file://${readme}`);
    const file = href.startsWith('/') ? resolve(root, `.${decodeURIComponent(url.pathname)}`) : decodeURIComponent(url.pathname);
    if (!existsSync(file)) return { ok: false, reason: 'missing file', target: file };
    if (url.hash && statSync(file).isFile()) {
        const source = readFileSync(file, 'utf8');
        const ok = /\.md$/i.test(file) ? markdownHasFragment(markdown, source, url.hash.slice(1)) : htmlHasFragment(source, url.hash.slice(1));
        if (!ok) return { ok: false, reason: 'missing local fragment', target: file };
    }
    return { ok: true, target: file };
}

export async function checkHttpLink(url, fetchPage) {
    const { status, html, finalUrl } = await fetchPage(url);
    if (status < 200 || status >= 300) return { ok: false, reason: `HTTP ${status}`, target: finalUrl };
    if (url.hash && !htmlHasFragment(html, url.hash.slice(1))) return { ok: false, reason: 'missing HTTP fragment', target: finalUrl };
    return { ok: true, target: finalUrl };
}

export function packageReadmes(root, packages) {
    const collect = (directory) =>
        readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
            const path = resolve(directory, entry.name);
            if (entry.isDirectory() && !['node_modules', 'dist', '.turbo', '.tmp', '.git'].includes(entry.name)) return collect(path);
            return entry.isFile() && entry.name === 'README.md' ? [path] : [];
        });
    return packages.flatMap((name) => {
        const path = resolve(root, 'packages', name, 'README.md');
        if (!existsSync(path)) throw new Error(`Missing package README: ${dirname(path)}`);
        return collect(dirname(path));
    });
}
