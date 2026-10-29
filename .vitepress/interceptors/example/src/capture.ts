import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { Code, ConnectError, createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-node';
import type { RunResult } from '../../settings.ts';
import { chains, handlerOutcomes } from '../../settings.ts';
import { InventoryService } from '../gen/shop/v1/inventory_pb.ts';
import { createExampleServer } from './server.ts';

export async function captureInterceptors() {
    const records = [];
    for (const outcome of handlerOutcomes)
        for (const chain of chains) {
            const settings = { chain: chain.id, outcome: outcome.id };
            const events: string[] = [];
            let handlerCalls = 0;
            let sourceHeader: string | null = null;
            const server = createExampleServer(
                settings,
                (entry) => events.push(entry),
                () => {
                    handlerCalls++;
                },
            );
            await server.start();
            try {
                const client = createClient(InventoryService, createConnectTransport({ baseUrl: `http://127.0.0.1:${server.address?.port}`, httpVersion: '1.1' }));
                let result: RunResult;
                try {
                    const response = await client.checkStock(
                        { sku: outcome.sku },
                        {
                            onHeader(header) {
                                sourceHeader = header.get('x-stock-source');
                            },
                        },
                    );
                    result = { code: 'OK', events, handlerCalls, sourceHeader, response: { units: response.units } };
                } catch (error) {
                    if (!(error instanceof ConnectError)) throw error;
                    result = { code: Code[error.code], events, handlerCalls, sourceHeader, error: error.rawMessage };
                }
                records.push({ settings, result });
            } finally {
                await server.stop();
            }
        }
    const sources = Object.fromEntries(
        [
            'proto/shop/v1/inventory.proto',
            'src/audit.ts',
            'src/stockTag.ts',
            'src/chain.ts',
            'src/inventory.ts',
            'src/server.ts',
            'src/capture.ts',
            'package.json',
            'pnpm-lock.yaml',
            'buf.gen.yaml',
            '../settings.ts',
        ].map((path) => [
            path,
            createHash('sha256')
                .update(readFileSync(new URL(`../${path}`, import.meta.url)))
                .digest('hex'),
        ]),
    );
    return { transport: 'Connect over HTTP/1.1', sources, records };
}
