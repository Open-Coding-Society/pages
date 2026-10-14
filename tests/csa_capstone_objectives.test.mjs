import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filename = path.join(root, "_projects/lessons/csa1/notebooks/2024-10-29-sprint3_plan.ipynb");
const notebook = JSON.parse(fs.readFileSync(filename, "utf8"));
const text = notebook.cells.map(cell => cell.source.join("")).join("\n");
const metadata = notebook.cells[0].source.join("");

test("restored CSA objectives retain their route and belong to CSA1 week 9", () => {
    assert.equal(notebook.nbformat, 4);
    assert.ok(notebook.cells.every(cell => cell.cell_type === "markdown"));
    assert.match(metadata, /^lesson_group: csa1$/m);
    assert.match(metadata, /^courses: \{csa: \{week: 9\}\}$/m);
    assert.match(metadata, /^permalink: \/csa\/sprint3\/objectives$/m);
    assert.doesNotMatch(metadata, /^articulation:|csse/m);
});

test("capstone objectives connect three trimesters without claiming advanced mastery", () => {
    for (const phrase of [
        "CSA1 - Trimester 1", "CSA2 - Trimester 2", "DS2 - Trimester 3",
        "POJO, JPA, and APIs were introduced in week 4",
        "Not every student is expected to complete every advanced CS113 layer",
        "does not by itself demonstrate a CS113 algorithm or data structure",
        "normal, boundary, and failure cases", "integration pull request",
        "not as a new week-9 deadline"
    ]) assert.ok(text.includes(phrase), phrase);
    for (const route of [
        "/capstone/toolchain-trail/", "/capstone/ocs-admin-security/", "/capstone/submissions/",
        "/csa/csa2/", "/csa/cs112/", "/csa/cs113/", "/navigation/java-reference/"
    ]) assert.ok(text.includes(`{{site.baseurl}}${route}`), route);
    assert.doesNotMatch(text, /(?<!\{)\{site\.baseurl\}\}/);
});

test("original individual and group evaluation weights are preserved", () => {
    assert.match(text, /\| \*\*Total\*\* \| \*\*10\*\* \|/);
    assert.match(text, /\| \*\*Total\*\* \| \*\*5\*\* \|/);
    assert.match(text, /Beginning-to-end contribution \| 2/);
    assert.match(text, /Live review individual demonstration \| 1/);
    assert.match(text, /Some capstone features are live and others are proposals/);
});

test("sprint descriptions connect week-eight preparation to sustained capstones and CSA2", () => {
    const outline = fs.readFileSync(path.join(root, "_projects/systems/courses/data/csa.yml"), "utf8");
    const sprint = number => outline.split(`\nSprint${number}:\n`)[1].split(/\nSprint\d+:\n/)[0];
    assert.match(sprint(2), /Through week 8/);
    assert.match(sprint(2), /evaluation and reflection/);
    assert.match(sprint(3), /Beginning in week 9/);
    assert.match(sprint(3), /all three trimesters/);
    assert.match(sprint(3), /start: 9\s+end: 12/);
    assert.match(sprint(3), /individual mastery or college credit/);
    assert.match(sprint(4), /trimester-1 lead-in skills/);
    assert.match(sprint(4), /sustained capstone/);
    assert.match(sprint(4), /start: 13\s+end: 16/);
    assert.match(sprint(4), /retrospective without new material/);
    for (const number of [3, 4]) {
        assert.match(sprint(number), /two mentor reviews and a community N@tM presentation/);
        assert.match(sprint(number), /continues throughout the year/);
    }
    assert.match(text, /Before CSA2 begins in week 13/);
    assert.match(text, /two mentor reviews and a community N@tM presentation/);
    assert.match(text, /how it is made/);
    assert.match(text, /feedback received, and the changes made or planned/);
    assert.match(outline, /prior-year APCSP experience building a project for a community organization or nonprofit/);
    assert.match(outline, /successive cohorts year after year/);
    assert.match(text, /system-level work/);
    assert.match(text, /prior year's APCSP course/);
    assert.match(text, /future maintainer/);
    assert.match(text, /work that has actually been integrated/);
});

test("week twelve reflects on system and curriculum evidence without adding new work", () => {
    const checkpoint = fs.readFileSync(path.join(root, "_projects/lessons/csa1/docs/2026-10-10-week-12-checkpoint.md"), "utf8");
    assert.match(checkpoint, /courses: \{"csa":\{"week":12\}\}/);
    assert.match(checkpoint, /^lesson_group: csa1$/m);
    assert.match(checkpoint, /^lesson_type: review$/m);
    assert.match(checkpoint, /^challenge_submit: false$/m);
    assert.match(checkpoint, /include projects\/lessons\/csa-checkpoint\.html/);
    for (const phrase of ["two mentor reviews", "how it is made", "future cohorts", "individual evidence", "does not require new implementation", "/csa/cs112/", "/csa/cs113/", "/csa/csa2/"]) {
        assert.ok(checkpoint.includes(phrase), phrase);
    }
    const outline = fs.readFileSync(path.join(root, "_projects/systems/courses/data/csa.yml"), "utf8");
    assert.match(outline, /  12:\n    theme: "System Contributions, Curriculum Connections, and Retrospective"/);
    assert.match(checkpoint, /one future learning topic/);
    assert.match(checkpoint, /up to two other teammates/);
    assert.match(checkpoint, /one to three students total/);
    assert.match(checkpoint, /each person's proposed teaching or development contribution/);
    assert.match(checkpoint, /Bring the proposal to teacher review/);
    assert.match(checkpoint, /not completing a new lesson, CodeRunner submission, or system implementation/);
    assert.match(outline, /Propose One Future Teaching Topic Individually or with Up to Two Teammates/);
});
