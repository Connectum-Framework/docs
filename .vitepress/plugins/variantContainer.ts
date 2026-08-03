/**
 * Factory for the site's "one document, several audiences" markdown containers.
 *
 * Both switchers on this site -- runtime (Node.js | Bun) and package manager
 * (npm | pnpm | bun) -- work the same way: every variant is rendered into the static
 * HTML as ordinary markdown, and only CSS, driven by an attribute on `<html>`, decides
 * which one is visible. That keeps all variants in the local search index, in
 * `llms.txt` and in front of crawlers, and it means server-rendered and client-rendered
 * markup are identical, so hydration can never mismatch.
 *
 * The generated markup is:
 *
 *   <div class="<prefix>-group">
 *     <div class="<prefix>-tabs"><button data-<prefix>-value="...">…</button>…</div>
 *     <div class="<prefix>-panel" data-<prefix>-value="...">…rendered markdown…</div>
 *     …
 *   </div>
 *
 * Visibility keys off the `data-<prefix>-value` attribute rather than a class added by
 * component logic, because search-result previews mount a page without `enhanceApp` --
 * global components do not resolve there, but attributes in the markup still do.
 */

const MARKER = 0x3a; /* ':' */
const MIN_MARKER_LEN = 3;

/** Minimal structural view of markdown-it's block state -- avoids a @types/markdown-it dependency. */
export interface StateBlock {
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

export interface Token {
    content: string;
    markup: string;
    block: boolean;
    map: [number, number] | null;
    hidden: boolean;
}

export interface MarkdownItLike {
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

/** One `== <value>` section of a container, with its body already sliced out. */
export interface Section<V extends string> {
    value: V;
    start: number;
    end: number;
    /** Body lines, verbatim, for validation hooks. */
    lines: string[];
}

export interface VariantContainerOptions<V extends string> {
    /** Container name as written in markdown: `::: runtime`, `::: pm`. */
    name: string;
    /** Prefix for CSS classes and the `data-*-value` attribute. */
    prefix: string;
    values: readonly V[];
    labels: Record<V, string>;
    /** Fail the build when a grouped block omits any value. */
    requireAll?: boolean;
    /** Allow `::: <name> <value>` blocks that target a single value. */
    allowSingle?: boolean;
    /** Extra per-block validation. `fail` throws with the file and line prefixed. */
    validate?: (sections: Section<V>[], fail: (message: string) => never) => void;
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

/**
 * Walks the container body, skipping fenced code and nested containers, and calls
 * `onLine` for every line that belongs to the container itself.
 */
function walkBody(
    state: StateBlock,
    bodyStart: number,
    bodyEnd: number,
    onLine: (text: string, line: number, insideNested: boolean) => void,
): void {
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
        onLine(text, line, depth > 0);
    }
}

export function createVariantContainer<V extends string>(options: VariantContainerOptions<V>) {
    const { name, prefix, values, labels, requireAll, allowSingle, validate } = options;
    const tokenType = `${prefix}_html`;
    const isValue = (candidate: string): candidate is V => (values as readonly string[]).includes(candidate);

    /**
     * Headings inside a block would land in the page outline twice, produce suffixed
     * anchors (`#install-1`) for the second variant and break scroll-spy on the hidden
     * panel. Keep the heading above the block and put only the bodies inside.
     */
    const assertNoHeadings = (state: StateBlock, bodyStart: number, bodyEnd: number, fail: (m: string) => never) => {
        walkBody(state, bodyStart, bodyEnd, (text) => {
            if (/^#{1,6}\s/.test(text)) {
                fail(
                    `headings are not allowed inside "::: ${name}" (found "${text}").\n` +
                        'Keep the heading above the block and put only the variant-specific body inside it.',
                );
            }
        });
    };

    const splitSections = (
        state: StateBlock,
        bodyStart: number,
        bodyEnd: number,
        fail: (m: string) => never,
    ): Section<V>[] => {
        const sections: Section<V>[] = [];

        walkBody(state, bodyStart, bodyEnd, (text, line, insideNested) => {
            if (insideNested) return;
            const match = /^==\s*(\S+)\s*$/.exec(text);
            if (!match) return;

            const candidate = match[1];
            if (!isValue(candidate)) {
                fail(`unknown ${name} "${candidate}" -- expected one of ${values.join(', ')}.`);
            }
            if (sections.some((section) => section.value === candidate)) {
                fail(`${name} "${candidate}" appears twice in the same block.`);
            }
            if (sections.length) sections[sections.length - 1].end = line;
            sections.push({ value: candidate, start: line + 1, end: bodyEnd, lines: [] });
        });

        for (const section of sections) {
            section.lines = [];
            for (let line = section.start; line < section.end; line++) {
                section.lines.push(lineText(state, line));
            }
        }

        // Keep the tab order canonical regardless of authoring order.
        return sections.sort((a, b) => values.indexOf(a.value) - values.indexOf(b.value));
    };

    const openTag = (state: StateBlock, html: string): void => {
        const token = state.push(tokenType, '', 0);
        token.content = html;
        token.block = true;
        token.markup = '';
    };

    const renderSections = (state: StateBlock, sections: Section<V>[], grouped: boolean): void => {
        if (grouped) {
            const tabs = sections
                .map(
                    ({ value }) =>
                        `<button type="button" class="${prefix}-tab" data-${prefix}-value="${value}"` +
                        ` aria-label="Show ${labels[value]} instructions">${labels[value]}</button>`,
                )
                .join('');
            openTag(state, `<div class="${prefix}-group"><div class="${prefix}-tabs">${tabs}</div>`);
        }

        for (const section of sections) {
            const label = grouped ? '' : `<div class="${prefix}-only-label">${labels[section.value]}</div>`;
            const className = grouped ? `${prefix}-panel` : `${prefix}-panel ${prefix}-only`;
            openTag(state, `<div class="${className}" data-${prefix}-value="${section.value}">${label}`);
            state.md.block.tokenize(state, section.start, section.end);
            openTag(state, '</div>');
        }

        if (grouped) openTag(state, '</div>');
    };

    return function variantContainerPlugin(md: MarkdownItLike): void {
        md.block.ruler.before(
            'fence',
            `container_${name}`,
            (state, startLine, endLine, silent) => {
                // Four-space indent means "code block", not a container.
                if (state.sCount[startLine] - state.blkIndent >= 4) return false;

                const openText = lineText(state, startLine);
                const openLen = markerLength(openText);
                if (openLen < MIN_MARKER_LEN) return false;

                const params = openText.slice(openLen).trim();
                const [containerName, ...rest] = params.split(/\s+/);
                if (containerName !== name) return false;
                if (silent) return true;

                const file = state.env?.relativePath ?? '<unknown file>';
                const fail = (message: string): never => {
                    throw new Error(`[${name}-container] ${file}:${startLine + 1}: ${message}`);
                };

                const explicit = rest[0];
                if (explicit !== undefined) {
                    if (!allowSingle) {
                        fail(
                            `"::: ${name} ${explicit}" is not supported -- write a grouped block with ` +
                                `${values.map((v) => `"== ${v}"`).join(' / ')} sections instead.`,
                        );
                    }
                    if (!isValue(explicit)) {
                        fail(`unknown ${name} "${explicit}" -- expected one of ${values.join(', ')}.`);
                    }
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

                const bodyEnd = Math.min(nextLine, endLine);
                assertNoHeadings(state, startLine + 1, bodyEnd, fail);

                let sections: Section<V>[];
                if (explicit !== undefined && isValue(explicit)) {
                    const lines: string[] = [];
                    for (let line = startLine + 1; line < bodyEnd; line++) lines.push(lineText(state, line));
                    sections = [{ value: explicit, start: startLine + 1, end: bodyEnd, lines }];
                } else {
                    sections = splitSections(state, startLine + 1, bodyEnd, fail);
                    if (!sections.length) {
                        fail(
                            `"::: ${name}" has no ${values.map((v) => `"== ${v}"`).join(' / ')} sections. ` +
                                'A block with nothing to switch between should be a plain block.',
                        );
                    }
                    if (requireAll) {
                        const missing = values.filter((value) => !sections.some((s) => s.value === value));
                        if (missing.length) {
                            fail(
                                `"::: ${name}" is missing ${missing.map((v) => `"== ${v}"`).join(', ')}. ` +
                                    'Every variant must be filled in, so a reader never lands on an empty tab.',
                            );
                        }
                    }
                    validate?.(sections, fail);
                }

                const oldParent = state.parentType;
                const oldLineMax = state.lineMax;
                state.parentType = `container_${name}`;
                state.lineMax = bodyEnd;

                renderSections(state, sections, explicit === undefined && sections.length > 1);

                state.parentType = oldParent;
                state.lineMax = oldLineMax;
                state.line = bodyEnd + (nextLine < endLine ? 1 : 0);

                return true;
            },
            { alt: ['paragraph', 'reference', 'blockquote', 'list'] },
        );

        // The tokens above carry ready-made HTML.
        md.renderer.rules[tokenType] = (tokens, idx) => tokens[idx].content;
    };
}
