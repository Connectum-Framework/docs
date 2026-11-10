function cleanHeading(value) {
    return value
        .replace(/\s+\{#[^}]+\}\s*$/, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[`*_~]/g, '')
        .trim();
}

export function slugify(value) {
    return (
        cleanHeading(value)
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            // biome-ignore lint/suspicious/noControlCharactersInRegex: fragment normalization must match VitePress, including removed control characters.
            .replace(/[\u0000-\u001f]/g, '')
            .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .replace(/^(\d)/, '_$1')
            .toLowerCase()
    );
}
