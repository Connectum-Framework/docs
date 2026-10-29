import type { Interceptor } from '@connectrpc/connect';

export function createAudit(write: (entry: string) => void): Interceptor {
    return (next) => async (req) => {
        write('audit: before');
        const response = await next(req);
        const source = response.header.get('x-stock-source');
        write(`audit: after (header = ${source ?? 'unset'})`);
        return response;
    };
}
