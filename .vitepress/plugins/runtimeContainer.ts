/**
 * markdown-it plugin for the site-wide runtime switcher.
 *
 * Renders runtime-specific documentation as plain server-rendered markdown: every
 * variant ends up in the static HTML (so crawlers, the local search index and
 * `llms.txt` see all of them), and only CSS -- driven by `data-runtime` on `<html>` --
 * decides which one is visible.
 *
 * Two forms:
 *
 *   ::: runtime            <- grouped, one section per runtime
 *   == node
 *   ```bash
 *   node src/index.ts
 *   ```
 *   == bun
 *   ```bash
 *   bun src/index.ts
 *   ```
 *   :::
 *
 *   ::: runtime bun        <- single-runtime block, hidden unless Bun is selected
 *   Bun does not support X, use Y instead.
 *   :::
 *
 * Nesting follows the usual VitePress rule: an outer container needs more colons than
 * the inner one (`:::: runtime` wrapping a `::: tip`).
 */

import { DEFAULT_RUNTIME, RUNTIME_LABELS, RUNTIMES, type Runtime } from '../theme/runtime.ts';

const MARKER = 0x3a; /* ':' */
const MIN_MARKER_LEN = 3;
const NAME = 'runtime';

/** Minimal structural view of markdown-it's block state -- avoids a @types/markdown-it dependency. */
interface StateBlock {
    src: string;
    env?: { relativePath?: string };
    bMarks: number[];
    eMarks: number[];
    tShift: number[];
    sCount: number[];
    blkIndent: number;
    line: number;
    lineMax: number;
    parentType: string;
    md: { block: { tokenize(state: StateBlock, start: number, end: number): void } };
    push(type: string, tag: string, nesting: number): Token;
}

interface Token {
    content: string;
    markup: string;
    block: boolean;
    map: [number, number] | null;
    hidden: boolean;
}

interface MarkdownItLike {
    block: {
        ruler: {
            before(
                beforeName: string,
                ruleName: string,
                rule: (state: StateBlock, startLine: number, endLine: number, silent: boolean) => boolean,
                options?: { alt: string[] },
            ): void;
        };
    };
    renderer: {
        rules: Record<string, ((tokens: Token[], idx: number) => string) | undefined>;
    };
}

interface Section {
    runtime: Runtime;
    start: number;
    end: number;
}

function lineText(state: StateBlock, line: number): string {
    return state.src.slice(state.bMarks[line] + state.tShift[line], state.eMarks[line]);
}

/** Number of leading `:` characters, or 0 when the line does not start a container. */
function markerLength(text: string): number {
    let len = 0;
    while (text.charCodeAt(len) === MARKER) len++;
    return len;
}

function isRuntimeName(value: string): value is Runtime {
    return (RUNTIMES as readonly string[]).includes(value);
}

/**
 * Splits the container body into per-runtime sections at `== <runtime>` lines,
 * ignoring markers inside fenced code blocks and nested containers.
 */
