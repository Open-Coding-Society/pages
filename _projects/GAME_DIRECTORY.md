# Games & Interactive Projects Directory

## Overview

The **games directory** is a shared catalog that lists every converted page opting in via
`game_directory: true` frontmatter. It requires **no manual list maintenance** — the
Jekyll include queries `site.posts` at build time and renders whichever pages qualify.

This is a page-rendering feature layered on top of the [project registration
system](REGISTRATION.md); registration gets a project's assets built, this feature
controls whether the resulting page shows up in the shared catalog.

## How It Works End-to-End

```text
1. Frontmatter. Author sets frontmatter on a project's index.ipynb / index.md
        game_directory: true
        game_order: 10
        game_category: "Game"
        image: "/images/projects/<name>/thumbnail.png"   (optional)
        exclude_from_games: true                          (optional opt-out)
             │
             ▼
2. Local Make. `make -C _projects/<category>/<name> build`
   Template Makefile (_projects/_template/Makefile):
   - Copies js/, sass/, images/, favicon.png to assets/js|css|_sass|images/projects/<name>/
   - Copies index.ipynb → _notebooks/projects/<name>/<DATE>-<name>.ipynb
     (or index.md → _posts/projects/<DATE>-<name>.md directly)
             │
             ▼
3. Conversion. IPYNB to MD conversion (scripts/convert_notebooks.py)
   - Reads the first notebook cell's YAML front matter (parse_front_matter)
   - Prepends that same front matter (game_directory, game_order, etc.) to the
     generated Markdown post written to _posts/
             │
             ▼
4. Jekyll build. Application of _layouts/post.html
   - Each converted post is now a `site.posts` entry carrying `game_directory: true`
   - Jekyll applies the post's `layout:` (e.g. `layout: post`) to wrap the
     converted Markdown in HTML — see "Jekyll Layouts" below
             │
             ▼
5. Game Directory. Page author places the catalog on any page:
        {% include games-directory.html %}
   (e.g. inside an HTML/UI runner cell on the CS Pathway page)
             │
             ▼
6. Page Rendering. Look at the _includes/games-directory.html which renders the static catalog:
   - Filters: site.posts | where: "game_directory", true
                        | where_exp: game.exclude_from_games != true
   - Sorts by `game_order`
   - Title/description come from _config.yml `games_directory:` block
   - Card image: page's `image:` frontmatter, else auto-detected
     images/projects/<name>/favicon.png, else no image
   - Card shows title, `game_category` pill, `description`, and an
     "Open project" link to `game.url`
```

## Frontmatter

Game Directory Keys / Values

| Key | Required | Purpose |
|---|---|---|
| `game_directory: true` | Yes | Opts the page into the catalog |
| `game_order` | No | Sort order (ascending) within the catalog |
| `game_category` | No | Short label pill shown on the card (e.g. "Game") |
| `image` | No | Explicit card thumbnail; overrides favicon auto-detection |
| `exclude_from_games: true` | No | Hides an otherwise-eligible page from the catalog |

Frontmatter lives in the same first-cell YAML block as `layout`, `title`,
`description`, and `permalink` — see [_projects/games/gamify/index.ipynb](games/gamify/index.ipynb)
for a working example.

## Page Rendering

The Key File for rendering: `_includes/games-directory.html`

This single file is how the "directory" is built — there is no
generator script, no build-time list, no database. It is a static Liquid
injection that runs at Jekyll build time, in place, wherever it's included
(in this repo, from [_projects/games/cs-pathway/navigation/cs-pathway-games.md](games/cs-pathway/navigation/cs-pathway-games.md)):

```liquid
{% assign games = site.posts | where: "game_directory", true | where_exp: "game", "game.exclude_from_games != true" | sort: "game_order" %}
```

