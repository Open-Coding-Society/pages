# Fortune Finders

Gamified financial literacy: canvas game (v1.1 engine), quant trading bot, futures mini-game, and coding lessons.

## Source layout

| Path | Purpose |
|------|---------|
| `02-v1-FortuneFinders.md` | Game entry page (`/gamify/fortuneFindersv1-1`) |
| `js/FinTech.js` | Fortune Finders game class |
| `levels/` | Map levels (Airport, Futures Exchange, Options, Wall Street) + `WaypointArrow`, `NpcProgressSystem` |
| `posts/` | Quant bot, futures mini-game, quant/futures/options lessons |
| `docs/` | Quant bot API overview |
| `images/` | Futures map, trader NPC, level gate |

Shared engine code stays in `assets/js/GameEnginev1.1/essentials/` (not duplicated here).

## Build

```bash
make -C _projects/games/fortuneFinders build
```

Copies to:

- `assets/js/projects/fortuneFinders/`
- `images/projects/fortuneFinders/`
- `_posts/gamify/` (quant, futures, lessons)
- `assets/js/projects/fortuneFinders/02-v1-FortuneFinders.md` (Jekyll game page)

Registered in `_projects/.makeprojects` as `games/fortuneFinders:dev`.
