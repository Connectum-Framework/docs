import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import json from 'shiki/langs/json.mjs';
import dark from 'shiki/themes/github-dark.mjs';
import light from 'shiki/themes/github-light.mjs';

const highlighter = createHighlighterCore({ engine: createJavaScriptRegexEngine(), langs: [json], themes: [light, dark] });

export async function renderOutput(source: string): Promise<string> {
    const engine = await highlighter;
    const pre = engine.codeToHtml(source, {
        lang: 'json',
        themes: { light: light.name, dark: dark.name },
        defaultColor: false,
        transformers: [
            {
                pre(node) {
                    this.addClassToHast(node, 'vp-code');
                },
            },
        ],
    });
    const lines = source
        .split('\n')
        .map((_, index) => `<span class="line-number">${index + 1}</span><br>`)
        .join('');
    // keep VitePress's markup contract: its delegated Copy Code reads this actual pre.
    return `<div class="language-json vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">json</span>${pre}<div class="line-numbers-wrapper" aria-hidden="true">${lines}</div></div>`;
}
