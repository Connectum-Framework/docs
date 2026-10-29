export type ValidationInput = { sku: string; quantity: string };

export type FieldIssue = { field: string; message: string; rule?: string };

export type Evaluation = {
    kind: 'valid' | 'invalid' | 'input-error' | 'business-error' | 'runtime-error';
    issues: FieldIssue[];
    validation: 'passed' | 'failed' | 'not-run' | 'error';
    handlerCalls: number;
    code: string;
    message: string;
    response?: { units: number };
};
