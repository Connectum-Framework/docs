import { readFileSync } from 'node:fs';
import { createMarkdownRenderer } from 'vitepress';
import { runOverlay } from './runtime.ts';
import { annotations, initialSettings, methods, protoSource } from './settings.ts';

const loader = {
    watch: ['.vitepress/openapi/**/*.ts', '.vitepress/openapi/**/*.json', '.vitepress/openapi/example/proto/**/*.proto'],
    async load() {
        const markdown = await createMarkdownRenderer('.', { lineNumbers: true });
        const block = (source: string, language: string) => markdown.render(`\`\`\`${language}\n${source.trimEnd()}\n\`\`\``);
        const examples = [];
        for (const method of methods)
            for (const annotation of annotations) {
                const settings = { method: method.id, annotation: annotation.id };
                const result = runOverlay(settings);
                examples.push({
                    settings,
                    source: block(protoSource(settings), 'proto'),
                    kind: result.kind,
                    message: result.kind === 'rejected' ? result.message : '',
                    output: result.kind === 'rejected' ? '' : block(result.output, 'json'),
                });
            }
        const initial = runOverlay(initialSettings);
        if (initial.kind !== 'patched') throw new Error('The OpenAPI example must start with a successful overlay.');
        return {
            initial,
            initialOutput: block(initial.output, 'json'),
            initialFull: block(initial.fullOutput, 'json'),
            examples,
            overlaySource: block(readFileSync(new URL('./overlay.ts', import.meta.url), 'utf8'), 'typescript'),
            fullProto: block(readFileSync(new URL('./example/proto/shop/v1/inventory.proto', import.meta.url), 'utf8'), 'proto'),
            generation: block('pnpm openapi:generate\npnpm openapi:base\npnpm openapi:inspect --annotation roles', 'bash'),
        };
    },
};

export declare const data: Awaited<ReturnType<typeof loader.load>>;
export default loader;
