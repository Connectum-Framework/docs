export const validationScenarios = [
    {
        id: 'known',
        label: 'Known SKU',
        sku: 'A-1',
        quantity: 2,
        explanation: 'The request passes validation. The handler looks up A-1 in the example inventory and returns its stock.',
    },
    {
        id: 'zero',
        label: 'Zero quantity',
        sku: 'A-1',
        quantity: 0,
        explanation: 'Zero violates int32.gt. Validation rejects the request before the handler runs.',
    },
    {
        id: 'empty',
        label: 'Empty SKU',
        sku: '',
        quantity: 2,
        explanation: 'The empty string violates the proto constraint. Validation rejects the request before the handler runs.',
    },
    {
        id: 'unknown',
        label: 'Unknown SKU',
        sku: 'UNKNOWN',
        quantity: 2,
        explanation: 'The non-empty string passes validation. The handler rejects the unknown SKU with NotFound: existence is a business rule.',
    },
] as const;
