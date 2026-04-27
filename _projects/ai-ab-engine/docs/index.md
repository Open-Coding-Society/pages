---
layout: post
title: AI A/B Testing Engine — Project Docs
description: Architecture, integration guide, and variant types for the AI-driven A/B testing engine
permalink: /ai-ab-engine/docs/
author: Ansh Kapur
date: 2026-04-20
---

# AI A/B Testing Engine

An AI-powered split testing system that runs on any lesson page via a single `<script>` tag. Admins generate text, diagram, or interactive **GameEngine** variants for any element and launch 50/50 tests without touching page source.

## Architecture

| Layer | Technology | Role |
|---|---|---|
| Engine API | Next.js on Vercel | Test management, AI generation, event tracking |
| Database | Neon PostgreSQL (Prisma) | Stores tests, variants, events |
| SDK | Vanilla JS (`sdk.js`) | Deterministic bucketing, DOM mutation, conversion tracking |
| LLM | Groq `llama-3.3-70b-versatile` | Game/diagram generation |
| LLM | Groq `llama-3.1-8b-instant` | Text rewrite variants |

## Jekyll Integration

One line in `_includes/head-custom.html`:

```html
<script src="https://ai-ab-test-engine.vercel.app/sdk.js"
  data-site-baseurl="{{ site.baseurl }}"
  data-project-id="cmnfour780000f63gu69kg2v8"></script>
```

`data-site-baseurl` is rendered by Liquid and passed to the SDK so GameEngine asset paths resolve correctly on GitHub Pages.

## Game Variant

The most advanced variant type. The LLM extracts key concepts → server assembles a verified `GameEnginev1.1` ES module with NPC characters → SDK imports `GameExecutor` from this site's own `/assets/js/pages/runners/index.js` and auto-runs the level.

WASD to walk, E to interact with NPCs and read concept dialogues.

## Notebook

See the [project notebook](/ai-ab-engine/) for a full walkthrough with live demo links.
