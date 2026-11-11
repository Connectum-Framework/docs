import { resolve } from 'node:path';
import { createMarkdownRenderer, resolveConfig } from 'vitepress';

const config = await resolveConfig(resolve(import.meta.dirname, '../..'), 'build');
const markdown = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base);

export function slugify(value) {
    // Markdown distinguishes literal punctuation in code from emphasis delimiters.
    // Reuse VitePress's anchor tokens, including explicit IDs, without rendering HTML.
    const tokens = markdown.parse(`# ${value}\n`, { relativePath: 'en/index.md' });
    const anchor = tokens.find((token) => token.type === 'heading_open')?.attrGet('id');
    if (anchor == null) throw new Error(`Cannot derive a heading anchor: ${value}`);
    return anchor;
}
