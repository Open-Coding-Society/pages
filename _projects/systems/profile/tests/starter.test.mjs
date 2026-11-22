import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';

// The page's starter is where the modules meet the site: it imports each helper with the
// site.baseurl path, and the browser refuses the whole script when one name isn't exported where
// the starter looks. Node can't load the published copies, so this checks each import against the
// source that gets published there.
const root = new URL('../../../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const MODULES = '_projects/systems/profile/js/';

// Published path -> source file, from the Login and Profile systems' distribution.json.
function publishedSources() {
    const sources = new Map();
    for (const system of ['login', 'profile']) {
        const base = `_projects/systems/${system}/`;
        const manifest = JSON.parse(read(`${base}distribution.json`));
        if (manifest.standard) {
            for (const file of readdirSync(new URL(`${base}js/`, root))) {
                sources.set(`assets/js/projects/${system}/${file}`, `${base}js/${file}`);
            }
        }
        for (const { source, destination } of manifest.files) {
            const path = `${base}${source}`;
            if (!statSync(new URL(path, root)).isDirectory()) sources.set(destination, path);
            else for (const file of readdirSync(new URL(`${path}/`, root))) sources.set(`${destination}/${file}`, `${path}/${file}`);
        }
    }
    return sources;
}

const exportsOf = (code) => new Set([...code.matchAll(/^export (?:async )?(?:function|class|const|var|let) (\w+)/gm)].map((match) => match[1]));

test("the page's starter imports each name from a file published there that exports it", () => {
    const page = read('_projects/systems/profile/index.md');
    const start = page.lastIndexOf('<script type="module">');
    const starter = page.slice(start, page.indexOf('</script>', start));
    const imports = [...starter.matchAll(/import \{([^}]*)\} from '\{\{ ?site\.baseurl ?\}\}\/([^']+)'/g)];
    assert.ok(imports.length > 0, 'the starter imports nothing');
    const sources = publishedSources();
    for (const [, list, path] of imports) {
        // Shared site files such as config.js are tracked at their own path.
        const source = sources.get(path) ?? (existsSync(new URL(path, root)) ? path : null);
        assert.ok(source, `the starter imports ${path}, which neither the site nor a system has`);
        const exported = exportsOf(read(source));
        for (const name of list.split(',').map((part) => part.trim()).filter(Boolean)) {
            assert.ok(exported.has(name), `the starter imports ${name} from ${path}, which doesn't export it`);
        }
    }
});

// The modules are published together, so they may import only each other.
test('profile modules import only ./ paths to files in the same folder', () => {
    for (const file of readdirSync(new URL(MODULES, root)).filter((name) => name.endsWith('.js'))) {
        const code = read(`${MODULES}${file}`);
        for (const [, specifier] of code.matchAll(/\b(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
            assert.match(specifier, /^\.\/[\w-]+\.js$/, `${file} imports ${specifier}`);
            assert.ok(existsSync(new URL(`${MODULES}${specifier.slice(2)}`, root)), `${file} imports ${specifier}, which isn't in ${MODULES}`);
        }
    }
});
