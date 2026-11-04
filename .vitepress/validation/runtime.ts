import { fromJson } from '@bufbuild/protobuf';
import { pathToString } from '@bufbuild/protobuf/reflect';
import type { Validator } from '@bufbuild/protovalidate';
import { createValidator } from '@bufbuild/protovalidate';
import { Code, ConnectError } from '@connectrpc/connect';
import { checkStock } from './example/src/inventory.ts';
import type { CheckStockRequest } from './gen/shop/v1/inventory_pb.ts';
import { CheckStockRequestSchema } from './gen/shop/v1/inventory_pb.ts';
import type { Evaluation, ValidationInput } from './model.ts';

const validator = createValidator();

export function evaluateInput(input: ValidationInput, engine: Validator = validator): Evaluation {
    const quantity = input.quantity.trim();
    // Keep incomplete edits out of protobuf: Number('') would silently become zero.
    if (!/^-?\d+$/.test(quantity)) {
        return {
            kind: 'input-error',
            validation: 'not-run',
            handlerCalls: 0,
            code: 'Input error',
            message: 'Enter a whole number before checking the proto rules.',
            issues: [{ field: 'quantity', message: quantity ? 'Enter a whole number.' : 'Enter a quantity.' }],
        };
    }
    let request: CheckStockRequest;
    try {
        // The protobuf decoder enforces int32 representability, not the gt rule.
        request = fromJson(CheckStockRequestSchema, { sku: input.sku, quantity });
    } catch (error) {
        return {
            kind: 'input-error',
            validation: 'not-run',
            handlerCalls: 0,
            code: 'Input error',
            message: 'This input cannot be decoded as a protobuf message.',
            issues: [{ field: 'quantity', message: error instanceof Error ? error.message : String(error) }],
        };
    }
    const result = engine.validate(CheckStockRequestSchema, request);
    if (result.kind === 'error') {
        return { kind: 'runtime-error', validation: 'error', handlerCalls: 0, code: 'Validator error', issues: [], message: result.error.message };
    }
    if (result.kind === 'invalid') {
        return {
            kind: 'invalid',
            validation: 'failed',
            handlerCalls: 0,
            code: 'InvalidArgument',
            message: 'The proto rules reject this request. The handler does not run.',
            issues: result.violations.map((violation) => ({ field: pathToString(violation.field), rule: violation.ruleId, message: violation.message })),
        };
    }
    try {
        const response = checkStock(request);
        return {
            kind: 'valid',
            validation: 'passed',
            handlerCalls: 1,
            code: 'OK',
            issues: [],
            response,
            message: `The request passes validation. The example inventory has ${response.units} units of ${request.sku}.`,
        };
    } catch (error) {
        if (!(error instanceof ConnectError)) throw error;
        return { kind: 'business-error', validation: 'passed', handlerCalls: 1, code: Code[error.code], issues: [], message: error.rawMessage };
    }
}
