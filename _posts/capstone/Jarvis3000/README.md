# Jarvis project board

The overview uses `_includes/jarvis-kanban.html` and the existing OCS Kanban
styles. Its wider layout is scoped to `.jv-kanban` in `_sass/capstone/jarvis.scss`.
No shared component, build, deployment, or repository instruction changes are
required.

Each column previews five cards, matching the shared board's limit. A native
`details` control expands the remaining cards and offers Show less; it works
with a keyboard and without JavaScript.

The board displays a timestamped import of the public GitHub Project, preserving
its columns and card placement. It does not refresh automatically. Refresh its
data explicitly before building when needed:

```sh
venv/bin/python scripts/sync_jarvis_board.py
```

The importer updates only `_data/jarvis_board.json` and rejects incomplete
responses. Build and preview with the existing Makefile commands.

Tests:

```sh
venv/bin/python -m unittest discover -s tests -p 'test_*jarvis*.py'
node --test tests/jarvis_pages.test.mjs
```
