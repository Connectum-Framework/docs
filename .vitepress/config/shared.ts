import { defineConfig } from 'vitepress';
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms';

export const sharedConfig = defineConfig({
    title: 'Connectum',
    description: 'Production-ready gRPC/ConnectRPC framework for Node.js',
    head: [
        ['link', { rel: 'icon', type: 'image/png', href: '/assets/splash.png' }],
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
