# graph-heuristics

An interactive pathfinding visualizer built as a game level for the CSA Data Structures unit. Students observe A*, Dijkstra's, and Greedy BFS running on a live 2D grid maze.

## Usage

Start the local preview server (see repo Makefile), then navigate to:

```
/csa/graph-heuristics2
```

## What it does

- Renders a 12×20 grid where you can place walls and weighted cells by clicking and dragging
- Animates three search algorithms step-by-step so the frontier expansion is visible
- **Run** — animate a single algorithm (A*, Dijkstra's, or Greedy BFS)
- **Race** — run all three simultaneously and compare visited-node counts and path cost
- **Live Path** — reroutes the path in real time as you draw obstacles
- **Maze** — generates a random wall/weight layout
- **Wanderers** — spawns NPC sprites that move around and force live rerouting

## Files

| File | Purpose |
|---|---|
| `GameLevelGraphHeuristics.js` | All maze and pathfinding logic |
| `2025-05-22-graph-heuristics2.ipynb` | Paired lesson notebook |

## Notes

For implementation details — coordinate system, data shapes, how to add algorithms or cell types — see [`docs/GRAPH_HEURISTICS.md`](docs/GRAPH_HEURISTICS.md).

Authors: Yuva, Yash, Ansh (CSA Week 25).
