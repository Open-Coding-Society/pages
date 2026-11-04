# Games and Interactive Projects Catalog

## Current Capstone integration

Project-page front matter `game_directory: true` opts a converted post into the CSSE catalog. The flag marks catalog eligibility; it does not guarantee that the page is a playable game. Some eligible entries are lessons, and titles are not guaranteed to be unique, so review the project title and author when describing the catalog.

The current catalog is rendered by [`_includes/capstone-games.html`](../_includes/capstone-games.html), included at the bottom of the grid in [`navigation/capstone.md`](../navigation/capstone.md). It reads Jekyll's `site.posts`, excludes entries with `exclude_from_games: true`, and sorts by `game_order`. Each card uses the post's title, description, author/team, image, and URL. If `image` is absent, it uses the project's `favicon.png` when available.

The Capstone page's CSSE filter shows these cards. A post's `school_year` is used when present. When it is blank, the card leaves `data-year` empty so the existing Capstone filter applies its normal `2025-2026` fallback. Keep this behavior consistent with other Capstone cards without an explicit year.

The old `/cs-pathway/games/` route is retained as a redirect to `/capstone/?course=CSSE`; the CS Pathway menu's CSSE link points to the same filtered catalog. The older [`_includes/games-directory.html`](../_includes/games-directory.html) remains in the repository, but the current Games route and Capstone page do not include it.

## Source metadata and conversion

Add the catalog metadata to the first notebook cell or Markdown front matter of a registered project:

```yaml
game_directory: true
game_order: 10
game_category: "Game"
school_year: "2026-2027"
image: "/images/projects/<project-name>/thumbnail.png"
exclude_from_games: false
```

Only `game_directory: true` is required. The other fields are optional. `exclude_from_games: true` removes an otherwise eligible post from the catalog. If `school_year` is omitted, Capstone applies its existing year fallback.

For notebook projects, the build pipeline converts the notebook to Markdown and carries its front matter into a generated post under `_posts/`. Jekyll then exposes the post through `site.posts` when it renders `capstone-games.html`; no separate game list needs to be maintained.

## Card images

1. Use the post's `image` front matter when provided.
2. Otherwise, use `images/projects/<project-name>/favicon.png` if it exists.
3. If neither is available, render the card without an image.

## Adding or excluding an entry

1. Register and build the project using the steps in [REGISTRATION.md](REGISTRATION.md).
2. Set `game_directory: true` in its source front matter; optionally set `game_order`, `game_category`, `school_year`, and `image`.
3. Run the repository build so notebook sources are converted and Jekyll renders the Capstone page.
4. Confirm the project appears once in the CSSE filter, at the bottom of the grid, and its card links to the original project page.
5. Set `exclude_from_games: true` to omit an entry without removing its source metadata.

## Related files

- [REGISTRATION.md](REGISTRATION.md) — project registration and build pipeline
- [ARCHITECTURE.md](ARCHITECTURE.md) — project architecture
- [BUILD_FILES.md](BUILD_FILES.md) — build file conventions
- [`navigation/capstone.md`](../navigation/capstone.md) — Capstone filters and grid
- [`_includes/capstone-games.html`](../_includes/capstone-games.html) — current CSSE card rendering
- [`_includes/games-directory.html`](../_includes/games-directory.html) — legacy catalog include, currently unused
- [`scripts/convert_notebooks.py`](../scripts/convert_notebooks.py) — notebook-to-post conversion
