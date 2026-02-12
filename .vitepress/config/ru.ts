import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress';

export const ruConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
    title: 'Connectum',
    description: 'Production-ready gRPC/ConnectRPC фреймворк для Node.js',
    themeConfig: {
        nav: [
            { text: 'Руководство', link: '/ru/' },
        ],
        sidebar: {},
        outline: {
            label: 'На этой странице',
        },
        docFooter: {
            prev: 'Предыдущая',
            next: 'Следующая',
        },
        lastUpdated: {
            text: 'Обновлено',
        },
        returnToTopLabel: 'Наверх',
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Тема',
    },
};
