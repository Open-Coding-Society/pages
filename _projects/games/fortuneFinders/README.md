---
published: false
---

# Fortune Finders

**Single folder:** everything lives here. No copies to `_posts/gamify/` or `assets/js/projects/`.

## How it is served

- **Jekyll** — `_config.yml` includes `_projects/games/fortuneFinders` (markdown pages + static JS/images).
- **Import map** — `@fortuneFinders/` → `/_projects/games/fortuneFinders/` (see `_includes/head-custom.html`).
- **URLs** — `js/routes.js` (`FF_ROUTES`) must match each file’s `permalink:` (see [LINKS.md](LINKS.md)).

## Layout

| Path | Role |
|------|------|
| `02-v1-FortuneFinders.md` | Main game |
| `js/FinTech.js`, `js/routes.js`, `js/paths.js` | Game logic + URL/asset helpers |
| `levels/` | Map levels |
| `posts/` | Quant bot, futures mini-game, lessons |
| `docs/README.md` | Quant API overview |
| `images/` | Futures-specific SVGs |

Shared engine only: `assets/js/GameEnginev1.1/essentials/`.

## Build

```bash
make -C _projects/games/fortuneFinders build
```

No file copies — confirms config only.
