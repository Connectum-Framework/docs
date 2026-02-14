import { defineConfig } from 'vitepress';
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms';

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
    ],
    themeConfig: {
        logo: '/assets/name.png',
        siteTitle: false,
    },
    markdown: {
        lineNumbers: true,
        config(md) {
            md.use(copyOrDownloadAsMarkdownButtons);
        },
    },
    cleanUrls: true,
    sitemap: {
        hostname: 'https://connectum.dev',
    },
    vite: {
        plugins: [llmstxt({
            ignoreFiles: ['ru/*', 'ru.md', 'index.md', 'README.md'],
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
