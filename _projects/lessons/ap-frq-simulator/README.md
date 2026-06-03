# AP CSA FRQ Exam Simulator

A timed AP Computer Science A Section II exam simulator with 19 official FRQ sets (2005–2025), integrated Java code editors, and AI-powered Gemini grading.

## Features

- 19 preset exam years (2005–2025) selectable by chip, or upload your own PDF
- Full FRQ PDF rendered in left pane via PDF.js
- 4 CodeMirror Java editors — no run button (real exam conditions)
- Timed session with 10-min warning and 5-min danger states; auto-submits on timeout
- Flag questions to revisit; prev/next navigation
- **📋 Reference** button — slides in the AP CSA Java Quick Reference PDF
- Post-exam review with **Grade with AI** (Gemini) — score + feedback per question
- Download responses as `.txt`

## Project Structure

```
ap-frq-simulator/
├── notebook.src.ipynb   # Source notebook (HTML/CSS/JS all inline)
├── docs/                # Documentation
├── images/              # Assets
└── Makefile             # Build config
```

## Build

```bash
make -C _projects/lessons/ap-frq-simulator build
```

## Dependencies

- PDF.js 3.11.174 (CDN)
- Spring backend: `POST /api/gemini-frq/grade` (public endpoint, no auth required)
- PDFs in `assets/pdfs/frq/` (FRQ sets) and `assets/pdfs/reference/` (Quick Reference)

## Permalink

`/csa/exam-simulator`
