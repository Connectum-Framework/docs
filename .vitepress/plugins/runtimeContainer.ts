/**
 * markdown-it plugin for the site-wide runtime switcher (Node.js | Bun).
 *
 * Use it for content that differs because of what *executes* the code -- the test
 * runner (`node --test` vs `bun test`), the watch flag, native type stripping. Content
 * that differs only in which tool installs dependencies belongs in `::: pm` instead:
 * the runtime and the package manager are independent (a Bun-runtime project can be
 * installed with npm, which is exactly what the CLI scaffold matrix does).
 *
 *   ::: runtime
 *   == node
 *   ```bash
 *   node --test tests/
 *   ```
 *   == bun
 *   ```bash
 *   bun test tests/
 *   ```
 *   :::
 *
 *   ::: runtime bun        <- single-runtime block, for a caveat with no Node counterpart
 *   `@opentelemetry/auto-instrumentations-node` does not load under Bun.
 *   :::
 *
 * Nesting follows the usual VitePress rule: an outer container needs more colons than
 * the inner one (`:::: runtime` wrapping a `::: tip`).
 */

import { RUNTIME_LABELS, RUNTIMES, type Runtime } from '../theme/runtime.ts';
import { createVariantContainer } from './variantContainer.ts';

export const runtimeContainerPlugin = createVariantContainer<Runtime>({
    name: 'runtime',
    prefix: 'runtime',
    values: RUNTIMES,
    labels: RUNTIME_LABELS,
    // A runtime caveat often exists for one runtime only, so a grouped block is not
    // required to carry both -- unlike `::: pm`, where an empty tab would strand a
    // reader with no command at all.
    allowSingle: true,
});
