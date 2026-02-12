import { withMermaid } from 'vitepress-plugin-mermaid';
import { enConfig } from './config/en.js';
import { ruConfig } from './config/ru.js';
import { sharedConfig } from './config/shared.js';

export default withMermaid({
    ...sharedConfig,
    locales: {
        en: { label: 'English', lang: 'en', ...enConfig },
        ru: { label: 'Русский', lang: 'ru', ...ruConfig },
    },
    mermaid: {},
});
