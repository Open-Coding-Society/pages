# Paste everything below the line into Claude Code, in the `pagescak` repo

---

Our 3.7 Nested Conditionals lesson is committed but it doesn't appear on the Python lessons page. I need you to fix the frontmatter and location so it renders as a card there, and retire last year's 3.7 card so ours takes that spot. **Do not commit and do not push.** Stop when the build is verified and show me `git status` and the diff.

## Background — read these first, don't skip

The Python lessons grid is built by one line in `navigation/py_reference.md`:

```liquid
{% assign lessons = site.categories.Python | where_exp: "lesson", "lesson.hide != true" | sort: "title" %}
```

So a lesson gets a card only if it has `categories: [Python, ...]`, and it loses that card if it has `hide: true`. Our file has neither field.

Read this file to see the exact frontmatter shape that works — it's the card sitting right next to ours in the grid:

- `_notebooks/projects/python/2025-10-02-boolean_scratchers_py_hw.ipynb`

## Step 0 — Confirm the branch

We're on `lesson-3-7-nested-conditionals`. Confirm with `git branch --show-current` before touching anything. Do not create a new branch and do not rebase.

## Step 1 — Move our file

```bash
git mv _notebooks/CSP/big-ideas/big-idea-3/3-07-nested-conditionals/2026-09-16-triple_t_nested_conditionals_lesson.ipynb \
       _notebooks/projects/python/2026-09-16-triple_t_nested_conditionals_lesson.ipynb
```

That puts it alongside the other Python lesson notebooks that generate cards.

## Step 2 — Replace our frontmatter

The notebook's **first cell is a `raw` cell** containing YAML frontmatter. Keep it a raw cell. Replace its entire contents with exactly this:

```
---
layout: post
categories: [Python, Nested-Conditionals]
lesson_language: Python
lesson_topic: Nested-Conditionals
lesson_part: interactive
lesson_type: lesson
codemirror: true
microblog: true
toc: false
comments: false
title: 3.7 Nested Conditionals (PY)
description: Learn nested conditionals in Python using the five-part LxD lesson format.
permalink: /python/nested-conditionals/py
author: Chetan Tiduwar, Aaditya Prem, Kashyap Tubati
---
```

**Change nothing else in our notebook.** All 24 other cells stay exactly as they are. Do not reformat, do not re-indent, do not "improve" any content. Preserve the JSON structure — the `raw` cell stays `raw`, code cells keep `"outputs": []` and `"execution_count": null`.

## Step 3 — Retire last year's card

Last year's lesson is at:

`_notebooks/projects/python/2025-09-26-codemaxxers_nested_conditionals_lesson.ipynb`

In **its first cell only**, add this single line to the YAML frontmatter, directly under `layout: post`:

```
hide: true
```

That is the **only** change to that file. Do not delete it, do not edit its content, do not change its title, description, or permalink. Its page stays live at `/csp/codemaxxers/nested-conditionals-lesson` — it just stops appearing in the grid, so ours occupies the 3.7 spot.

There is also a generated copy at `_notebooks/2025-09-26-codemaxxers_nested_conditionals_lesson_IPYNB_2_.md`. **Do not touch it** — it's build output, not a source file.

## Step 4 — Verify the build

```bash
source venv/bin/activate
make clean && make
```

Then check all five:

1. `http://localhost:4500/python/nested-conditionals/py` renders our lesson
2. The Python lessons reference page shows **exactly one** 3.7 card, titled **3.7 Nested Conditionals (PY)**, with an `interactive` pill and `Topic: Nested-Conditionals`
3. Last year's plain **3.7 Nested Conditionals** card is **gone** from the grid
4. But `http://localhost:4500/csp/codemaxxers/nested-conditionals-lesson` still loads — hidden from the grid, not deleted
5. The `%%js` cell in our lesson renders as a JavaScript block, not raw text

## Step 5 — Report back, don't commit

Run and show me:

```bash
git status --short
git diff --stat HEAD
git diff HEAD -- _notebooks/projects/python/2025-09-26-codemaxxers_nested_conditionals_lesson.ipynb
```

Expected: one rename (our file into `_notebooks/projects/python/`), our notebook modified, and last year's notebook modified by **exactly one added line**. Nothing else. If the diff on last year's file is more than that one line, undo it and tell me.

**Do not run `git add`, `git commit`, or `git push`.** I'll commit myself.

If you write any commit message at any point, do not add `Co-Authored-By` or any "Generated with Claude" line.
