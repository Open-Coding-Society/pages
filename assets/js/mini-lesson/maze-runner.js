const CSS = `
.maze-runner-root { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1a1a2e; color: #eee; display: flex; flex-direction: column; align-items: center; padding: 10px; overflow: auto; box-sizing: border-box; width: 100%; height: 100%; }
.maze-runner-root * { box-sizing: border-box; }
.maze-runner-root h1 { font-size: 1.3em; margin-bottom: 6px; color: #e94560; }
.maze-runner-root .controls { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 8px; }
.maze-runner-root .controls button { padding: 6px 14px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: 600; transition: all 0.2s; }
.maze-runner-root .btn-algo { background: #16213e; color: #e94560; border: 2px solid #e94560; }
.maze-runner-root .btn-algo:hover, .maze-runner-root .btn-algo.active { background: #e94560; color: #fff; }
.maze-runner-root .btn-action { background: #0f3460; color: #53d8fb; border: 2px solid #53d8fb; }
.maze-runner-root .btn-action:hover { background: #53d8fb; color: #1a1a2e; }
.maze-runner-root .btn-wall { background: #16213e; color: #f5a623; border: 2px solid #f5a623; }
.maze-runner-root .btn-wall.active { background: #f5a623; color: #1a1a2e; }
.maze-runner-root .btn-weight { background: #16213e; color: #a29bfe; border: 2px solid #a29bfe; }
.maze-runner-root .btn-weight.active { background: #a29bfe; color: #1a1a2e; }
.maze-runner-root .btn-npc { background: #16213e; color: #55efc4; border: 2px solid #55efc4; }
.maze-runner-root .btn-npc.active { background: #55efc4; color: #1a1a2e; }
.maze-runner-root .btn-live { background: #16213e; color: #fd79a8; border: 2px solid #fd79a8; }
.maze-runner-root .btn-live.active { background: #fd79a8; color: #1a1a2e; animation: mr-pulse 1s ease-in-out infinite; }
@keyframes mr-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
.maze-runner-root .legend { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 8px; font-size: 0.75em; }
.maze-runner-root .legend-item { display: flex; align-items: center; gap: 4px; }
.maze-runner-root .legend-color { width: 14px; height: 14px; border-radius: 3px; border: 1px solid #333; }
.maze-runner-root #grid-wrapper { position: relative; display: inline-block; }
.maze-runner-root #grid { display: inline-grid; gap: 1px; background: #16213e; border: 2px solid #0f3460; border-radius: 4px; padding: 2px; cursor: pointer; }
.maze-runner-root #npc-canvas { position: absolute; top: 0; left: 0; pointer-events: none; }
.maze-runner-root .cell { width: 28px; height: 28px; border-radius: 3px; transition: background 0.1s; display: flex; align-items: center; justify-content: center; font-size: 0.65em; font-weight: 700; user-select: none; }
.maze-runner-root .cell-empty   { background: #222244; }
.maze-runner-root .cell-wall    { background: #e94560; }
.maze-runner-root .cell-weight  { background: #a29bfe; }
.maze-runner-root .cell-start   { background: #00b894; }
.maze-runner-root .cell-end     { background: #fdcb6e; }
.maze-runner-root .cell-visited { background: #0f3460; }
.maze-runner-root .cell-path    { background: #53d8fb; }
.maze-runner-root #stats { margin-top: 8px; font-size: 0.8em; text-align: center; min-height: 40px; }
.maze-runner-root .speed-control { display: flex; align-items: center; gap: 6px; font-size: 0.8em; margin-bottom: 6px; }
.maze-runner-root #reroute-flash { font-weight: 700; color: #fd79a8; }
`;

