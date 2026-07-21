import { defineConfig } from 'vitepress';
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms';
import { runtimeContainerPlugin } from '../plugins/runtimeContainer.js';
import { DEFAULT_RUNTIME, RUNTIME_STORAGE_KEY } from '../theme/runtime.js';

/**
 * Applies the stored runtime before the first paint, the same way VitePress restores the
 * dark-mode class -- otherwise a reader who picked Bun would see a flash of Node content.
 * `?runtime=bun` wins over the stored value so a link can carry the choice.
 */
const restoreRuntimeScript = `;(() => {
  try {
    const fromUrl = new URLSearchParams(location.search).get('runtime')
    const shared = fromUrl === 'node' || fromUrl === 'bun' ? fromUrl : null
    const stored = shared ?? localStorage.getItem('${RUNTIME_STORAGE_KEY}')
    document.documentElement.dataset.runtime = stored === 'bun' ? 'bun' : '${DEFAULT_RUNTIME}'
    if (shared) localStorage.setItem('${RUNTIME_STORAGE_KEY}', shared)
  } catch {
    document.documentElement.dataset.runtime = '${DEFAULT_RUNTIME}'
  }
})()`;

export const sharedConfig = defineConfig({
    title: 'Connectum',
    description: 'Production-ready gRPC/ConnectRPC framework for Node.js',
    head: [
        ['link', { rel: 'icon', type: 'image/png', href: '/assets/splash.png' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'Connectum' }],
        ['meta', { property: 'og:description', content: 'Production-ready gRPC/ConnectRPC framework for Node.js' }],
        ['meta', { property: 'og:image', content: 'https://connectum.dev/assets/splash.png' }],
        ['meta', { property: 'og:url', content: 'https://connectum.dev' }],
        ['meta', { property: 'og:site_name', content: 'Connectum' }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:image', content: 'https://connectum.dev/assets/splash.png' }],
        ['script', { id: 'restore-runtime' }, restoreRuntimeScript],
    ],
    themeConfig: {
        logo: '/assets/name.png',
        siteTitle: false,
        socialLinks: [
            { icon: 'github', link: 'https://github.com/Connectum-Framework/connectum' },
        ],
        search: {
            provider: 'local',
            options: {
                detailedView: true,
                locales: {},
            },
        },
        footer: {
            message: 'Released under the Apache License 2.0. · <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a>',
            copyright: 'Copyright <a href="https://highload.zone" target="_blank"><img src="https://highload.zone/images/favicon/favicon-32x32.png" alt="" style="display:inline;height:1em;vertical-align:middle;margin-right:4px">Highload.Zone</a>',
        },
    },
    markdown: {
        lineNumbers: true,
        config(md) {
            md.use(copyOrDownloadAsMarkdownButtons);
            md.use(runtimeContainerPlugin);
        },
    },
    srcExclude: ['**/api/_media/**'],
    ignoreDeadLinks: [
        /localhost/,
        /_media/,
    ],
    cleanUrls: true,
    sitemap: {
        hostname: 'https://connectum.dev',
    },
    vite: {
        plugins: [llmstxt({
            ignoreFiles: ['index.md', 'README.md'],
        })],
        build: {
            chunkSizeWarningLimit: 3000,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('mermaid')) return 'mermaid';
                    },
                },
            },
        },
    },
});
