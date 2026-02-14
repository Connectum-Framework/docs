import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress';

export const ruConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
    title: 'Connectum',
    description: 'Production-ready gRPC/ConnectRPC фреймворк для Node.js',
    themeConfig: {
        nav: [
            { text: 'Руководство', link: '/en/guide/about' },
            { text: 'Пакеты', link: '/en/packages/core' },
            { text: 'Контрибьюторам', link: '/en/contributing/', activeMatch: '/en/contributing/' },
            { text: 'Примеры', link: 'https://github.com/Connectum-Framework/examples' },
        ],
        editLink: {
            pattern: 'https://github.com/Connectum-Framework/docs/edit/main/:path',
            text: 'Редактировать на GitHub',
        },
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
        footer: {
            message: 'Лицензия Apache 2.0. · <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a>',
            copyright: 'Copyright <a href="https://highload.zone" target="_blank"><img src="https://highload.zone/images/favicon/favicon-32x32.png" alt="" style="display:inline;height:1em;vertical-align:middle;margin-right:4px">Highload.Zone</a>',
        },
    },
};
