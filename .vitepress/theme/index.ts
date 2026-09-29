import elkLayouts from '@mermaid-js/layout-elk';
import mermaid from 'mermaid';
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import CopyOrDownloadAsMarkdownButtons from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue';
import Layout from './Layout.vue';
import CatalogRoutingDiagram from './components/CatalogRoutingDiagram.vue';
import RuntimeCompositionDiagram from './components/RuntimeCompositionDiagram.vue';
import './custom.css';

/**
 * Mermaid 11 keeps only dagre in its core; every other layout engine arrives as a
 * separate package. `layout: 'elk'` in the shared configuration is inert until the
 * engine is registered here, and `vitepress-plugin-mermaid` offers no hook for it --
 * it imports `mermaid` itself and calls `initialize`/`render`.
 *
 * Two properties make this the right place. The call is synchronous, writing the
 * loader into Mermaid's registry while the ELK chunk (about 440 KB gzip) stays behind
 * a dynamic import until the first diagram renders; and the theme module is evaluated before
 * any `Mermaid.vue` mounts, so registration always precedes the first render.
 *
 * If this ever stops taking effect -- a duplicate `mermaid` instance from dependency
 * pre-bundling would do it -- Mermaid falls back to dagre and says nothing at the
 * default log level. The symptom is diagonal edges, not an error.
 */
mermaid.registerLayoutLoaders(elkLayouts);

/**
 * Mermaid listens for the window `load` event and, while its own `startOnLoad` default
 * is still on, renders every `.mermaid` element from that element's text. Here those
 * elements are `vitepress-plugin-mermaid` containers with no diagram source in them, so
 * the auto-render paints Mermaid's "Syntax error in text" into each one. The plugin
 * turns the default off only inside its first render -- too late for `load` -- and then
 * overwrites the error when that render finishes. With dagre the error lasted a single
 * frame; with ELK the first render waits for the engine chunk, and the error stays on
 * screen until the chunk has arrived. Diagrams here are rendered by the plugin only.
 */
mermaid.startOnLoad = false;

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons);
        app.component('CatalogRoutingDiagram', CatalogRoutingDiagram);
        app.component('RuntimeCompositionDiagram', RuntimeCompositionDiagram);
    },
} satisfies Theme;