function splitSections(state: StateBlock, bodyStart: number, bodyEnd: number, logPrefix: string): Section[] {
    const sections: Section[] = [];
    let fence: string | null = null;
    let depth = 0;

    for (let line = bodyStart; line < bodyEnd; line++) {
        const text = lineText(state, line).trim();

        if (fence) {
            if (text.startsWith(fence)) fence = null;
            continue;
        }
        const fenceMatch = /^(`{3,}|~{3,})/.exec(text);
        if (fenceMatch) {
            fence = fenceMatch[1];
            continue;
        }

        const colons = markerLength(text);
        if (colons >= MIN_MARKER_LEN) {
            // An opening marker carries a name, a closing one does not.
            if (text.slice(colons).trim()) depth++;
            else if (depth > 0) depth--;
            continue;
        }
        if (depth > 0) continue;

        const sectionMatch = /^==\s*(\S+)\s*$/.exec(text);
        if (!sectionMatch) continue;

        const name = sectionMatch[1];
        if (!isRuntimeName(name)) {
            throw new Error(`${logPrefix} unknown runtime "${name}" -- expected one of ${RUNTIMES.join(', ')}.`);
        }
        if (sections.some((section) => section.runtime === name)) {
            throw new Error(`${logPrefix} runtime "${name}" appears twice in the same block.`);
        }
        if (sections.length) sections[sections.length - 1].end = line;
        sections.push({ runtime: name, start: line + 1, end: bodyEnd });
    }

    // Keep the tab order canonical (Node.js first) regardless of authoring order.
    return sections.sort((a, b) => RUNTIMES.indexOf(a.runtime) - RUNTIMES.indexOf(b.runtime));
}

/**
 * Headings inside a runtime block would land in the page outline twice, produce
 * suffixed anchors (`#install-1`) for the second variant and break scroll-spy on the
 * hidden panel. Keep headings outside the block and put only the bodies inside.
 */
function assertNoHeadings(state: StateBlock, bodyStart: number, bodyEnd: number, logPrefix: string): void {
    let fence: string | null = null;

    for (let line = bodyStart; line < bodyEnd; line++) {
        const text = lineText(state, line).trim();

        if (fence) {
            if (text.startsWith(fence)) fence = null;
            continue;
        }
        const fenceMatch = /^(`{3,}|~{3,})/.exec(text);
        if (fenceMatch) {
            fence = fenceMatch[1];
            continue;
        }
        if (/^#{1,6}\s/.test(text)) {
            throw new Error(
                `${logPrefix} headings are not allowed inside "::: ${NAME}" (found "${text}").\n` +
                    'Keep the heading above the block and put only the runtime-specific body inside it.',
            );
        }
    }
}

function openTag(state: StateBlock, html: string): void {
    const token = state.push('runtime_html', '', 0);
    token.content = html;
    token.block = true;
    token.markup = '';
}

function renderSections(state: StateBlock, sections: Section[], grouped: boolean): void {
    if (grouped) {
        const tabs = sections
            .map(
                ({ runtime }) =>
                    `<button type="button" class="runtime-tab" data-runtime-value="${runtime}"` +
                    ` aria-label="Show ${RUNTIME_LABELS[runtime]} instructions">${RUNTIME_LABELS[runtime]}</button>`,
            )
            .join('');
        openTag(state, `<div class="runtime-group"><div class="runtime-tabs">${tabs}</div>`);
    }

    for (const section of sections) {
        const { runtime, start, end } = section;
        const label = grouped ? '' : `<div class="runtime-only-label">${RUNTIME_LABELS[runtime]}</div>`;
        const className = grouped ? 'runtime-panel' : 'runtime-panel runtime-only';
        openTag(state, `<div class="${className}" data-runtime-value="${runtime}">${label}`);
        state.md.block.tokenize(state, start, end);
        openTag(state, '</div>');
    }

    if (grouped) openTag(state, '</div>');
}

export function runtimeContainerPlugin(md: MarkdownItLike): void {
    md.block.ruler.before(
        'fence',
        `container_${NAME}`,
        (state, startLine, endLine, silent) => {
            // Four-space indent means "code block", not a container.
            if (state.sCount[startLine] - state.blkIndent >= 4) return false;

            const openText = lineText(state, startLine);
            const openLen = markerLength(openText);
            if (openLen < MIN_MARKER_LEN) return false;

            const params = openText.slice(openLen).trim();
            const [name, ...rest] = params.split(/\s+/);
            if (name !== NAME) return false;

            if (silent) return true;

            const explicit = rest[0];
            if (explicit !== undefined && !isRuntimeName(explicit)) {
                throw new Error(
                    `[runtime-container] ${state.env?.relativePath ?? '<unknown file>'}:${startLine + 1}: ` +
                        `unknown runtime "${explicit}" -- expected one of ${RUNTIMES.join(', ')}.`,
                );
            }

            // Find the matching closing marker, honouring nested containers.
            let nextLine = startLine;
            let depth = 1;
            while (++nextLine < endLine) {
                const text = lineText(state, nextLine);
                if (state.sCount[nextLine] - state.blkIndent >= 4) continue;
                const len = markerLength(text.trimStart());
                if (len < openLen) continue;
                if (text.trimStart().slice(len).trim()) depth++;
                else if (--depth === 0) break;
            }

            const file = state.env?.relativePath ?? '<unknown file>';
            const logPrefix = `[runtime-container] ${file}:${startLine + 1}:`;
            const bodyEnd = Math.min(nextLine, endLine);
            assertNoHeadings(state, startLine + 1, bodyEnd, logPrefix);
            const sections = explicit
                ? [{ runtime: explicit, start: startLine + 1, end: bodyEnd }]
                : splitSections(state, startLine + 1, bodyEnd, logPrefix);

            if (!sections.length) {
                console.warn(
                    `${logPrefix} "::: ${NAME}" has no "== node" / "== bun" sections -- rendering as ${DEFAULT_RUNTIME}.`,
                );
                sections.push({ runtime: DEFAULT_RUNTIME, start: startLine + 1, end: bodyEnd });
            }

            const oldParent = state.parentType;
            const oldLineMax = state.lineMax;
            state.parentType = `container_${NAME}`;
            state.lineMax = bodyEnd;

            renderSections(state, sections, !explicit && sections.length > 1);

            state.parentType = oldParent;
            state.lineMax = oldLineMax;
            state.line = bodyEnd + (nextLine < endLine ? 1 : 0);

            return true;
        },
        { alt: ['paragraph', 'reference', 'blockquote', 'list'] },
    );

    // The tokens above carry ready-made HTML.
    md.renderer.rules.runtime_html = (tokens, idx) => tokens[idx].content;
}
