export const validationScenarios = [
    {
        id: 'empty',
        label: 'Empty SKU',
        sku: '',
        explanation: 'The empty string violates the proto constraint. Validation rejects the request before the handler runs.',
    },
    {
        id: 'known',
        label: 'Known SKU',
        sku: 'A-1',
        explanation: 'The request passes validation. The handler looks up A-1 in the example inventory and returns its stock.',
    },
    {
        id: 'unknown',
        label: 'Unknown SKU',
        sku: 'UNKNOWN',
        explanation: 'The non-empty string passes validation. The handler rejects the unknown SKU with NotFound: existence is a business rule.',
    },
] as const;

export type ValidationScenarioId = (typeof validationScenarios)[number]['id'];
