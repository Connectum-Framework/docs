import site from './site.json' with { type: 'json' };

export interface DocumentationRedirect {
    from: string;
    to: string;
    fragments?: Record<string, string>;
}

export const documentationRedirects: readonly DocumentationRedirect[] = site.redirects.map((entry) => {
    const fragments: Record<string, string> = {};
    for (const [key, value] of Object.entries(entry.fragments ?? {})) if (typeof value === 'string') fragments[key] = value;
    return { from: entry.from, to: entry.to, fragments };
});
const normalize = (path: string) =>
    path
        .replace(/\.html$/, '')
        .replace(/\/index$/, '')
        .replace(/\/$/, '');

export function findRedirect(path: string): DocumentationRedirect | undefined {
    return documentationRedirects.find((entry) => normalize(entry.from) === normalize(path));
}

export function redirectTarget(entry: DocumentationRedirect, hash: string): string {
    let fragment = hash.replace(/^#/, '');
    try {
        fragment = decodeURIComponent(fragment);
    } catch {
        /* retain malformed legacy fragments as lookup keys */
    }
    const destination = entry.fragments?.[fragment];
    return typeof destination === 'string' ? destination : entry.to;
}

export function canonicalDocumentationLink(link: string): string {
    const [path, hash = ''] = link.split('#');
    const entry = findRedirect(path);
    return entry ? redirectTarget(entry, hash) : link;
}
