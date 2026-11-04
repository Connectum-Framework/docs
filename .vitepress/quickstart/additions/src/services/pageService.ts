import { defineService } from '@connectum/core';
import { PageService } from '#gen/page/v1/page_pb.ts';

export const pageService = defineService(PageService, {
    getPage: () => ({
        title: 'Your private page',
        body: 'This content requires a verified JWT.',
    }),
});