const HTML = `
<h1>Maze Runner: Algorithm Race</h1>
<div class="legend">
  <div class="legend-item"><div class="legend-color" style="background:#00b894"></div> Start</div>
  <div class="legend-item"><div class="legend-color" style="background:#fdcb6e"></div> Goal</div>
  <div class="legend-item"><div class="legend-color" style="background:#e94560"></div> Wall</div>
  <div class="legend-item"><div class="legend-color" style="background:#a29bfe"></div> Weight (5x)</div>
  <div class="legend-item"><div class="legend-color" style="background:#0f3460"></div> Visited</div>
  <div class="legend-item"><div class="legend-color" style="background:#53d8fb"></div> Path</div>
  <div class="legend-item"><div class="legend-color" style="background:#fd79a8; border:2px solid #fff"></div> NPC obstacle</div>
</div>
<div class="controls">
  <button class="btn-algo active" id="btn-astar">A*</button>
  <button class="btn-algo"        id="btn-dijkstra">Dijkstra</button>
  <button class="btn-algo"        id="btn-greedy">Greedy BFS</button>
  <button class="btn-wall active" id="btn-draw-wall">Draw Walls</button>
  <button class="btn-weight"      id="btn-draw-weight">Draw Weights</button>
  <button class="btn-action"      id="btn-run">Run</button>
  <button class="btn-action"      id="btn-race">Race All 3</button>
  <button class="btn-action"      id="btn-clear-path">Clear Path</button>
  <button class="btn-action"      id="btn-clear-all">Clear All</button>
  <button class="btn-action"      id="btn-gen-maze">Random Maze</button>
  <button class="btn-npc active"  id="btn-npcs">Wanderers</button>
  <button class="btn-live"        id="btn-live">Live Path</button>
</div>
<div class="speed-control">
  <label>Speed:</label>
  <input type="range" id="speed" min="1" max="100" value="50" style="width:120px;">
  <span id="speed-label">50ms</span>
</div>
<div id="grid-wrapper">
  <div id="grid"></div>
  <canvas id="npc-canvas"></canvas>
</div>
<div id="stats"></div>
`;

