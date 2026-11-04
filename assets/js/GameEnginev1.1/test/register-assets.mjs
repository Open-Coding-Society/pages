import { registerHooks } from 'node:module';

/**
 * Resolve the site's @assets import-map alias to real files for Node tests.
 * Preload with node --import before loading tests that use @assets imports.
 */
registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('@assets/')) {
            const resolved = new URL(`../../../${specifier.slice('@assets/'.length)}`, import.meta.url);
            return nextResolve(resolved.href, context);
        }
        return nextResolve(specifier, context);
    },
});
