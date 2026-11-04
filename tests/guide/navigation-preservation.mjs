import { canonicalDocumentationLink } from '../../.vitepress/data/redirects.ts';

// normalize only the approved link migration and scaffold page naming; technical prose stays byte-sensitive.
export function normalizeNavigation(source) {
    return source
        .replace(/(?<=\]\(|href=["'])\/en\/(?:packages|reference)\/[^\s)"']*/g, canonicalDocumentationLink)
        .replace('See [@connectum/testing](/en/guide/testing/integration) for the full API.', 'See [@connectum/testing](/en/api/@connectum/testing/) for the full API.')
        .replace('Full API: [@connectum/testing](/en/guide/testing/integration).', 'Full API: [@connectum/testing](/en/api/@connectum/testing/).')
        .replace('and [@connectum/testing](/en/guide/testing/integration) for the full API.', 'and [@connectum/testing](/en/api/@connectum/testing/) for the full API.')
        .replace('title: Scaffolding a New Service', 'title: Scaffold structure and CLI')
        .replace(
            'description: Create a Connectum project, add services, and generate proto client types with the CLI.',
            "description: Understand the generated application's structure, module composition and detailed CLI behavior.",
        )
        .replace('# Scaffolding a New Service', '# Scaffold structure and CLI {#scaffolding-a-new-service}');
}
