# Graph Heuristics — Design & Contribution Guide

This document describes the Graph Heuristics maze-runner implementation (see `assets/js/GameEnginev1.1/GameLevelGraphHeuristics.js`), how the core `GameLevelGraphHeuristics` class works, and how to add algorithms, cell types, and features.

Keep all maze and pathfinding logic in `GameLevelGraphHeuristics.js`. When adding new behavior, extend the existing class rather than creating separate files.

**Overview**

`GameLevelGraphHeuristics` is a game level that renders an interactive pathfinding visualizer on a 2D grid. It supports three search algorithms (A\*, Dijkstra's, Greedy BFS), a live-rerouting mode, a race mode that compares all three, wandering NPC sprites that can block the path, and a draw mode for placing walls and weighted cells. The lesson notebook at `_notebooks/CSA/data_structures/2025-05-22-graph-heuristics2.ipynb` pairs with this level — students learn each algorithm in the notebook and observe it running in the maze.

Key responsibilities in `GameLevelGraphHeuristics`:
- layout & sizing: `initialize()` computes `CELL`, `OX`, `OY` from canvas dimensions.
- grid state: `initGrid()`, `resetGrid()`, `clearPath()`, `genMaze()`.
- user input: `paintCell(e)` (mouse draw), toolbar buttons built in `initialize()`.
- search execution: `startSearch(algo)`, `searchStep()` (step-by-step, called each frame), `liveRepath()` (instant synchronous), `raceAll()` (all three algos at once).
- NPC management: `stepNpcs()`, `toggleNpcs()`.
- rendering: `update()` — grid cells, path/visited overlays, NPC sprites, stats bar.

---

## Coordinate system

- Grid coordinates are integers: `r` (0..ROWS-1), `c` (0..COLS-1). Default grid is 12 rows × 20 cols.
- Canvas coordinates are derived via `cx(c)` and `cy(r)` using `OX`, `OY`, and `CELL` (cell size in pixels).
- Cell keys are flat integers: `key(r, c) = r * COLS + c`. All state maps (`cellState`, `vis`, `par`, `g`) use these keys.

---

## Cell types and colors

| Constant | Value | Color | Meaning |
|---|---|---|---|
| (open) | 0 | `#222244` | Empty traversable cell |
| `WALL` | 1 | `#e94560` | Impassable wall |
| `WEIGHT` | 2 | `#a29bfe` | Traversable, costs 5 instead of 1 |
| `START` | 3 | `#00b894` | Start cell (labeled S) |
| `END` | 4 | `#fdcb6e` | Goal cell (labeled G) |
| cellState `'v'` | — | `#1a3a6a` | Visited during search |
| cellState `'p'` | — | `#53d8fb` | On the final path |

Colors live in `this.COLORS`. Cell type values live in `this.WALL`, `this.WEIGHT`, etc.

---

## Data shapes

**Grid**
```
this.grid         // number[][]  — ROWS × COLS, holds cell type values (0/1/2/3/4)
this.cellState    // { [key: number]: 'v' | 'p' }  — overlay for visited/path cells
```

**Search state** (live during step-by-step search only)
```
this.open         // { r, c, f }[] | null  — priority queue (sorted by f each step)
this.vis          // { [key]: true }        — settled/closed set
this.par          // { [key]: key }         — parent pointers for path reconstruction
this.g            // { [key]: number }      — best known cost from start
this.startKey     // number                 — key(sR, sC)
this.algoState    // 'astar' | 'dijkstra' | 'greedy'
```

**NPC**
```
{
  r: number,      // current row
  c: number,      // current col
  dir: string,    // 'up' | 'down' | 'left' | 'right'  — last move direction (for sprite row)
  frame: number,  // current animation frame index
  fc: number,     // frame counter (advances frame every 4 ticks)
  si: number      // sprite index into this.SPRITES[]
}
```

---

## How the algorithms work (inside this implementation)

All three algorithms share the same open-list / visited-set loop. The only difference is the `f` value pushed onto the open list:

| Algorithm | f(n) used | Effect |
|---|---|---|
| A\* | `g(n) + h(n)` | Balanced — cost + heuristic |
| Dijkstra | `g(n)` | No heuristic; expands by cost only |
| Greedy BFS | `h(n)` | Heuristic only; ignores actual cost |

`h(n)` is Manhattan distance to the goal: `|r - eR| + |c - eC|`.

Weighted cells (`WEIGHT`) add cost 5 instead of 1 (`wt(r, c)`). Dijkstra and A\* respect these; Greedy ignores actual costs so weighted cells do not meaningfully affect its path.

**Step-by-step mode** (`startSearch` → `searchStep` called once per frame): animates the frontier expansion so students can watch it grow.

**Live mode** (`liveRepath`): runs the full search synchronously every time the grid or NPCs change, showing the current best path instantly.

**Race mode** (`raceAll`): runs all three algorithms synchronously and overlays the winner's path, printing visited-node counts and costs for all three in the stats bar.

---

## Key methods

`startSearch(algo)` — clears prior state, seeds the open list with the start cell, and sets `this.open` so `searchStep` begins running each frame.

`searchStep()` — one iteration of the search loop. When the goal is reached, reconstructs the path by walking `this.par` back to `startKey` and marks those keys `'p'` in `cellState`. Sets `this.open = null` to stop further steps.

`liveRepath()` — same logic as `searchStep` but runs the full loop synchronously. Called whenever the grid changes in live mode (draw, NPC step, maze gen).

`raceAll()` — runs a local copy of the search loop for each algorithm, collects `{vn, cost}` results, picks the winner by lowest visited-node count, and renders its path.

`nbrs(r, c, blockNpcs)` — returns the 4-directional neighbors that are not walls. When `blockNpcs=true` (used in live mode), also excludes cells occupied by NPCs.

`genMaze()` — randomizes the grid: each empty cell has a 27% chance of becoming a wall and a 7% chance of becoming a weighted cell. Start and end cells are always preserved.

`paintCell(e)` — converts a mouse event to grid coordinates and toggles wall/weight on that cell. Clears the cell's `cellState` entry and triggers a live repath if active.

`stepNpcs()` — moves each NPC one cell in a random valid direction (no walls, no other NPCs). If live mode is on, calls `liveRepath()` after moving so the path updates around them.

---

## Rendering notes

All rendering happens in `update()` (called every frame by the engine):
- Background fill covers the whole canvas with `#1a1a2e`.
- Grid cells are drawn as `CELL-2` × `CELL-2` filled rects with 1px gaps for grid lines.
- Cell color priority: path (`'p'`) > visited (`'v'`) > cell type color.
- S/G/5 labels are drawn centered inside the start, end, and weighted cells.
- NPC sprites are drawn from a spritesheet using `frame` and `dir` to select the correct row and column. In live mode, a pink glow is drawn behind each NPC to show they are active obstacles.
- The stats bar is a semi-transparent strip at the bottom of the canvas showing `this.statsText`.

The toolbar is a DOM overlay (`this._bar`) positioned absolutely above the canvas using `position:absolute; top:0`. It is created and destroyed alongside the level (see `destroy()`).

---

## Adding a new algorithm

1. Add a new `algoBtn` call in `initialize()` alongside the existing three.
2. Give it a new string key (e.g. `'bfs'`).
3. In `searchStep`, `liveRepath`, and `raceAll`, add a branch for your key that computes the correct `f` value. BFS, for example, would use the step count (all edges cost 1, ignore weights).
4. Add the display name to the `names` map in all three methods and in `raceAll`.

---

## Adding a new cell type

1. Add a constant (`this.MYTYPE = 5`) and a color entry in `this.COLORS`.
2. Add a draw-mode button in `initialize()` or extend `paintCell`.
3. Update `wt(r, c)` if the type has a different traversal cost.
4. Update the rendering block in `update()` if the type needs a label or special appearance.
5. If the type should be impassable, return it filtered in `nbrs`.

---

## NPC sprite conventions

Sprites are defined in `this.SPRITES`:
```
{
  src: string,    // image URL
  fw: number,     // frame width in pixels
  fh: number,     // frame height in pixels
  frames: number, // number of animation frames per row
  rows: {         // spritesheet row index per direction
    right, left, up, down
  }
}
```
To add a new sprite, push an entry to `this.SPRITES` and update `this.spriteImgs` accordingly. Assign NPCs `si` values pointing to the new entry.

---

## Testing locally

Start a local preview (follow the repo Makefile and README). Navigate to `/csa/graph-heuristics2`. Open the browser console — the stats bar at the bottom of the canvas prints visited-node counts and path cost after each run.

- Click **Run** to animate a single algorithm step-by-step.
- Click **Race** to compare all three at once.
- Click **Maze** to generate a random obstacle layout.
- Click **Live Path** then draw walls to see the path update in real time.
- Click **Wanderers** to spawn NPCs and enable live-mode rerouting around them.

---

## Contact & ownership

Authors: Yuva, Yash, Ansh (CSA Week 25).

If you add API-breaking changes (new constructor parameters, renamed public methods, new required cell types), update this document and the matching cells in the notebook.