- `site.posts` is Jekyll's built-in collection of every post under `_posts/`
  (which is exactly where the notebook/markdown conversion step writes each
  project's page). No separate "site.post generation" step is needed — Jekyll
  builds this collection automatically from front matter it finds during its
  build scan.
- `where` / `where_exp` / `sort` are Liquid filters operating purely on that
  in-memory collection at _site render time.
- The `{% for game in games %}` loop then emits one `<article>` card per
  surviving post, pulling `title`, `game_category`, `description`, `image`/
  favicon, and `url` straight off each post's front matter.

**Styling:** the cards use the shared `ocs__` design-system classes
(`ocs__container`, `ocs__section-title`, `ocs__description`, `ocs__grid`,
`ocs__grid--card`, `ocs__grid-cell`, `ocs__image-frame`, `ocs__status-pill`,
`ocs__btn`) rather than bespoke CSS — so any game card automatically matches
the rest of the site's look without this include defining its own styles.


## Jekyll Layouts

What They Are and When They Run

A **layout** (`_layouts/<name>.html`) is an HTML template that wraps a page's
rendered content. A page opts into one via its own frontmatter, e.g.:

```yaml
layout: post
```

Jekyll then wraps that page's content with `_layouts/post.html`, substituting
`{{ content }}` for the page body and exposing the page's frontmatter as
`page.*` variables (e.g. `page.title`, `page.game_directory`) inside the
layout. Layouts can themselves declare a `layout:` in their own frontmatter,
chaining templates — for example [_layouts/post.html](../_layouts/post.html)
declares `layout: opencs`, so Jekyll renders `post.html`'s output through
`_layouts/opencs.html` as an outer shell (nav, footer, global includes like
`games-directory.html`).

**When layouts run:** entirely during the **Jekyll build step** (`jekyll
build` / `jekyll serve`, invoked by `make dev` or `make convert`), which is a
separate, later phase from notebook conversion:

```text
1. scripts/convert_notebooks.py (Python + nbconvert)     ← content generation
   - Reads *.ipynb, extracts the front-matter cell
   - Uses nbconvert's MarkdownExporter to turn notebook cells into Markdown
   - Writes <date>-<name>.md into _posts/, with the original frontmatter
     (including `game_directory`, `layout`, etc.) prepended
             │
             ▼
2. jekyll build / jekyll serve                            ← template rendering
   - Scans _posts/ (and _pages, _projects output, etc.) for files with
     frontmatter and builds `site.posts`
   - For each post, applies the Liquid layout chain named by `layout:`
   - Evaluates Liquid tags/includes in both the post body and the layouts
     (e.g. `{% include games-directory.html %}`, which reads `site.posts`)
             │
             ▼
3. _includes/games-directory.html                         ← catalog assembly
   - Runs as part of the same Jekyll build pass, wherever a page's layout
     or content contains `{% include games-directory.html %}`
   - Liquid filters `site.posts` down to entries with `game_directory: true`
     and `exclude_from_games != true`, then sorts the result by `game_order`
   - For each surviving post, renders a card from its `title`, `game_category`,
     `description`, `image` (or auto-detected favicon.png), and `url`
   - This filtering happens fresh on every Jekyll build — no separate catalog
     file is generated or cached, so adding/removing `game_directory: true`
     on a post is picked up the next time Jekyll builds
   - The include has **no output file of its own**. Its rendered HTML is
     inlined directly into whichever page's content called it (e.g. the
     CS Pathway games page), and that *page's* final HTML is what Jekyll
     writes to `_site/` — e.g. `_site/cs-pathway/games/index.html`, not
     a standalone `_site/games-directory.html`
```

**Relation to nbconvert:** nbconvert only turns notebook cells into Markdown
text plus a frontmatter block — it has no concept of Jekyll layouts, includes,
or `site.posts`. The `layout:` key is just inert YAML as far as nbconvert is
concerned; it becomes meaningful only once Jekyll reads the generated
Markdown file. In other words, nbconvert produces the *content* per project,
and Jekyll's layout system is what actually assembles that content into a
themed page and powers cross-page features like the games directory catalog.

## Card Image Resolution Order

1. `image:` frontmatter value on the page, if present.
2. Auto-detected `images/projects/<project-name>/favicon.png`, if that static
   file exists (requires a project-root `favicon.png` — see
   [REGISTRATION.md](REGISTRATION.md#game-catalog-images)).
3. No image rendered.

## Placing the Catalog on a Page

The catalog is **not** auto-placed; a page author decides where it shows by adding:

```liquid
{% include games-directory.html %}
```

This can be added inside an HTML/UI runner cell of a notebook page (e.g. the CS Pathway
landing page). By the time this include is encountered in the Jekyll build process,
`site.posts` already contains the game-directory candidates with their metadata.
Each candidate is identified, and its HTML and styling are added to the card catalog.

## Site-Wide Catalog Labels

Configured once in [_config.yml](../_config.yml):

```yaml
games_directory:
  title: "Games & Interactive Projects"
  description: "Explore playable projects and lessons built with the Open Coding Society game systems."
```

## Checklist: Adding a New Game to the Directory

1. Register the project per [REGISTRATION.md](REGISTRATION.md) (`.makeprojects` entry, `js/`, `sass/`, etc.).
2. Add `game_directory: true` (and optionally `game_order`, `game_category`, `image`)
   to the project's `index.ipynb`/`index.md` front-matter cell.
3. Optionally drop a `favicon.png` in the project root for an automatic card thumbnail.
4. Run `make -C _projects/<category>/<name> build` to publish assets and trigger conversion.
5. Confirm the page appears wherever `{% include games-directory.html %}` is placed
   (e.g. the CS Pathway page).
6. To temporarily hide a registered game without removing its frontmatter, set
   `exclude_from_games: true`.

## Related Files

- [REGISTRATION.md](REGISTRATION.md) — project auto-registration and build pipeline
- [ARCHITECTURE.md](ARCHITECTURE.md) — example project architecture (CS Pathway)
- [BUILD_FILES.md](BUILD_FILES.md) — build file conventions
- [_includes/games-directory.html](../_includes/games-directory.html) — catalog rendering logic
- [_config.yml](../_config.yml) — `games_directory` title/description settings
- [scripts/convert_notebooks.py](../scripts/convert_notebooks.py) — front matter passthrough during notebook → post conversion
