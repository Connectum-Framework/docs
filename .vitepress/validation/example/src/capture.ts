import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { create } from '@bufbuild/protobuf';
import { pathToString } from '@bufbuild/protobuf/reflect';
import { createValidator } from '@bufbuild/protovalidate';
import { Code, ConnectError, createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-node';
import { validationScenarios } from '../../scenarios.ts';
import { CheckStockRequestSchema, InventoryService } from '../gen/shop/v1/inventory_pb.ts';
import { createExampleServer } from './server.ts';

export async function captureValidation() {
    const validator = createValidator();
    let handlerCalls = 0;
    const server = createExampleServer(() => {
        handlerCalls++;
    });
    await server.start();
    try {
        const client = createClient(InventoryService, createConnectTransport({ baseUrl: `http://127.0.0.1:${server.address?.port}`, httpVersion: '1.1' }));
        const records = [];
        for (const scenario of validationScenarios) {
            const before = handlerCalls;
            const request = { sku: scenario.sku, quantity: scenario.quantity };
            const local = validator.validate(CheckStockRequestSchema, create(CheckStockRequestSchema, request));
            if (local.kind === 'error') throw local.error;
            const validation = {
                passed: local.kind === 'valid',
                issues: local.violations?.map((issue) => ({ field: pathToString(issue.field), rule: issue.ruleId, message: issue.message })) ?? [],
            };
            try {
                const response = await client.checkStock(request);
                records.push({
                    id: scenario.id,
                    request,
                    validation,
                    handlerCalls: handlerCalls - before,
                    code: 'OK',
                    response: { units: response.units },
                });
            } catch (error) {
                if (!(error instanceof ConnectError)) throw error;
                records.push({
                    id: scenario.id,
                    request,
                    validation,
                    handlerCalls: handlerCalls - before,
                    code: Code[error.code],
                    error: { code: Code[error.code], message: error.rawMessage },
                });
            }
        }
        const sources = Object.fromEntries(
            [
                'proto/shop/v1/inventory.proto',
                'src/inventory.ts',
                'src/server.ts',
                'src/capture.ts',
                'package.json',
                'pnpm-lock.yaml',
                'buf.lock',
                'buf.gen.yaml',
                '../scenarios.ts',
            ].map((path) => [
                path,
                createHash('sha256')
                    .update(readFileSync(new URL(`../${path}`, import.meta.url)))
                    .digest('hex'),
            ]),
        );
        return { transport: 'Connect over HTTP/1.1', sources, records };
    } finally {
        await server.stop();
    }
}
