import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import json from 'shiki/langs/json.mjs';
import proto from 'shiki/langs/proto.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import yaml from 'shiki/langs/yaml.mjs';
import dark from 'shiki/themes/github-dark-high-contrast.mjs';
import light from 'shiki/themes/github-light-high-contrast.mjs';
import type { PreviewLine } from './types.ts';

export interface SyntaxToken {
    content: string;
    light: string;
    dark: string;
}

export type DiffHighlighter = (options: { path: string; before: string; after: string; rows: readonly PreviewLine[] }) => SyntaxToken[][];

const highlighter = createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    langs: [typescript, proto, json, yaml],
    // comments also need normal-text contrast over the shaded diff backgrounds.
    themes: [
        { ...light, tokenColors: [...(light.tokenColors ?? []), { scope: ['comment', 'punctuation.definition.comment', 'string.comment'], settings: { foreground: '#57606a' } }] },
        dark,
    ],
});

export async function createDiffHighlighter(): Promise<DiffHighlighter> {
    const engine = await highlighter;
    return ({ path, before, after, rows }) => {
        const language = path.endsWith('.ts') ? 'typescript' : path.endsWith('.proto') ? 'proto' : path.endsWith('.json') ? 'json' : /\.ya?ml$/.test(path) ? 'yaml' : 'text';
        const tokenize = (source: string) =>
            engine
                .codeToTokensWithThemes(source, { lang: language, themes: { light: light.name, dark: dark.name } })
                .map((line) => line.map((token) => ({ content: token.content, light: token.variants.light.color ?? '#24292f', dark: token.variants.dark.color ?? '#f0f6fc' })));
        // tokenize complete versions separately: removed lines must keep their original multiline grammar state.
        const original = tokenize(before);
        const current = tokenize(after);
        return rows.map((line) => {
            if (line.kind === 'gap') return [];
            const tokens = line.kind === 'removed' ? original[(line.beforeNumber ?? 1) - 1] : current[(line.number ?? 1) - 1];
            return tokens ?? [];
        });
    };
}
