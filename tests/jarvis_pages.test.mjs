import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = filename => fs.readFileSync(new URL(filename, root), 'utf8');
const directory = '_posts/capstone/Jarvis3000/';
const pages = fs.readdirSync(new URL(directory, root)).map(file => read(directory + file));

test('Jarvis navigation puts Progress and Future Plans after Research 4 and resolves every route', () => {
    const navigation = read('_includes/jarvis-nav.html');
    const routes = [...navigation.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(routes.slice(-3), [
        '/capstone/jarvis/research-4/', '/capstone/jarvis/progress/', '/capstone/jarvis/future-plans/'
    ]);
    for (const route of routes) {
        const matches = pages.filter(page => page.includes(`permalink: ${route}\n`));
        assert.equal(matches.length, 1, `Unique page for ${route}`);
    }
});

test('new pages retain shared layout, active navigation, and footer', () => {
    for (const slug of ['progress', 'future-plans']) {
        const page = read(`${directory}2026-09-01-jarvis-${slug}.md`);
        assert.match(page, /^layout: post$/m);
        assert.ok(page.includes(`rp_active: ${slug}\n`));
        for (const include of ['jarvis-nav.html', 'jarvis-footer.html']) {
            assert.ok(page.includes(`{% include ${include} %}`));
        }

    }
});

test('release plan preserves every workstream and the in-memory student image constraint', () => {
    const page = read(`${directory}2026-09-01-jarvis-future-plans.md`);
    for (const heading of ['Feature Development', 'Website (Frontend)',
        'Scene Detection Engine', 'Integration', 'Jarvis3000 (Backend Core)', 'RFID Classroom Presence System']) {
        assert.ok(page.includes(heading), heading);
    }
    assert.equal([...page.matchAll(/<li class="open">/g)].length, 14);
    assert.ok(page.includes('process recognition in memory without saving raw student images'));
    assert.ok(page.includes('student ID/presence data'));
});


test('Progress omits mentor notes and issue buttons while Future Plans keeps its issue links without a release block', () => {
    const progress = read(`${directory}2026-09-01-jarvis-progress.md`);
    assert.doesNotMatch(progress, /Mentor|issues\/(19|20)|aria-label="Project issues"/);
    assert.match(progress, /Next Release Checkpoint/);
    const future = read(`${directory}2026-09-01-jarvis-future-plans.md`);
    assert.doesNotMatch(future, /<h2>Target Release:/);
    for (const [issue, label] of [[19, 'Mentor Meeting Notes'], [20, 'Future Plans Issue']]) {
        assert.match(future, new RegExp(`href="https://github.com/Arnav210/Jarvis3000/issues/${issue}"[^>]*>${label}</a>`));
    }
});
