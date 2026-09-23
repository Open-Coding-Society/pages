# 3.7 Nested Conditionals — steps

The notebook is **already in your repo**, untracked:

```
_notebooks/CSP/big-ideas/big-idea-3/3-07-nested-conditionals/2026-09-16-triple_t_nested_conditionals_lesson.ipynb
```

No Claude Code step needed. Run these in Terminal, in `~/rex0dex/pagescak`.

---

## 1. Fresh branch off upstream

```bash
cd ~/rex0dex/pagescak
git fetch upstream
git checkout -b lesson-3-7-nested-conditionals upstream/main
```

The notebook is untracked, so it follows you onto the new branch. Confirm:

```bash
git status --short
```

You should see exactly one `??` line — the notebook.

## 2. Build and preview

```bash
source venv/bin/activate
make clean && make
```

Open **http://localhost:4500/csp/big-idea-3/nested-conditionals/p4/lesson**

## 3. Check four things

- Frontmatter rendered as the page title, not printed as text at the top
- The `%%js` cell shows a **Run** button (it becomes a live JavaScript runner)
- All five tables render as tables
- Example A's first code block is there — it's *supposed* to produce no output

## 4. Commit

```bash
git add _notebooks/CSP/big-ideas/big-idea-3/3-07-nested-conditionals/
git commit -m "Add 3.7 Nested Conditionals lesson (Triple T)"
git push -u origin lesson-3-7-nested-conditionals
```

## 5. PR

Open the PR against `Open-Coding-Society/pages` `main`. Body:

> Adds the 3.7 Nested Conditionals Python lesson for Sprint 2 (Teaching using LxD).
>
> Follows the structure of the existing big-idea-3 lessons — raw frontmatter cell, same permalink shape as `/csp/big-idea-3/lists/p4/lesson`, no new SCSS and no new classes. Includes all five LxD sections, a Tech Talk, simple→complex examples, a popcorn hack, a homework hack, and a 1-point grading plan.
>
> Last year's lesson in the same folder is untouched.
>
> Team Triple T — Chetan Tiduwar, Aaditya Prem, Kashyap Tubati

---

## If your period isn't 4

One line, in the first cell of the notebook:

```
permalink: /csp/big-idea-3/nested-conditionals/p4/lesson
```

Change `p4` to `p3` and rebuild. Nothing else depends on it.

## Before you teach

Section 5 has **Revision 2 left blank on purpose.** Do the practice run with Chetan and Kashyap, write down the thing that actually confused someone in their own words, change the notebook because of it, and fill in both lines. The sprint plan grades "Peer feedback and iteration" — a blank there is a real lost point, and a made-up one is worse.
