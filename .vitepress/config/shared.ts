import { defineConfig } from 'vitepress';
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms';
import { pmContainerPlugin } from '../plugins/pmContainer.js';
import { runtimeContainerPlugin } from '../plugins/runtimeContainer.js';
import { DEFAULT_PACKAGE_MANAGER, PACKAGE_MANAGER_STORAGE_KEY, PACKAGE_MANAGERS } from '../theme/packageManager.js';
import { DEFAULT_RUNTIME, RUNTIME_STORAGE_KEY, RUNTIMES } from '../theme/runtime.js';

/**
 * Applies the stored selection before the first paint, the same way VitePress restores
 * the dark-mode class -- otherwise a reader who picked Bun would see a flash of Node
 * content. A query parameter wins over the stored value so a link can carry the choice,
 * and is then persisted so it survives navigation.
 *
 * Both switchers get the same treatment from one generator: the runtime (what executes
 * the code) and the package manager (what installs it) are independent selections.
 */
const restoreSelection = (param: string, attribute: string, key: string, values: readonly string[], fallback: string) =>
    `;(() => {
  var VALUES = ${JSON.stringify(values)}
  try {
    var fromUrl = new URLSearchParams(location.search).get('${param}')
    var shared = VALUES.indexOf(fromUrl) !== -1 ? fromUrl : null
    var stored = shared || localStorage.getItem('${key}')
    document.documentElement.dataset.${attribute} = VALUES.indexOf(stored) !== -1 ? stored : '${fallback}'
    if (shared) localStorage.setItem('${key}', shared)
  } catch (e) {
    document.documentElement.dataset.${attribute} = '${fallback}'
  }
})()`;

const restoreRuntimeScript = restoreSelection('runtime', 'runtime', RUNTIME_STORAGE_KEY, RUNTIMES, DEFAULT_RUNTIME);

const restorePackageManagerScript = restoreSelection(
    'pm',
    'pm',
    PACKAGE_MANAGER_STORAGE_KEY,
    PACKAGE_MANAGERS,
    DEFAULT_PACKAGE_MANAGER,
);

export const sharedConfig = defineConfig({
    title: 'Connectum',
    description: 'Production-ready gRPC/ConnectRPC framework for Node.js',
    head: [
        /* Favicons, generated from public/assets/favicon.svg by scripts/generate-favicons.mjs.
           The SVG is listed first for browsers that take it; the 32px PNG is the fallback,
           and /favicon.ico answers the unprompted request every browser still makes. */
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
        ['link', { rel: 'manifest', href: '/site.webmanifest' }],
        ['meta', { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' }],
        ['meta', { name: 'theme-color', content: '#1b1b1f', media: '(prefers-color-scheme: dark)' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'Connectum' }],
        ['meta', { property: 'og:description', content: 'Production-ready gRPC/ConnectRPC framework for Node.js' }],
        ['meta', { property: 'og:image', content: 'https://connectum.dev/assets/splash.png' }],
        ['meta', { property: 'og:url', content: 'https://connectum.dev' }],
        ['meta', { property: 'og:site_name', content: 'Connectum' }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:image', content: 'https://connectum.dev/assets/splash.png' }],
        ['script', { id: 'restore-runtime' }, restoreRuntimeScript],
        ['script', { id: 'restore-pm' }, restorePackageManagerScript],
    ],
    themeConfig: {
        logo: '/assets/connectum-wordmark-animated.svg?v=2',
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
            md.use(pmContainerPlugin);
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
