import { createMarkdownRenderer } from 'vitepress';
import { assemblyLayouts } from './assembly.ts';

const loader = {
    watch: ['.vitepress/catalog/assembly.ts'],
    async load() {
        // render at build time: the native code blocks also work without JS, and
        // no syntax-highlighting engine needs to ship with the catalog component.
        const markdown = await createMarkdownRenderer('.', { lineNumbers: true });
        return Object.fromEntries(assemblyLayouts.map((layout) => [layout.id, markdown.render(`\`\`\`typescript\n${layout.code}\n\`\`\``)]));
    },
};

export declare const data: Awaited<ReturnType<typeof loader.load>>;
export default loader;
