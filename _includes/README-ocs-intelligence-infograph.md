# OCS Intelligence LLM capstone infographic

This documents how the "OCS Intelligence LLM" capstone page is built, so an
agent (or a person) can find the right file to edit without reading the whole
site. It also describes the general pattern used by the other `*-infograph`
and `*-capstone` includes in this repo — most capstone pages follow this same
data → include → post shape.

## The pattern: content lives in YAML, not in HTML or Markdown

This capstone is **not** a normal Jekyll post with prose in it. It's a small
data-driven app:

```
_data/ocs_intelligence_infograph.yml   <- ALL the copy: text, lists, tables, image refs
_includes/ocs-intelligence-infograph.html  <- renders the overview page (reads the yml)
_includes/ocs-intelligence-stage.html      <- renders one phase page (reads the yml)
_includes/ocs-intelligence-nav.html        <- shared <style> block + the phase tab nav
_posts/capstone/2026-08-31-ocs-intelligence-capstone.md  <- thin wrapper, {% include ocs-intelligence-infograph.html %}
_posts/capstone/2026-08-31-ocs-intelligence-phase-0.md   <- thin wrapper, {% include ocs-intelligence-stage.html %}
_posts/capstone/2026-08-31-ocs-intelligence-phase-1.md   <- same, sets `ocs_stage: phase-1`
_posts/capstone/2026-08-31-ocs-intelligence-phase-2.md   <- same, sets `ocs_stage: phase-2`
```

**To change what the page says: edit the YAML, not the HTML.** The includes
are generic renderers — loops over `data.stages`, `data.researchQuestions`,
`data.literature`, etc. Only touch the `.html` files when you need a new
*kind* of section (a new card shape), not to change wording.

## Teacher’s implementation vision

The overview’s `implementation` YAML object contains the proposed hybrid
architecture: `title`, `introduction`, a Mermaid `diagram`, and `sections`.
Each section has `title`, `body`, `steps`, and `evidence` (the verification
criteria). Keep deployment plans distinct from demonstrated capabilities;
hardware counts are targets until inventoried, and software versions need
validation on the actual GPUs. This section maps delivery to the existing
three phases without adding new phase pages.

## How a post picks which content it shows

- The overview post (`ocs-intelligence-capstone.md`) includes
  `ocs-intelligence-infograph.html`, which renders the full story top to
  bottom, plus a `{% for stage in data.stages %}` loop for the phase-card
  grid and stage-nav tabs.
- Each phase post (`ocs-intelligence-phase-0.md` / `-1.md` / `-2.md`) sets
  frontmatter `ocs_stage: phase-0` (etc.) and includes
  `ocs-intelligence-stage.html`, which looks up `data.stages` for the entry
  whose `slug` matches `page.ocs_stage` and renders only that phase, gated by
  boolean/flag fields on the stage object (see below).

## Stage flags (in `_data/ocs_intelligence_infograph.yml`, under `stages:`)

Each stage is a big object. Most fields are plain text/lists rendered
unconditionally (`goals`, `workstreams`, `doneWhen`, `impact`, `tech`,
`priorities`). A few are **flags that toggle whole sections** in
`ocs-intelligence-stage.html` — if you add a stage and a section isn't
showing, check these:

| Flag | What it shows |
|---|---|
| `showDonation: true` | The "gift" card (only makes sense on the phase that first introduces the hardware) |
| `showResearchQuestion: N` | Just research question `N` (1-indexed into `data.researchQuestions`) |
| `showAllResearchQuestions: true` | All research questions (used by the phase that defines them) — takes priority over `showResearchQuestion` |
| `showJustification: true` | The "why electricity is the whole bill" diagram |
| `showRigs: true` | The production-vs-testing rig split |
| `showInventory: true` | The GPU/VRAM stat tiles |
| `showAllLiterature: true` | The full literature table (all of `data.literature`) instead of a filtered subset |
| `literatureTitles: [...]` | A filtered literature table — **matches by exact string against `data.literature[].title`; a typo silently drops that row with no error.** Prefer `showAllLiterature` unless you specifically want a subset. |
| `apiEndpoints: [...]` | A table of literal serving endpoints (method/path/engine/description) — used on the phase that stands up the inference server |
| `priorities: [...]` | A P0/P1/P2-tagged list of what matters most in that phase |

## Adding a new phase

1. Add an entry to `stages:` in the yml with a unique `slug` (e.g. `phase-3`).
2. Create `_posts/capstone/<date>-ocs-intelligence-phase-<n>.md` copying an
   existing phase post's frontmatter, changing `title`, `description`,
   `permalink`, and `ocs_stage`. **Don't** copy `sticky_rank` from the
   overview post — that field competes for listing order and only belongs on
   `ocs-intelligence-capstone.md`.
3. The phase automatically appears in the stage-nav tabs and the
   "N phases, one promise" grid on the overview page — both loop over
   `data.stages`. You don't need to touch the includes for this.
4. If the phase count changes, sanity-check the CSS grid columns in
   `ocs-intelligence-nav.html` (`.ocs-intelligence-stage-nav` and
   `.ocs-intelligence-phase-grid`) still look right — the nav grid uses
   `auto-fit` so it should self-adjust, but the phase-card grid is a fixed
   `repeat(N, ...)` matched to the current phase count.

## Known dead keys (defined in the yml, not read by any include)

- `rig2:` (a whole block, top-level) — leftover, not referenced by either
  include. If you're describing Rig 2, edit `rigs:` (the array both includes
  actually render) instead.
- `Topics[0].stack` — a list field on the Topics entry, not looped over
  anywhere; `Topics[0].keyPoints` is the list that actually renders. Harmless
  to keep in sync for a human reader, but don't expect it on the page.

## Verifying a change

There's no template linter here — a Liquid reference to a key that doesn't
exist in the yml just renders as an empty string, silently. After editing:

1. `python3 -c "import yaml; yaml.safe_load(open('_data/ocs_intelligence_infograph.yml'))"` — catches YAML syntax errors.
2. Grep the includes for `data\.`, `stage\.`, `topic\.`, `item\.` and check
   each key against the yml by hand, or build the site and look for blank
   sections — that's the actual tell for a mismatched key.
3. `make serve-current` (see the root `Makefile`) to render the site and
   check `/capstone/ocs-intelligence/` and each `/capstone/ocs-intelligence/phase-N/`.

## Repo-wide note

Several other capstones use this same yml-data + include-render shape (e.g.
`ocs_communications_infograph.yml` / the OCS Communications capstone,
`toolchain-trail-capstone.yml`, `pirna_capstone_infograph.yml`). If you're
building a new capstone infographic from scratch, copying this one's three
files (data + two includes) is the fastest correct starting point.