export class MazeRunner {
  constructor(container) {
    if (!container) return;

    // Inject scoped CSS once
    if (!document.getElementById('maze-runner-styles')) {
      const style = document.createElement('style');
      style.id = 'maze-runner-styles';
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    container.classList.add('maze-runner-root');
    container.innerHTML = HTML;

    const $ = (id) => container.querySelector('#' + id);
    const $$ = (sel) => container.querySelectorAll(sel);

    const ROWS = 16, COLS = 26;
    const CELL = 28, GAP = 1, PAD = 2;
    const WALL = 1, WEIGHT = 2, START = 3, END = 4;
    let grid = [];
    let startR = 1, startC = 1, endR = ROWS - 2, endC = COLS - 2;
    let selectedAlgo = 'astar';
    let drawMode = 'wall';
    let isDrawing = false;
    let isRunning = false;

    // ─── Live Mode ────────────────────────────────────────────────────────────────
    let liveMode = false;
    let lastPathKeys = [];
    let rerouteCount = 0;

    const toggleLiveMode = () => {
      if (isRunning) return;
      liveMode = !liveMode;
      $('btn-live').classList.toggle('active', liveMode);
      if (liveMode) {
        if (!npcsVisible) toggleNpcs();
        instantRepath();
        $('stats').innerHTML = 'Live Path active — wanderers are now obstacles. Watch the path reroute!';
      } else {
        rerouteCount = 0;
        clearPathSilent();
        $('stats').textContent = '';
      }
      drawNpcs();
    };

    const npcOccupies = (r, c) => {
      if (!liveMode || !npcsVisible) return false;
      for (var i = 0; i < npcs.length; i++) {
        if (npcs[i].r === r && npcs[i].c === c) return true;
      }
      return false;
    };

    const runSearchSync = (algo) => {
      var open = [], visited = {}, parent = {}, gScore = {};
      const key = (r, c) => r * COLS + c;
      var startKey = key(startR, startC);
      gScore[startKey] = 0;
      var h0 = algo === 'dijkstra' ? 0 : heuristic(startR, startC);
      open.push({ r: startR, c: startC, f: h0 });
      var nodesVisited = 0;

      while (open.length > 0) {
        open.sort((a, b) => a.f - b.f);
        var curr = open.shift();
        var ck = key(curr.r, curr.c);
        if (visited[ck]) continue;
        visited[ck] = true;
        nodesVisited++;

        if (curr.r === endR && curr.c === endC) {
          var pathKeys = [];
          var pk = ck;
          while (pk !== undefined && pk !== startKey) { pathKeys.push(pk); pk = parent[pk]; }
          pathKeys.push(startKey);
          pathKeys.reverse();
          return { found: true, nodesVisited, pathCost: gScore[ck], pathKeys };
        }

        var nbrs = neighborsBlocking(curr.r, curr.c);
        for (var n = 0; n < nbrs.length; n++) {
          var nr = nbrs[n][0], nc = nbrs[n][1];
          var nk = key(nr, nc);
          if (visited[nk]) continue;
          var tentG = (gScore[ck] || 0) + cost(nr, nc);
          if (tentG < (gScore[nk] !== undefined ? gScore[nk] : Infinity)) {
            gScore[nk] = tentG;
            parent[nk] = ck;
            var h = algo === 'dijkstra' ? 0 : heuristic(nr, nc);
            open.push({ r: nr, c: nc, f: algo === 'greedy' ? h : (tentG + h) });
          }
        }
      }
      return { found: false, nodesVisited, pathCost: 0, pathKeys: [] };
    };

    const clearPathSilent = () => {
      $$('.cell-visited, .cell-path').forEach(el => {
        var r = +el.dataset.r, c = +el.dataset.c;
        el.className = 'cell ' + cellClass(grid[r][c]);
        if (grid[r][c] === WEIGHT)     el.textContent = '5';
        else if (grid[r][c] === START) el.textContent = 'S';
        else if (grid[r][c] === END)   el.textContent = 'G';
        else                           el.textContent = '';
      });
    };

    const paintPathKeys = (pathKeys) => {
      for (var i = 0; i < pathKeys.length; i++) {
        var pr = Math.floor(pathKeys[i] / COLS), pc = pathKeys[i] % COLS;
        if (grid[pr][pc] !== START && grid[pr][pc] !== END) {
          getCellEl(pr, pc).className = 'cell cell-path';
        }
      }
    };

    const instantRepath = () => {
      if (isRunning) return;
      clearPathSilent();
      var result = runSearchSync(selectedAlgo);
      var algoNames = { astar: 'A*', dijkstra: "Dijkstra's", greedy: 'Greedy BFS' };

      var blocked = false;
      if (lastPathKeys.length > 0) {
        for (var i = 0; i < npcs.length; i++) {
          var nk = npcs[i].r * COLS + npcs[i].c;
          if (lastPathKeys.indexOf(nk) !== -1) { blocked = true; break; }
        }
      }
      if (blocked) rerouteCount++;

      if (result.found) {
        paintPathKeys(result.pathKeys);
        lastPathKeys = result.pathKeys;
        var rerouteMsg = blocked
          ? ' &nbsp;<span id="reroute-flash">&#8635; REROUTED! (' + rerouteCount + ')</span>'
          : '';
        $('stats').innerHTML =
          '<strong>Live: ' + algoNames[selectedAlgo] + '</strong> &mdash; ' +
          'Nodes explored: <strong>' + result.nodesVisited + '</strong> | ' +
          'Path cost: <strong>' + result.pathCost + '</strong>' + rerouteMsg;
      } else {
        lastPathKeys = [];
        $('stats').innerHTML =
          '<strong>Live: ' + algoNames[selectedAlgo] + '</strong> &mdash; ' +
          '<span style="color:#e94560">&#9888; Path blocked by wanderers!</span>';
      }
    };

    // ─── NPC System ───────────────────────────────────────────────────────────────
    const SPRITE_DEFS = [
      { src: '/images/gamify/chillguy.png',  frameW: 128, frameH: 128, animFrames: 3, dirRows: { right: 1, left: 2, up: 0, down: 0 } },
      { src: '/images/gamify/r2_idle.png',   frameW: 168, frameH: 223, animFrames: 3, dirRows: { right: 0, left: 0, up: 0, down: 0 } }
    ];

    const spriteImgs = SPRITE_DEFS.map(def => {
      var img = new Image(); img.src = def.src; return img;
    });

    let npcs = [];
    let npcsVisible = true;
    let npcMoveTimer = null;
    let npcAnimTimer = null;

    const cellPx = (c) => PAD + c * (CELL + GAP);
    const rowPx  = (r) => PAD + r * (CELL + GAP);

    const initNpcs = () => {
      npcs = [];
      var configs = [
        { spriteIdx: 0, r: 2,                    c: Math.floor(COLS / 2) },
        { spriteIdx: 0, r: ROWS - 3,             c: Math.floor(COLS / 3) },
        { spriteIdx: 1, r: Math.floor(ROWS / 2), c: COLS - 3 }
      ];
      configs.forEach(cfg => {
        var r = cfg.r, c = cfg.c;
        if (grid[r] && grid[r][c] === WALL) r = Math.max(0, r - 1);
        npcs.push({ r, c, dir: 'right', frame: 0, frameCounter: 0, spriteIdx: cfg.spriteIdx });
      });
    };

    const randomWalkableNeighbor = (npcIdx) => {
      var npc = npcs[npcIdx];
      var dirs = [[-1,0,'up'],[1,0,'down'],[0,-1,'left'],[0,1,'right']];
      for (var i = dirs.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = dirs[i]; dirs[i] = dirs[j]; dirs[j] = tmp;
      }
      for (var d = 0; d < dirs.length; d++) {
        var nr = npc.r + dirs[d][0], nc = npc.c + dirs[d][1];
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (grid[nr][nc] === WALL) continue;
        var stacked = false;
        for (var k = 0; k < npcs.length; k++) {
          if (k !== npcIdx && npcs[k].r === nr && npcs[k].c === nc) { stacked = true; break; }
        }
        if (!stacked) return { r: nr, c: nc, dir: dirs[d][2] };
      }
      return null;
    };

    const stepNpcs = () => {
      if (!npcsVisible) return;
      for (var i = 0; i < npcs.length; i++) {
        var next = randomWalkableNeighbor(i);
        if (next) { npcs[i].r = next.r; npcs[i].c = next.c; npcs[i].dir = next.dir; }
      }
      drawNpcs();
      if (liveMode) instantRepath();
    };

    const animNpcs = () => {
      if (!npcsVisible) return;
      npcs.forEach(npc => {
        npc.frameCounter++;
        if (npc.frameCounter % 4 === 0) {
          npc.frame = (npc.frame + 1) % SPRITE_DEFS[npc.spriteIdx].animFrames;
        }
      });
      drawNpcs();
    };

    const drawNpcs = () => {
      var canvas = $('npc-canvas');
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!npcsVisible) return;

      npcs.forEach(npc => {
        var def = SPRITE_DEFS[npc.spriteIdx];
        var img = spriteImgs[npc.spriteIdx];
        var destX = cellPx(npc.c) + 1;
        var destY = rowPx(npc.r) + 1;
        var size = CELL - 2;

        if (liveMode) {
          ctx.save();
          ctx.shadowColor = '#fd79a8';
          ctx.shadowBlur = 8;
          ctx.strokeStyle = '#fd79a8';
          ctx.lineWidth = 2;
          ctx.strokeRect(destX - 1, destY - 1, size + 2, size + 2);
          ctx.restore();
        }

        if (!img.complete || !img.naturalWidth) {
          ctx.fillStyle = liveMode ? '#fd79a8' : '#55efc4';
          ctx.fillRect(destX, destY, size, size);
          return;
        }

        var row = def.dirRows[npc.dir] || 0;
        var srcX = npc.frame * def.frameW;
        var srcY = row * def.frameH;

        ctx.save();
        if (npc.dir === 'left') {
          ctx.translate(destX + size, destY);
          ctx.scale(-1, 1);
          ctx.drawImage(img, srcX, srcY, def.frameW, def.frameH, 0, 0, size, size);
        } else {
          ctx.drawImage(img, srcX, srcY, def.frameW, def.frameH, destX, destY, size, size);
        }
        ctx.restore();
      });
    };

    const resizeNpcCanvas = () => {
      var gridEl = $('grid');
      var canvas = $('npc-canvas');
      canvas.width  = gridEl.offsetWidth  || (COLS * (CELL + GAP) + PAD * 2 - GAP + 4);
      canvas.height = gridEl.offsetHeight || (ROWS * (CELL + GAP) + PAD * 2 - GAP + 4);
    };

    const startNpcTimers = () => {
      if (npcMoveTimer) clearInterval(npcMoveTimer);
      if (npcAnimTimer) clearInterval(npcAnimTimer);
      npcMoveTimer = setInterval(stepNpcs, 600);
      npcAnimTimer = setInterval(animNpcs, 120);
    };

    const toggleNpcs = () => {
      npcsVisible = !npcsVisible;
      $('btn-npcs').classList.toggle('active', npcsVisible);
      if (!npcsVisible) {
        var canvas = $('npc-canvas');
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        if (liveMode) toggleLiveMode();
      } else {
        drawNpcs();
      }
    };

    // ─── Grid ─────────────────────────────────────────────────────────────────────

    const init = () => {
      grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      grid[startR][startC] = START;
      grid[endR][endC] = END;
      renderGrid();
      initNpcs();
      drawNpcs();
    };

    const renderGrid = () => {
      var el = $('grid');
      el.style.gridTemplateColumns = 'repeat(' + COLS + ', ' + CELL + 'px)';
      el.innerHTML = '';
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          var cell = document.createElement('div');
          cell.className = 'cell ' + cellClass(grid[r][c]);
          cell.dataset.r = r;
          cell.dataset.c = c;
          if (grid[r][c] === WEIGHT) cell.textContent = '5';
          if (grid[r][c] === START)  cell.textContent = 'S';
          if (grid[r][c] === END)    cell.textContent = 'G';
          cell.addEventListener('mousedown', ((row, col) => (e) => { e.preventDefault(); isDrawing = true; toggleCell(row, col); })(r, c));
          cell.addEventListener('mouseenter', ((row, col) => () => { if (isDrawing) toggleCell(row, col); })(r, c));
          cell.addEventListener('mouseup', () => { isDrawing = false; });
          el.appendChild(cell);
        }
      }
      requestAnimationFrame(() => { resizeNpcCanvas(); drawNpcs(); });
    };

    const cellClass = (v) => {
      if (v === WALL)   return 'cell-wall';
      if (v === WEIGHT) return 'cell-weight';
      if (v === START)  return 'cell-start';
      if (v === END)    return 'cell-end';
      return 'cell-empty';
    };

    const getCellEl = (r, c) => $('grid').children[r * COLS + c];

    const toggleCell = (r, c) => {
      if (grid[r][c] === START || grid[r][c] === END || isRunning) return;
      var val = drawMode === 'wall' ? WALL : WEIGHT;
      grid[r][c] = grid[r][c] === val ? 0 : val;
      var cell = getCellEl(r, c);
      cell.className = 'cell ' + cellClass(grid[r][c]);
      cell.textContent = grid[r][c] === WEIGHT ? '5' : '';
      if (liveMode) instantRepath();
    };

    const selectAlgo = (algo) => {
      selectedAlgo = algo;
      $$('.btn-algo').forEach(b => b.classList.remove('active'));
      $('btn-' + algo).classList.add('active');
      if (liveMode) instantRepath();
    };

    const setDrawMode = (mode) => {
      drawMode = mode;
      $('btn-draw-wall').classList.toggle('active', mode === 'wall');
      $('btn-draw-weight').classList.toggle('active', mode === 'weight');
    };

    const getDelay = () => 101 - $('speed').value;

    const clearPath = () => {
      if (isRunning) return;
      if (liveMode) { toggleLiveMode(); return; }
      clearPathSilent();
      $('stats').textContent = '';
    };

    const clearAll = () => {
      if (isRunning) return;
      if (liveMode) { liveMode = false; $('btn-live').classList.remove('active'); }
      rerouteCount = 0; lastPathKeys = [];
      init();
      $('stats').textContent = '';
    };

    const generateMaze = () => {
      if (isRunning) return;
      grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      grid[startR][startC] = START;
      grid[endR][endC] = END;
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          if (grid[r][c] !== 0) continue;
          var rand = Math.random();
          if (rand < 0.28)      grid[r][c] = WALL;
          else if (rand < 0.35) grid[r][c] = WEIGHT;
        }
      }
      renderGrid();
      initNpcs();
      if (liveMode) instantRepath();
    };

    // ─── Pathfinding ──────────────────────────────────────────────────────────────

    const neighbors = (r, c) => neighborsBlocking(r, c, false);

    const neighborsBlocking = (r, c, checkNpcs = true) => {
      var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
      var result = [];
      for (var i = 0; i < dirs.length; i++) {
        var nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (grid[nr][nc] === WALL) continue;
        if (checkNpcs && npcOccupies(nr, nc)) continue;
        result.push([nr, nc]);
      }
      return result;
    };

    const heuristic = (r, c) => Math.abs(r - endR) + Math.abs(c - endC);
    const cost      = (r, c) => grid[r][c] === WEIGHT ? 5 : 1;
    const sleep     = (ms)   => new Promise(res => setTimeout(res, ms));

    const runSearch = async (algo, animate) => {
      var open = [], visited = {}, parent = {}, gScore = {};
      const key = (r, c) => r * COLS + c;
      var startKey = key(startR, startC);
      gScore[startKey] = 0;
      var h0 = algo === 'dijkstra' ? 0 : heuristic(startR, startC);
      open.push({ r: startR, c: startC, f: h0 });
      var nodesVisited = 0;

      while (open.length > 0) {
        open.sort((a, b) => a.f - b.f);
        var curr = open.shift();
        var ck = key(curr.r, curr.c);
        if (visited[ck]) continue;
        visited[ck] = true;
        nodesVisited++;

        if (animate && grid[curr.r][curr.c] !== START && grid[curr.r][curr.c] !== END) {
          getCellEl(curr.r, curr.c).className = 'cell cell-visited';
          if (getDelay() > 5) await sleep(getDelay());
        }

        if (curr.r === endR && curr.c === endC) {
          var path = [];
          var pk = ck;
          while (pk !== undefined && pk !== startKey) { path.push(pk); pk = parent[pk]; }
          path.push(startKey);
          path.reverse();

          if (animate) {
            for (var i = 0; i < path.length; i++) {
              var pr = Math.floor(path[i] / COLS), pc = path[i] % COLS;
              if (grid[pr][pc] !== START && grid[pr][pc] !== END) getCellEl(pr, pc).className = 'cell cell-path';
              if (getDelay() > 5) await sleep(getDelay() / 2);
            }
          }
          return { found: true, nodesVisited, pathLength: path.length, pathCost: gScore[ck] };
        }

        var nbrs = neighbors(curr.r, curr.c);
        for (var n = 0; n < nbrs.length; n++) {
          var nr = nbrs[n][0], nc = nbrs[n][1];
          var nk = key(nr, nc);
          if (visited[nk]) continue;
          var tentG = (gScore[ck] || 0) + cost(nr, nc);
          if (tentG < (gScore[nk] !== undefined ? gScore[nk] : Infinity)) {
            gScore[nk] = tentG;
            parent[nk] = ck;
            var h = algo === 'dijkstra' ? 0 : heuristic(nr, nc);
            open.push({ r: nr, c: nc, f: algo === 'greedy' ? h : (tentG + h) });
          }
        }
      }
      return { found: false, nodesVisited, pathLength: 0, pathCost: 0 };
    };

    const runAlgorithm = async () => {
      if (isRunning) return;
      if (liveMode) toggleLiveMode();
      isRunning = true;
      clearPathSilent();
      var algoNames = { astar: 'A*', dijkstra: "Dijkstra's", greedy: 'Greedy BFS' };
      var result = await runSearch(selectedAlgo, true);
      $('stats').innerHTML = result.found
        ? '<strong>' + algoNames[selectedAlgo] + '</strong> &mdash; Nodes visited: <strong>' + result.nodesVisited + '</strong> | Path length: <strong>' + result.pathLength + '</strong> | Path cost: <strong>' + result.pathCost + '</strong>'
        : '<strong>' + algoNames[selectedAlgo] + '</strong> &mdash; No path found!';
      isRunning = false;
    };

    const raceAll = async () => {
      if (isRunning) return;
      if (liveMode) toggleLiveMode();
      isRunning = true;
      clearPathSilent();

      var algos = ['greedy', 'dijkstra', 'astar'];
      var algoNames = { astar: 'A*', dijkstra: "Dijkstra's", greedy: 'Greedy BFS' };
      var colors = { astar: '#53d8fb', dijkstra: '#00b894', greedy: '#e94560' };
      var results = {};

      for (var i = 0; i < algos.length; i++) results[algos[i]] = await runSearch(algos[i], false);

      var html = '<strong>Race Results:</strong><br>';
      for (var j = 0; j < algos.length; j++) {
        var algo = algos[j], r = results[algo];
        html += '<span style="color:' + colors[algo] + '">' + algoNames[algo] + '</span>: ';
        html += r.found
          ? 'Visited <strong>' + r.nodesVisited + '</strong> nodes, Cost: <strong>' + r.pathCost + '</strong>, Length: <strong>' + r.pathLength + '</strong>'
          : 'No path found';
        html += '<br>';
      }

      var bestAlgo = null, bestVisited = Infinity;
      for (var k = 0; k < algos.length; k++) {
        if (results[algos[k]].found && results[algos[k]].nodesVisited < bestVisited) {
          bestVisited = results[algos[k]].nodesVisited; bestAlgo = algos[k];
        }
      }
      if (bestAlgo) {
        html += '<br>Winner (fewest nodes): <strong style="color:' + colors[bestAlgo] + '">' + algoNames[bestAlgo] + '</strong>';
        await runSearch('astar', true);
      }

      $('stats').innerHTML = html;
      isRunning = false;
    };

    // ─── Wire up buttons ──────────────────────────────────────────────────────────
    $('btn-astar').onclick     = () => selectAlgo('astar');
    $('btn-dijkstra').onclick  = () => selectAlgo('dijkstra');
    $('btn-greedy').onclick    = () => selectAlgo('greedy');
    $('btn-draw-wall').onclick = () => setDrawMode('wall');
    $('btn-draw-weight').onclick = () => setDrawMode('weight');
    $('btn-run').onclick       = () => runAlgorithm();
    $('btn-race').onclick      = () => raceAll();
    $('btn-clear-path').onclick = () => clearPath();
    $('btn-clear-all').onclick = () => clearAll();
    $('btn-gen-maze').onclick  = () => generateMaze();
    $('btn-npcs').onclick      = () => toggleNpcs();
    $('btn-live').onclick      = () => toggleLiveMode();

    $('speed').addEventListener('input', function () {
      $('speed-label').textContent = (101 - this.value) + 'ms';
    });
    $('speed-label').textContent = getDelay() + 'ms';

    document.addEventListener('mouseup', () => { isDrawing = false; });

    init();
    startNpcTimers();
  }
}
