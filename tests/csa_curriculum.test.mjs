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

function assignedWeek(frontmatter) {
    return Number(frontmatter.match(/^courses:.*?\bweek["']?\s*:\s*(\d+)/m)?.[1]) || undefined;
}

test("weeks 13-37 retain three primary documents while allowing explicitly curated FRQ practice", () => {
    const expected = JSON.parse(fs.readFileSync(path.join(root, "tests", "fixtures", "csa_week_schedule.json"), "utf8"));
    const practice = JSON.parse(fs.readFileSync(path.join(root, "tests", "fixtures", "csa_frq_practice.json"), "utf8"));
    const actual = {};
    const actualPractice = {};
    for (const source of [...groups, "java"].flatMap(sources)) {
        const week = assignedWeek(source.frontmatter);
        if (!week || week < 13) continue;
        assert.ok(week <= 37, source.filename);
        assert.notEqual(scalar(source.frontmatter, "lesson_status"), "draft", source.filename);
        const relative = path.relative(path.join(root, "_projects", "lessons"), source.filename);
        const selection = scalar(source.frontmatter, "lesson_type") === "ap-practice" ? actualPractice : actual;
        (selection[week] ??= []).push(relative);
    }
    for (let week = 13; week <= 37; week++) {
        assert.ok(expected[week].length > 0 && expected[week].length <= 3, `Primary document limit in week ${week}`);
        assert.deepEqual(actual[week]?.sort(), expected[week].sort(), `Week ${week} diverges from the curated plan`);
        assert.deepEqual((actualPractice[week] ?? []).sort(), (practice[week] ?? []).sort(), `Week ${week} diverges from curated FRQ practice`);
    }
});

test("CS112 FRQ categories are distinct from historical exam question numbers", () => {
    const lessons = sources("cs112");
    const frqs = lessons.filter(source => scalar(source.frontmatter, "permalink")?.startsWith("/csa/frqs/"));
    assert.equal(frqs.length, 30);
    const topics = {
        1: "Methods and Control Structures",
        2: "Class Writing and Design",
        3: "Array or ArrayList Manipulation",
        4: "2D Array Operations"
    };
    for (const source of frqs) {
        const title = scalar(source.frontmatter, "title");
        assert.doesNotMatch(scalar(source.frontmatter, "description") ?? "", /\{\{|\{%/, `Frontmatter is not recursively rendered: ${source.filename}`);
        const category = Number(scalar(source.frontmatter, "ap_frq_category"));
        assert.ok(topics[category], source.filename);
        assert.ok(title.startsWith(`FRQ ${category} - ${topics[category]} - `), source.filename);
        assert.match(path.basename(source.filename), new RegExp(`^\\d{4}-\\d{2}-\\d{2}-frq${category}-`));
        assert.match(source.filename, /-cs112\.ipynb$/);
        if (title.includes("AP Review")) {
            assert.equal(scalar(source.frontmatter, "ap_exam_year"), undefined);
            assert.equal(scalar(source.frontmatter, "ap_exam_question"), undefined);
        } else {
            const year = Number(scalar(source.frontmatter, "ap_exam_year"));
            const question = Number(scalar(source.frontmatter, "ap_exam_question"));
            assert.ok(year >= 2014 && year <= 2025);
            assert.ok(question >= 1 && question <= 4);
            assert.ok(title.includes(`${year} Exam Q${question} - CS112`), source.filename);
            assert.ok(source.filename.endsWith(`-${year}-exam-q${question}-cs112.ipynb`), source.filename);
        }
    }
    const expectedCategories = {
        "/csa/frqs/2014/1": [3, 2014, 1, "scrambleOrRemove"],
        "/csa/frqs/2015/1": [4, 2015, 1, "rowSums"],
        "/csa/frqs/2015/4": [2, 2015, 4, "NumberGroup"],
        "/csa/frqs/2016q1": [2, 2016, 1, "RandomStringChooser"],
        "/csa/frqs/2016q2": [3, 2016, 2, "removeMessages"],
        "/csa/frqs/2017/1": [3, 2017, 1, "digitList"],
        "/csa/frqs/2018/2": [3, 2018, 2, "WordPairList"],
        "/csa/frqs/2018/3": [2, 2018, 3, "CodeWordChecker"],
        "/csa/frqs/2019/1": [1, 2019, 1, "numberOfLeapYears"],
        "/csa/frqs/2019/4": [4, 2019, 4, "boolean[][]"],
        "/csa/frqs/2022/3": [3, 2022, 3, "allReviews"]
    };
    for (const [route, [category, year, question, evidence]] of Object.entries(expectedCategories)) {
        const source = frqs.find(source => scalar(source.frontmatter, "permalink") === route);
        assert.ok(source, route);
        assert.equal(Number(scalar(source.frontmatter, "ap_frq_category")), category, route);
        assert.equal(Number(scalar(source.frontmatter, "ap_exam_year")), year, route);
        assert.equal(Number(scalar(source.frontmatter, "ap_exam_question")), question, route);
        const body = source.notebook.cells.slice(1).map(cell => Array.isArray(cell.source) ? cell.source.join("") : cell.source).join("\n");
        assert.ok(body.includes(evidence), `Missing audited exercise evidence: ${route}`);
    }
    const practice = lessons.filter(source => scalar(source.frontmatter, "lesson_type") === "ap-practice");
    assert.equal(practice.length, 21);
    for (const source of practice) {
        assert.match(JSON.stringify(source.notebook.cells.slice(1)), /CODE_RUNNER/);
        assert.match(scalar(source.frontmatter, "articulation"), /CS112/);
        const category = Number(scalar(source.frontmatter, "ap_frq_category"));
        const allowedWeeks = { 1: [13], 2: [14, 17], 3: [22], 4: [23] };
        assert.ok(allowedWeeks[category].includes(assignedWeek(source.frontmatter)), source.filename);
        assert.notEqual(scalar(source.frontmatter, "hide"), "true");
    }
    const index = fs.readFileSync(path.join(root, "_projects/lessons/_includes/csa-curriculum.html"), "utf8");
    assert.match(index, /AP \+ CS112 topic groups/);
    assert.match(index, /where: 'ap_frq_category', category/);
    assert.match(index, /Exam Q/);
    assert.match(index, /9 points/);
    assert.match(index, /sort: "title"/);
    const player = fs.readFileSync(path.join(root, "_layouts/post.html"), "utf8");
    assert.match(player, /current_course == 'csa'[\s\S]*?coursePosts = coursePosts \| sort: "title"/);
    const week = fs.readFileSync(path.join(root, "_includes/player-pages/week.html"), "utf8");
    assert.match(week, /post.lesson_type == 'ap-practice'.*?Supplemental AP practice/);
});

test("closing and AP weeks revisit earlier work without creating new assignments", () => {
    const all = [...groups, "java"].flatMap(sources);
    const routes = new Map(all.filter(source => scalar(source.frontmatter, "permalink")).map(source => [
        scalar(source.frontmatter, "permalink").replace(/\/$/, ""), source
    ]));
    for (const week of [16, 20, 24, 28, 29, 30, 31, 32, 33, 36, 37]) {
        const checkpoints = all.filter(source => assignedWeek(source.frontmatter) === week);
        assert.equal(checkpoints.length, 1, `Week ${week} should have one compilation checklist`);
        const checkpoint = checkpoints[0];
        assert.equal(scalar(checkpoint.frontmatter, "lesson_type"), "review");
        assert.equal(scalar(checkpoint.frontmatter, "challenge_submit"), "false");
        assert.match(checkpoint.frontmatter, /include projects\/lessons\/csa-checkpoint\.html/);
        const links = [...checkpoint.frontmatter.matchAll(/url:\s*([^}\s]+)/g)];
        assert.ok(links.length > 0, checkpoint.filename);
        for (const [, url] of links) {
            const target = routes.get(url.replace(/\/$/, ""));
            assert.ok(target, `Broken checkpoint reference: ${url}`);
            assert.ok(assignedWeek(target.frontmatter) < week, `Review must reference an earlier lesson: ${url}`);
        }
    }
});

test("the scheduled memory lesson explains Java value passing correctly", () => {
    const filename = path.join(root, "_projects/lessons/cs112/notebooks/2024-06-24-stack_heap.ipynb");
    const notebook = JSON.parse(fs.readFileSync(filename, "utf8"));
    const text = notebook.cells.map(cell => Array.isArray(cell.source) ? cell.source.join("") : cell.source).join("\n");
    assert.match(text, /Java always passes arguments by value/);
    assert.match(text, /This is not pass-by-reference/);
    assert.doesNotMatch(text, /primitives are always on the stack|ensuring thread safety|This is called pass-by-reference/);
});

test("additional simulator and shared API resources do not overload curated CSA weeks", () => {
    const simulator = JSON.parse(fs.readFileSync(path.join(root, "_projects/lessons/ap-frq-simulator/index.ipynb"), "utf8"));
    assert.doesNotMatch(simulator.cells[0].source.join(""), /^courses:/m);
    const capstone = fs.readFileSync(path.join(root, "_posts/capstone/2026-05-19-exam-simulator-capstone.md"), "utf8");
    assert.doesNotMatch(capstone.split(/\n---/)[0], /^courses:/m);
    const shared = JSON.parse(fs.readFileSync(path.join(root, "_notebooks/Foundation/H-code/2026-03-15-srp-api-chaining.ipynb"), "utf8"));
    const frontmatter = shared.cells[0].source.join("");
    assert.match(frontmatter, /courses:.*'csp':.*'week': 27/);
    assert.doesNotMatch(frontmatter, /'csa':/);
});
