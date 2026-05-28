---
published: false
---

# Fortune Finders — URL map

Canonical routes live in `js/routes.js` (`FF_ROUTES`). Each markdown page must use the matching `permalink:` below.

| Route key | URL | Source file |
|-----------|-----|-------------|
| `game` | `/gamify/fortuneFindersv1-1` | `02-v1-FortuneFinders.md` |
| `quant` | `/gamify/fortuneFinders/quant` | `posts/2026-02-09-quantbot.md` |
| `quantOverview` | `/gamify/fortuneFinders/quant/overview` | `docs/README.md` |
| `quantLesson` | `/gamify/fortuneFinders/quant-lesson` | `posts/2026-04-20-quant-lesson.md` |
| `futures` | `/gamify/fortuneFinders/futures` | `posts/2026-04-17-futures-mini-game.md` |
| `futuresLesson` | `/gamify/fortuneFinders/futures-lesson` | `posts/2026-04-23-futures-lesson.md` |
| `optionsLesson` | `/gamify/fortuneFinders/options-lesson` | `posts/2026-04-22-options-lesson.md` |

Game levels and NPCs link via `ffUrl(path, FF_ROUTES.*)` — do not hardcode paths in JS.
