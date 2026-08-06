import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import CopyOrDownloadAsMarkdownButtons from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue';
import Layout from './Layout.vue';
import CatalogRoutingDiagram from './components/CatalogRoutingDiagram.vue';
import RuntimeCompositionDiagram from './components/RuntimeCompositionDiagram.vue';
import './custom.css';

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons);
        app.component('CatalogRoutingDiagram', CatalogRoutingDiagram);
        app.component('RuntimeCompositionDiagram', RuntimeCompositionDiagram);
    },
} satisfies Theme;
