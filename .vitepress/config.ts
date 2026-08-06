import { withMermaid } from 'vitepress-plugin-mermaid';
import { enConfig } from './config/en.js';
import { mermaidConfig } from './config/mermaid.js';
import { sharedConfig } from './config/shared.js';

export default withMermaid({
    ...sharedConfig,
    locales: {
        en: { label: 'English', lang: 'en', ...enConfig },
    },
    mermaid: mermaidConfig,
});
