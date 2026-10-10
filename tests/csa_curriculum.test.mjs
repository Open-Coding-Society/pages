import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const groups = ["cs112", "cs113", "csa1", "csa2", "ds2"];

function sources(group) {
    const project = path.join(root, "_projects", "lessons", group);
    return ["notebooks", "docs"].flatMap(directory => {
        const folder = path.join(project, directory);
        if (!fs.existsSync(folder)) return [];
        return fs.readdirSync(folder, { withFileTypes: true }).map(entry => {
            assert.ok(entry.isFile(), `Source directories must be flat: ${folder}/${entry.name}`);
            const filename = path.join(folder, entry.name);
            const content = fs.readFileSync(filename, "utf8");
            if (entry.name.endsWith(".ipynb")) {
                const notebook = JSON.parse(content);
                const source = notebook.cells[0].source;
                return { filename, notebook, frontmatter: Array.isArray(source) ? source.join("") : source };
            }
            assert.ok(entry.name.endsWith(".md"), `Unexpected authored page: ${filename}`);
            return { filename, frontmatter: content };
        });
    });
}

function scalar(frontmatter, key) {
    const match = frontmatter.match(new RegExp(`^${key}:\\s*([^\\n]+)`, "m"));
    return match?.[1].trim().replace(/^["']|["']$/g, "");
}

test("all five curriculum projects use the shared registration and index view", () => {
    const registry = fs.readFileSync(path.join(root, "_projects", ".makeprojects"), "utf8");
    for (const group of groups) {
        assert.match(registry, new RegExp(`^lessons/${group}(?::dev)?$`, "m"));
        const index = fs.readFileSync(path.join(root, "_projects", "lessons", group, "index.md"), "utf8");
        assert.equal(scalar(index, "curriculum_group"), group);
        assert.match(index, /include projects\/lessons\/csa-curriculum\.html/);
        assert.ok(sources(group).length > 0, `Missing sources for ${group}`);
    }
});

test("source ownership and articulation remain separate from scheduling", () => {
    const routes = new Set();
    for (const group of groups) {
        for (const { filename, frontmatter } of sources(group)) {
            assert.match(frontmatter, /^---\s*\n/);
            assert.equal(scalar(frontmatter, "lesson_group"), group, filename);
            const permalink = scalar(frontmatter, "permalink");
            assert.ok(permalink, `Missing stable route: ${filename}`);
            const route = permalink.replace(/^\/|\/$/g, "");
            assert.ok(!routes.has(route), `Duplicate route: ${permalink}`);
            routes.add(route);
            const metadata = frontmatter.split(/\n---/)[0];
            if (group === "cs112" || group === "cs113") {
                assert.match(metadata, /^articulation:/m, filename);
                assert.match(scalar(metadata, "articulation"), new RegExp(group.toUpperCase()), filename);
            } else {
                assert.doesNotMatch(metadata, /^articulation:/m, filename);
            }
        }
    }
});

test("authoring skeletons are valid notebooks and are not live assignments", () => {
    const drafts = groups.flatMap(sources).filter(source => scalar(source.frontmatter, "lesson_status") === "draft");
    assert.ok(drafts.length > 0);
    for (const { filename, notebook, frontmatter } of drafts) {
        assert.equal(notebook.nbformat, 4, filename);
        assert.equal(scalar(frontmatter, "hide"), "true", filename);
        assert.equal(scalar(frontmatter, "search_exclude"), "true", filename);
        assert.equal(scalar(frontmatter, "challenge_submit"), "false", filename);
        assert.doesNotMatch(scalar(frontmatter, "title"), /:\s/, `The notebook converter drops title quoting: ${filename}`);
        assert.ok(scalar(frontmatter, "planned_week"), filename);
        assert.doesNotMatch(frontmatter, /^courses:/m, filename);
        assert.ok(notebook.cells.some(cell => cell.cell_type === "code"), filename);
        assert.ok(notebook.cells.every(cell => cell.cell_type !== "code" || cell.outputs.length === 0), filename);
    }
});

test("ML alternatives remain in DS2 without claiming CS113 articulation", () => {
    const ml = sources("ds2").filter(source => scalar(source.frontmatter, "permalink")?.startsWith("/javaml/"));
    assert.equal(ml.length, 6);
    for (const source of ml) assert.doesNotMatch(source.frontmatter, /^articulation:/m, source.filename);
});
