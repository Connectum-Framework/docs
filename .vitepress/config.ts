import { withMermaid } from 'vitepress-plugin-mermaid';
import { enConfig } from './config/en.js';
import { sharedConfig } from './config/shared.js';

export default withMermaid({
    ...sharedConfig,
    locales: {
        en: { label: 'English', lang: 'en', ...enConfig },
    },
    mermaid: {},
});
