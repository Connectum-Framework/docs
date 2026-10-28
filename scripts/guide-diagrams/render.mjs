import { escapeHtml } from './primitives.mjs';

export const skin = `
.guide-overview-svg { --go-paper: #fff; --go-ink: #3c3c43; --go-muted: #67676c; --go-border: #6078aa; --go-accent: #3153a0; --go-tint: #eaf0ff; --go-zone: #f7f8fa; color: var(--go-ink); font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
.dark .guide-overview-svg, body:has(#guide-dark:checked) .guide-overview-svg { --go-paper: #1b1b1f; --go-ink: #dfdfd6; --go-muted: #a4a4ab; --go-border: #7f9cd4; --go-accent: #b9cdff; --go-tint: #202b43; --go-zone: #202127; }
.guide-overview-svg .go-surface { fill: var(--go-paper); stroke: var(--go-border); stroke-width: 1.2; }
.guide-overview-svg [data-focal] .go-surface { fill: var(--go-tint); stroke: var(--go-accent); stroke-width: 1.6; }
.guide-overview-svg [data-focal] .go-name { fill: var(--go-accent); }
.guide-overview-svg .go-fold { fill: none; stroke: var(--go-border); stroke-width: 1.2; }
.guide-overview-svg .go-zone > rect { fill: var(--go-zone); stroke: var(--go-border); stroke-width: .8; stroke-dasharray: 4 4; }
.guide-overview-svg .go-name { font-size: 16px; font-weight: 600; fill: var(--go-ink); }
.guide-overview-svg .go-heading { font-size: 14px; font-weight: 600; fill: var(--go-ink); }
.guide-overview-svg .go-detail { font-size: 12px; font-weight: 400; fill: var(--go-muted); }
.guide-overview-svg .go-tag { font: 11px ui-monospace, Menlo, Consolas, monospace; fill: var(--go-muted); }
.guide-overview-svg .go-edge { fill: none; stroke: var(--go-muted); stroke-width: 1.4; }
.guide-overview-svg .go-dashed { stroke-dasharray: 5 4; }
.guide-overview-svg .go-arrow { fill: var(--go-muted); }
.guide-overview-svg .go-label rect { fill: var(--go-paper); }
@media print { .guide-overview-svg, .dark .guide-overview-svg, body:has(#guide-dark:checked) .guide-overview-svg { --go-paper: #fff; --go-ink: #222; --go-muted: #555; --go-border: #6078aa; --go-accent: #3153a0; --go-tint: #eaf0ff; --go-zone: #f7f8fa; } }
`;

export function renderSvg(diagram) {
    const slug = diagram.key;
    return `<svg class="guide-overview-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${diagram.width} ${diagram.height}" role="img" aria-labelledby="${slug}-title ${slug}-desc" data-overview="${diagram.key}" data-visual-type="${diagram.type}">
<title id="${slug}-title">${escapeHtml(diagram.title)}</title>
<desc id="${slug}-desc">${escapeHtml(diagram.desc)}</desc>
<defs><style>${skin}</style><marker id="${slug}-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path class="go-arrow" d="M0 0L8 3L0 6Z"/></marker></defs>
${diagram.body.replaceAll('GUIDE_SLUG', slug)}
</svg>`;
}

export function renderHtml(diagram) {
    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(diagram.title)}</title>
<style>
* { box-sizing: border-box; } body { margin: 0; padding: 32px 24px; background: #fff; color: #3c3c43; font: 16px Inter, ui-sans-serif, system-ui, sans-serif; }
body:has(#guide-dark:checked) { background: #1b1b1f; color: #dfdfd6; color-scheme: dark; }
main { width: 100%; max-width: ${diagram.width}px; min-width: 0; margin: auto; } h1 { font: 400 28px Georgia, serif; }
figure { margin: 24px 0; } label { display: inline-flex; align-items: center; min-height: 44px; gap: 8px; cursor: pointer; }
.diagram-container { width: 100%; overflow-x: auto; } svg { display: block; width: 100%; min-width: ${diagram.width}px; }
figcaption { font-size: 14px; line-height: 1.6; margin-top: 16px; } :focus-visible { outline: 2px solid #6078aa; outline-offset: 4px; }
@media print { label { display: none; } .diagram-container { overflow-x: visible; } svg { min-width: 0; } }
</style></head><body><main><h1>${escapeHtml(diagram.title)}</h1><label><input id="guide-dark" type="checkbox">Dark theme</label><figure>
<section class="diagram-container" tabindex="0" aria-label="${escapeHtml(diagram.title)}; scroll horizontally">${renderSvg(diagram)}</section>
<figcaption>${escapeHtml(diagram.caption)}</figcaption></figure></main></body></html>\n`;
}
