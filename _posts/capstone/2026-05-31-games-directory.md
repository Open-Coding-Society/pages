---
layout: post
title: OCS Games Directory
description: Every game and interactive lesson built in the Open Coding Society projects system, organized by what they teach.
courses: {'csse': {'week': 25}}
type: showcase
categories: Capstone
permalink: /capstone/games/
tailwind: true
toc: false
---

<style>
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
  margin-top: 24px;
}
.game-card {
  background: #0d1117;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.18s, box-shadow 0.18s;
  display: flex;
  flex-direction: column;
}
.game-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.45); }
.game-thumb { width: 100%; height: 148px; object-fit: cover; background: #1a2035; display: block; }
.game-thumb-placeholder { width: 100%; height: 148px; display: flex; align-items: center; justify-content: center; font-size: 2.6rem; }
.game-body { padding: 13px 15px 15px; flex: 1; display: flex; flex-direction: column; gap: 7px; }
.game-cat-badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; width: fit-content; }
.game-title { font-size: 1.02rem; font-weight: 700; color: #f1f5f9; margin: 0; line-height: 1.3; }
.game-desc { font-size: 0.81rem; color: #94a3b8; margin: 0; line-height: 1.5; flex: 1; }
.game-learn { font-size: 0.74rem; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 7px; }
.game-learn span { color: #7dd3fc; font-weight: 600; }
.game-actions { display: flex; gap: 8px; margin-top: 8px; }
.game-play-btn {
  flex: 1; text-align: center; background: #1d4ed8; color: #fff; font-weight: 700;
  font-size: 0.86rem; padding: 8px 0; border-radius: 8px; text-decoration: none;
  transition: background 0.15s;
}
.game-play-btn:hover { background: #2563eb; text-decoration: none; color: #fff; }
.game-dig-btn {
  background: #1e293b; color: #94a3b8; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; font-size: 0.82rem; font-weight: 600; padding: 8px 12px;
  cursor: pointer; white-space: nowrap; transition: background 0.15s, color 0.15s;
}
.game-dig-btn:hover { background: #273548; color: #e2e8f0; }
.game-dig-btn.open { background: #0f172a; color: #7dd3fc; border-color: rgba(125,211,252,0.3); }

/* Drawer */
.game-drawer {
  max-height: 0; overflow: hidden;
  transition: max-height 0.35s ease, opacity 0.25s ease;
  opacity: 0;
  border-top: 0px solid transparent;
}
.game-drawer.open {
  max-height: 600px; opacity: 1;
  border-top: 1px solid rgba(255,255,255,0.07);
}
.drawer-inner { padding: 14px 15px 16px; display: flex; flex-direction: column; gap: 13px; }
.drawer-section-label {
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  color: #475569; margin-bottom: 4px;
}
.drawer-concept { font-size: 0.82rem; color: #cbd5e1; line-height: 1.55; }
.drawer-links { display: flex; flex-direction: column; gap: 7px; }
.drawer-link {
  display: flex; align-items: center; gap: 9px; padding: 8px 11px;
  background: #0b1220; border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px; text-decoration: none; transition: background 0.15s, border-color 0.15s;
}
.drawer-link:hover { background: #111d2e; border-color: rgba(125,211,252,0.25); text-decoration: none; }
.drawer-link-icon { font-size: 1rem; flex-shrink: 0; }
.drawer-link-text { display: flex; flex-direction: column; gap: 1px; }
.drawer-link-title { font-size: 0.81rem; font-weight: 600; color: #e2e8f0; }
.drawer-link-sub { font-size: 0.72rem; color: #64748b; }
.drawer-pr { background: #0b1220; border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px 12px; }
.drawer-pr-steps { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.drawer-pr-step { display: flex; gap: 8px; align-items: flex-start; font-size: 0.79rem; color: #94a3b8; line-height: 1.45; }
.drawer-pr-step-num { background: #1e3a5f; color: #7dd3fc; border-radius: 4px; padding: 1px 6px; font-weight: 700; font-size: 0.72rem; flex-shrink: 0; margin-top: 1px; }

/* Concept Search */
.concept-search-wrap { margin-bottom: 20px; }
.concept-search-label {
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  color: #475569; margin-bottom: 6px; display: block;
}
.concept-search-input {
  width: 100%; background: #0b1220; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; color: #e2e8f0; font-size: 0.88rem;
  padding: 10px 40px 10px 14px; outline: none; box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.concept-search-input::placeholder { color: #334155; }
.concept-search-input:focus {
  border-color: rgba(125,211,252,0.4);
  box-shadow: 0 0 0 3px rgba(125,211,252,0.07);
}
.concept-search-clear {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #475569; font-size: 1rem;
  cursor: pointer; padding: 2px; display: none; line-height: 1; transition: color 0.15s;
}
.concept-search-clear:hover { color: #94a3b8; }
.concept-search-clear.visible { display: block; }
.concept-result-row { display: flex; align-items: center; gap: 10px; margin-top: 7px; min-height: 1.1em; }
#concept-result-count { font-size: 0.76rem; color: #475569; transition: color 0.2s; flex: 1; }
#concept-result-count.has-results { color: #7dd3fc; }
.concept-share-btn {
  display: none; align-items: center; gap: 5px;
  background: #0b1220; border: 1px solid rgba(125,211,252,0.25);
  color: #7dd3fc; border-radius: 6px; font-size: 0.74rem; font-weight: 600;
  padding: 4px 10px; cursor: pointer; white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;
}
.concept-share-btn:hover { background: #111d2e; border-color: rgba(125,211,252,0.45); }
.concept-share-btn.visible { display: flex; }
.concept-share-btn.copied { color: #4ade80; border-color: rgba(74,222,128,0.35); }

/* Card concept match states */
.game-card { transition: transform 0.18s, box-shadow 0.18s, opacity 0.22s, border-color 0.22s; }
.game-card.card-dimmed { opacity: 0.15; pointer-events: none; transform: none !important; }
.game-card.card-matched { border-color: rgba(125,211,252,0.4); box-shadow: 0 0 0 1px rgba(125,211,252,0.12), 0 8px 24px rgba(0,0,0,0.3); }

/* Concept snippet injected on match */
.concept-snippet {
  font-size: 0.74rem; color: #64748b; line-height: 1.55;
  border-top: 1px solid rgba(125,211,252,0.1);
  padding: 8px 15px 10px;
  background: rgba(125,211,252,0.03);
}
.concept-snippet mark {
  background: rgba(125,211,252,0.18); color: #7dd3fc;
  border-radius: 3px; padding: 0 2px; font-weight: 600; font-style: normal;
}

/* Filter */
.filter-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
.filter-btn { padding: 6px 14px; border-radius: 999px; font-size: 0.81rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: opacity 0.15s, transform 0.1s; background: #1e293b; color: #94a3b8; }
.filter-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.filter-btn.active { color: #fff; }
#game-count { font-size: 0.78rem; color: #475569; margin-top: 8px; }
</style>

## OCS Games Directory

These games were built by students on top of the **OCS Game Engine** — a shared JavaScript framework handling rendering, physics, input, and scene management. Each one demonstrates a distinct concept in computer science.

Hit **Dig Deeper** on any card to see the concept, the exact source file, a notebook link, and how to open a PR.

---

<div class="concept-search-wrap">
  <span class="concept-search-label">Concept Search &mdash; find games by what they teach</span>
  <div style="position:relative;">
    <input class="concept-search-input" id="concept-search" type="text"
      placeholder="Try 'gravity', 'async', 'state machine', 'normalize', 'websocket'..."
      oninput="conceptSearch(this.value)" autocomplete="off" spellcheck="false">
    <button class="concept-search-clear" id="concept-clear" onclick="clearConceptSearch()" title="Clear">&times;</button>
  </div>
  <div class="concept-result-row">
    <span id="concept-result-count"></span>
    <button class="concept-share-btn" id="concept-share" onclick="shareConceptLink()">
      &#x1F517; Copy Link
    </button>
  </div>
</div>

<div class="filter-bar" id="filter-bar">
  <button class="filter-btn active" data-filter="all" style="background:#334155;color:#f1f5f9;" onclick="filterGames('all',this)">All Games</button>
  <button class="filter-btn" data-filter="physics" onclick="filterGames('physics',this)">Physics</button>
  <button class="filter-btn" data-filter="collision" onclick="filterGames('collision',this)">Collision</button>
  <button class="filter-btn" data-filter="ai" onclick="filterGames('ai',this)">AI &amp; Enemies</button>
  <button class="filter-btn" data-filter="multiplayer" onclick="filterGames('multiplayer',this)">Multiplayer</button>
  <button class="filter-btn" data-filter="webapi" onclick="filterGames('webapi',this)">Web APIs</button>
  <button class="filter-btn" data-filter="logic" onclick="filterGames('logic',this)">Logic &amp; CS</button>
  <button class="filter-btn" data-filter="adventure" onclick="filterGames('adventure',this)">Adventure</button>
</div>
<p id="game-count"></p>

<div class="games-grid" id="games-grid">

  <div class="game-card" data-category="physics" data-game="platformer">
    <img class="game-thumb" src="/images/projects/platformer/jumping-toad.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#1e3a5f,#2563eb)">🐸</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(37,99,235,0.2);color:#60a5fa">Physics</div>
      <p class="game-title">Platformer + Gravity</p>
      <p class="game-desc">Demo + lesson on platformer physics — gravity, jumping arcs, and platform detection.</p>
      <p class="game-learn"><span>Concepts:</span> gravity simulation, vector math, platform collision</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/platformer">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="physics" data-game="astronaut-platformer-game">
    <img class="game-thumb" src="/images/projects/astronaut-platformer-game/Mine.jpg" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#0f2044,#1d4ed8)">🚀</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(37,99,235,0.2);color:#60a5fa">Physics</div>
      <p class="game-title">Astronaut Platformer</p>
      <p class="game-desc">Gravity, moving platforms, and precise collision timing in a space environment.</p>
      <p class="game-learn"><span>Concepts:</span> gravity tuning, moving platform sync, timing windows</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/astro-platgame-lesson/">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="physics" data-game="spline-barriers">
    <img class="game-thumb" src="/images/projects/spline-barriers/castleOutside.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#1c2b4a,#3b82f6)">〰️</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(37,99,235,0.2);color:#60a5fa">Physics</div>
      <p class="game-title">Spline Barriers</p>
      <p class="game-desc">Demo + lesson on curved, spline-based barriers instead of straight walls.</p>
      <p class="game-learn"><span>Concepts:</span> parametric curves, waypoint interpolation, non-linear collision</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/spline-barriers">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="physics" data-game="red-riding">
    <img class="game-thumb" src="/images/projects/red-riding/Finalred.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#4c0519,#be123c)">🌲</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(37,99,235,0.2);color:#60a5fa">Physics</div>
      <p class="game-title">Red Riding Hood</p>
      <p class="game-desc">Smooth waypoint-based movement through the forest — spline navigation as a story.</p>
      <p class="game-learn"><span>Concepts:</span> splines, waypoint graphs, path following</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/red-riding">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="physics" data-game="transitions">
    <img class="game-thumb" src="/images/projects/transitions/Garret2.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#1a1a2e,#7c3aed)">✨</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(37,99,235,0.2);color:#60a5fa">Physics</div>
      <p class="game-title">Transition Screens</p>
      <p class="game-desc">Lesson + demo on smooth scene transitions — fades, wipes, and animated UI between levels.</p>
      <p class="game-learn"><span>Concepts:</span> CSS animations, game state machines, UX feedback</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/sprintingsnails-transitions">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="collision" data-game="heist-exe">
    <img class="game-thumb" src="/images/projects/heist-exe/heist-bg.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#1c1c1c,#f59e0b)">💎</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(245,158,11,0.18);color:#fbbf24">Collision</div>
      <p class="game-title">Heist.exe</p>
      <p class="game-desc">Learn AABB collision by playing a heist — every collision is a teaching moment.</p>
      <p class="game-learn"><span>Concepts:</span> AABB collision, hitbox tuning, overlap resolution</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/heist-exe">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="collision" data-game="collisions-mechanic">
    <img class="game-thumb" src="/images/projects/collisions-mechanic/alien_planet.jpg" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#0d2137,#f59e0b)">🪐</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(245,158,11,0.18);color:#fbbf24">Collision</div>
      <p class="game-title">Collision Mechanics</p>
      <p class="game-desc">Dedicated collision lesson — detection zones, response vectors, and edge cases.</p>
      <p class="game-learn"><span>Concepts:</span> collision detection, response vectors, edge cases</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/collision-mechanics">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="collision" data-game="castle-game">
    <img class="game-thumb" src="/images/projects/castle-game/FortressLevelEndScreen.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#292524,#78716c)">🏰</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(245,158,11,0.18);color:#fbbf24">Collision</div>
      <p class="game-title">Castle Game</p>
      <p class="game-desc">Multi-room exploration built on collision-gated doors and zone triggers.</p>
      <p class="game-learn"><span>Concepts:</span> zone triggers, room transitions, event-based gates</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/castle-game">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="collision" data-game="escape-the-tower">
    <img class="game-thumb" src="/images/projects/escape-the-tower/bluedoor.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#1e1b4b,#6366f1)">🗼</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(245,158,11,0.18);color:#fbbf24">Collision</div>
      <p class="game-title">Escape the Tower</p>
      <p class="game-desc">A game-within-a-game — learn how to nest scenes using the engine's scene stack.</p>
      <p class="game-learn"><span>Concepts:</span> scene stacking, nested game loops, state isolation</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/escape-the-tower">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="collision" data-game="gategame">
    <div class="game-thumb-placeholder" style="background:linear-gradient(135deg,#14532d,#16a34a)">🚪</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(245,158,11,0.18);color:#fbbf24">Collision</div>
      <p class="game-title">Gate Game</p>
      <p class="game-desc">Don't let Slime Boy melt — AoE zone collision design made playable.</p>
      <p class="game-learn"><span>Concepts:</span> AoE zones, collectibles, danger detection</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/gategame">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="ai" data-game="voidstriker">
    <img class="game-thumb" src="/images/projects/voidstriker/Alex.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#020617,#7c3aed)">🚀</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(239,68,68,0.18);color:#f87171">AI &amp; Enemies</div>
      <p class="game-title">Void Striker</p>
      <p class="game-desc">Shoot to unlock — destroy enemies to reveal embedded CS lessons.</p>
      <p class="game-learn"><span>Concepts:</span> enemy state machines, projectile logic, progressive unlocks</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/voidstriker">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="ai" data-game="kirby-minigames">
    <img class="game-thumb" src="/images/projects/kirby-minigames/Aquatic.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#4c0d7f,#ec4899)">🎮</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(239,68,68,0.18);color:#f87171">AI &amp; Enemies</div>
      <p class="game-title">Kirby Minigames</p>
      <p class="game-desc">Sprite sheets, chase logic, and NPC interaction — a characters lesson as a minigame collection.</p>
      <p class="game-learn"><span>Concepts:</span> sprite animation, NPC chase AI, character state</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/characters-lesson/">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="ai" data-game="ocean-adventure">
    <div class="game-thumb-placeholder" style="background:linear-gradient(135deg,#0c2340,#0ea5e9)">🌊</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(239,68,68,0.18);color:#f87171">AI &amp; Enemies</div>
      <p class="game-title">Ocean Adventure</p>
      <p class="game-desc">Learn to add enemies that follow the player — enemy AI from scratch.</p>
      <p class="game-learn"><span>Concepts:</span> chase AI, pathfinding basics, proximity detection</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/ocean-adventure">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="multiplayer" data-game="tag-game-multiplayer">
    <img class="game-thumb" src="/images/projects/tag-game-multiplayer/Arena.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#2e1065,#7c3aed)">🏷️</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(139,92,246,0.2);color:#c4b5fd">Multiplayer</div>
      <p class="game-title">Tag Game — Multiplayer</p>
      <p class="game-desc">Real-time multiplayer tag using WebSockets. See networked state sync in action.</p>
      <p class="game-learn"><span>Concepts:</span> WebSocket, real-time sync, client-server state</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/tag-game-multiplayer">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="webapi" data-game="peppa-pig">
    <img class="game-thumb" src="/images/projects/peppa-pig/daddy-pig.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#831843,#f472b6)">🐷</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(16,185,129,0.18);color:#6ee7b7">Web APIs</div>
      <p class="game-title">Peppa Pig Boss Battle</p>
      <p class="game-desc">3-level boss battle with a power-up menu built on the Web Fetch API.</p>
      <p class="game-learn"><span>Concepts:</span> fetch API, async/await, runtime data in game logic</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/peppa-pig/">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="webapi" data-game="local-storage">
    <img class="game-thumb" src="/images/projects/local-storage/forest.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#14532d,#22c55e)">💾</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(16,185,129,0.18);color:#6ee7b7">Web APIs</div>
      <p class="game-title">Local Storage</p>
      <p class="game-desc">Lesson on persisting player data in the browser — game state that survives page reloads.</p>
      <p class="game-learn"><span>Concepts:</span> localStorage API, serialization, session vs. persistent state</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/local-storage">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="webapi" data-game="nod-game">
    <div class="game-thumb-placeholder" style="background:linear-gradient(135deg,#0f2027,#2c5364)">🤖</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(16,185,129,0.18);color:#6ee7b7">Web APIs</div>
      <p class="game-title">Nod Game</p>
      <p class="game-desc">Control the character by moving your head — head tracking via the camera API.</p>
      <p class="game-learn"><span>Concepts:</span> MediaDevices API, computer vision input, accessibility design</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/nod-game">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="logic" data-game="cs-pathway">
    <div class="game-thumb-placeholder" style="background:linear-gradient(135deg,#0f172a,#0284c7)">🗺️</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(6,182,212,0.18);color:#67e8f9">Logic &amp; CS</div>
      <p class="game-title">CS Pathway</p>
      <p class="game-desc">An interactive experience that maps the entire CS course — play through the curriculum.</p>
      <p class="game-learn"><span>Concepts:</span> course structure, decision trees, persistent profiles</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/cs-pathway">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="logic" data-game="robot-logic-game">
    <div class="game-thumb-placeholder" style="background:linear-gradient(135deg,#0f2027,#00b4d8)">🤖</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(6,182,212,0.18);color:#67e8f9">Logic &amp; CS</div>
      <p class="game-title">Robot Logic Game</p>
      <p class="game-desc">Six levels — sequence, iteration, and selection solved with block pseudocode.</p>
      <p class="game-learn"><span>Concepts:</span> sequencing, loops, conditionals, block programming</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/robot-logic-game">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="logic" data-game="game-lessons">
    <div class="game-thumb-placeholder" style="background:linear-gradient(135deg,#1c1917,#44403c)">📚</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(6,182,212,0.18);color:#67e8f9">Logic &amp; CS</div>
      <p class="game-title">Game Lessons Portal</p>
      <p class="game-desc">Tic-Tac-Toe, Tower Defense, and other mini-lessons — multiple CS concepts, one launchpad.</p>
      <p class="game-learn"><span>Concepts:</span> minimax, grid logic, tower defense algorithms</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/game-lessons">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="adventure" data-game="pirate-hunt">
    <img class="game-thumb" src="/images/projects/pirate-hunt/MarketPlaceRPG.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#1c2b0e,#4d7c0f)">🏴‍☠️</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(251,191,36,0.18);color:#fde68a">Adventure</div>
      <p class="game-title">Pirate Mega Game</p>
      <p class="game-desc">The flagship OCS adventure — a full multi-scene pirate RPG built on the game engine.</p>
      <p class="game-learn"><span>Concepts:</span> multi-scene architecture, RPG systems, full game loop</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/pirate-hunt">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

  <div class="game-card" data-category="adventure" data-game="mansionGame">
    <img class="game-thumb" src="/images/projects/mansionGame/CemeteryMainBackground.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="game-thumb-placeholder" style="display:none;background:linear-gradient(135deg,#0f0f0f,#1f1f3a)">🏚️</div>
    <div class="game-body">
      <div class="game-cat-badge" style="background:rgba(251,191,36,0.18);color:#fde68a">Adventure</div>
      <p class="game-title">Mansion Game</p>
      <p class="game-desc">Explore a spooky mansion — multi-room adventure with NPCs and level design.</p>
      <p class="game-learn"><span>Concepts:</span> level design, multi-room maps, NPC dialogue</p>
      <div class="game-actions">
        <a class="game-play-btn" href="/gamify/mansionGame">Play &rarr;</a>
        <button class="game-dig-btn" onclick="toggleDrawer(this)">Dig Deeper &#9660;</button>
      </div>
    </div>
    <div class="game-drawer"><div class="drawer-inner"></div></div>
  </div>

</div>

<script>
var REPO = 'https://github.com/nikhilsna/pages/blob/main';

var GAME_DATA = {
  'platformer': {
    concept: 'Gravity is a constant downward velocity added to the player each frame. A jump is a one-time negative velocity spike — the arc emerges naturally from gravity pulling it back down. Platforms are detected by checking if the player\'s bottom edge crossed a surface this frame.',
    sourceFile: '_projects/games/platformer/levels/PlatformerPlayer.js',
    sourceLabel: 'PlatformerPlayer.js',
    sourceNote: 'Player velocity, gravity constant, jump logic',
    notebook: '_projects/games/platformer/notebook.src.ipynb',
    prIdea: 'Change the gravity constant (~line 12) and adjust jump velocity to feel like low-gravity or high-gravity. Open a PR with your tuned values and a note on what felt best.'
  },
  'astronaut-platformer-game': {
    concept: 'Moving platforms sync the player\'s position by adding the platform\'s velocity delta to the player each frame while they\'re standing on it. This makes the player "ride" the platform without any special physics code.',
    sourceFile: '_projects/games/astronaut-platformer-game/levels/astromaze.js',
    sourceLabel: 'astromaze.js',
    sourceNote: 'Moving platform objects and player attachment logic',
    notebook: '_projects/games/astronaut-platformer-game/notebook.src.ipynb',
    prIdea: 'Add a new moving platform path — a platform that moves in a circle instead of back-and-forth. Open a PR showing the new movement pattern.'
  },
  'spline-barriers': {
    concept: 'A spline is a smooth curve defined by a few control points. The game samples it at equal intervals (t = 0 to 1) to generate many small line segments. Collision is checked against each segment. The result is a curved wall with only a few data points.',
    sourceFile: '_projects/games/spline-barriers/levels/GameLevelOutside.js',
    sourceLabel: 'GameLevelOutside.js',
    sourceNote: 'Spline definition, sampling, and collision segments',
    notebook: '_projects/games/spline-barriers/notebook.src.ipynb',
    prIdea: 'Add a new spline barrier shape to the level — a loop, a spiral, or a wave. Open a PR with the new control points array.'
  },
  'red-riding': {
    concept: 'Waypoint following: the character computes the vector from its current position to the next waypoint, normalizes it, and multiplies by speed. When close enough to a waypoint it advances to the next one. The path is just an array of (x, y) coordinates.',
    sourceFile: '_projects/games/red-riding/levels/level1.js',
    sourceLabel: 'level1.js',
    sourceNote: 'Waypoint array and path-following update loop',
    notebook: '_projects/games/red-riding/notebook.src.ipynb',
    prIdea: 'Add a branching path — at one waypoint, the character can go left or right depending on a player choice. Open a PR with the new route.'
  },
  'transitions': {
    concept: 'Scene transitions freeze the game update loop and play a CSS animation (opacity, translate, or clip-path). A state flag blocks input during the animation. The new scene starts loading during the fade-out so it\'s ready when the fade-in begins.',
    sourceFile: '_projects/games/transitions/levels/GameLevelTimmyfuncounter.js',
    sourceLabel: 'GameLevelTimmyfuncounter.js',
    sourceNote: 'Transition trigger, animation class toggle, state flag',
    notebook: '_projects/games/transitions/notebook.src.ipynb',
    prIdea: 'Design a new transition effect — a pixel dissolve, a curtain wipe, or a zoom. Open a PR with the new CSS keyframe and the JS trigger.'
  },
  'heist-exe': {
    concept: 'AABB (Axis-Aligned Bounding Box) collision: two rectangles collide when they overlap on both the X axis and the Y axis simultaneously. To resolve the overlap, the engine pushes the player along the axis of smallest penetration depth.',
    sourceFile: '_projects/games/heist-exe/levels/HeistL2.js',
    sourceLabel: 'HeistL2.js',
    sourceNote: 'AABB overlap check and push-out resolution',
    notebook: '_projects/games/heist-exe/notebook.src.ipynb',
    prIdea: 'Add a new obstacle type with a different collision shape — a circle or a rotated rectangle. Open a PR showing how you approximate it with AABB.'
  },
  'collisions-mechanic': {
    concept: 'The response vector points away from the collision surface. Its direction is the normal of the surface hit, and its magnitude is the penetration depth. Adding this vector to the player\'s position resolves the overlap in one frame.',
    sourceFile: '_projects/games/collisions-mechanic/levels/ExampleEnemy.js',
    sourceLabel: 'ExampleEnemy.js',
    sourceNote: 'Collision normal calculation and resolution push',
    notebook: '_projects/games/collisions-mechanic/notebook.src.ipynb',
    prIdea: 'Add a bouncy collision — when the player hits a wall, reflect their velocity across the wall normal instead of stopping. Open a PR with the reflection formula.'
  },
  'castle-game': {
    concept: 'Zone triggers check each frame whether the player\'s bounding box overlaps a defined rectangle. When overlap is detected, an event fires — no physics needed. This is how doors, pickups, and danger zones all work.',
    sourceFile: '_projects/games/castle-game/levels/DeathBarrier.js',
    sourceLabel: 'DeathBarrier.js',
    sourceNote: 'Zone overlap check and event dispatch',
    notebook: '_projects/games/castle-game/notebook.src.ipynb',
    prIdea: 'Add a new zone type — a speed boost zone that sets the player\'s velocity multiplier to 1.5x while inside. Open a PR with the new zone class.'
  },
  'escape-the-tower': {
    concept: 'Scene stacking: when a sub-game starts, the current game state is frozen and pushed onto a stack. The sub-game runs its own independent loop. When it ends, the parent state is popped and restored — time picks up exactly where it left off.',
    sourceFile: '_projects/games/escape-the-tower/levels/GameLevelMazeSub.js',
    sourceLabel: 'GameLevelMazeSub.js',
    sourceNote: 'Sub-game initialization, loop isolation, parent state restore',
    notebook: '_projects/games/escape-the-tower/notebook.src.ipynb',
    prIdea: 'Add a second nested sub-game accessible from inside the maze — a game within a game within a game. Open a PR with the new sub-scene.'
  },
  'gategame': {
    concept: 'Area-of-effect zones broadcast a "damage" or "collect" event to every entity whose center falls within a radius. The check is just distance = sqrt((dx²+dy²)) < radius — simple, cheap, and frame-rate independent.',
    sourceFile: '_projects/games/gategame/levels/GameLevelZonecatch.js',
    sourceLabel: 'GameLevelZonecatch.js',
    sourceNote: 'Radius check and zone event broadcast',
    notebook: '_projects/games/gategame/notebook.src.ipynb',
    prIdea: 'Add a new zone type that heals the player instead of damaging — a safe zone that appears after a certain score. Open a PR with the new zone behavior.'
  },
  'voidstriker': {
    concept: 'Enemy state machines: each enemy has states (idle, patrol, attack, dead). Each frame it evaluates a transition condition — like player distance — and switches state if the condition is met. States control which behavior function runs.',
    sourceFile: '_projects/games/voidstriker/levels/GameLevelVoidStriker.js',
    sourceLabel: 'GameLevelVoidStriker.js',
    sourceNote: 'Enemy state enum, transition conditions, behavior dispatch',
    notebook: '_projects/games/voidstriker/notebook.src.ipynb',
    prIdea: 'Add a new enemy with a third state — "fleeing" — where it moves away from the player when health drops below 50%. Open a PR with the new state and its transition logic.'
  },
  'kirby-minigames': {
    concept: 'Sprite sheets pack all animation frames into one image. The renderer draws only a clipped region (sx, sy, width, height) of that image per frame. The clip coordinates advance based on a frame counter divided by the animation speed.',
    sourceFile: '_projects/games/kirby-minigames/levels/KirbyLevelMusic.js',
    sourceLabel: 'KirbyLevelMusic.js',
    sourceNote: 'Sprite sheet clip coordinates and animation frame counter',
    notebook: '_projects/games/kirby-minigames/notebook.src.ipynb',
    prIdea: 'Add a new animation state for a character — a "hurt" animation that plays for 0.5s when the player takes damage. Open a PR with the new sprite frames and the trigger.'
  },
  'ocean-adventure': {
    concept: 'Chase AI: each frame, compute the vector from the enemy to the player (dx, dy). Normalize it to length 1. Multiply by the enemy\'s speed. Add to the enemy\'s position. The enemy always moves directly toward the player at constant speed.',
    sourceFile: '_projects/games/ocean-adventure/levels/GameLevelOcean.js',
    sourceLabel: 'GameLevelOcean.js',
    sourceNote: 'Enemy chase vector calculation and movement update',
    notebook: '_projects/games/ocean-adventure/notebook.src.ipynb',
    prIdea: 'Make the enemy smarter — add a 0.5s reaction delay before it starts chasing, and a max chase range beyond which it stops. Open a PR with both changes.'
  },
  'tag-game-multiplayer': {
    concept: 'WebSocket sends position deltas (change in x, change in y) not absolute coordinates. The server relays them. The client interpolates between the last received position and the new one — so movement looks smooth even with network lag.',
    sourceFile: '_projects/games/tag-game-multiplayer/levels/GameLevelMultiplayer.js',
    sourceLabel: 'GameLevelMultiplayer.js',
    sourceNote: 'WebSocket send/receive, delta encoding, client interpolation',
    notebook: '_projects/games/tag-game-multiplayer/notebook.src.ipynb',
    prIdea: 'Add a "ghost" — another player position rendered semi-transparent showing where the server thinks you are vs. where the client predicts. Open a PR with the debug overlay.'
  },
  'peppa-pig': {
    concept: 'fetch() is called once when the level loads. It\'s async/await — execution pauses at await until the response arrives, then continues. The response JSON populates the power-up menu before the game starts. No callback hell.',
    sourceFile: '_projects/games/peppa-pig/levels/PeppaWelcomeScreen.js',
    sourceLabel: 'PeppaWelcomeScreen.js',
    sourceNote: 'async loadPowerUps(), fetch call, JSON parse, menu population',
    notebook: '_projects/games/peppa-pig/notebook.src.ipynb',
    prIdea: 'Fetch power-up data from a different endpoint — build a tiny mock API that returns different power-ups based on a query param. Open a PR wiring the new endpoint.'
  },
  'local-storage': {
    concept: 'localStorage.setItem(key, JSON.stringify(state)) serializes the entire game state object to a string. On next load, JSON.parse(localStorage.getItem(key)) deserializes it back. The player\'s position, score, and inventory survive a browser close.',
    sourceFile: '_projects/games/local-storage/levels/localStorageDemo.js',
    sourceLabel: 'localStorageDemo.js',
    sourceNote: 'saveState() and loadState() functions, JSON serialization',
    notebook: '_projects/games/local-storage/notebook.src.ipynb',
    prIdea: 'Add a "clear save" button that deletes the stored state. Then add a confirmation prompt so the player can\'t accidentally wipe their data. Open a PR with both.'
  },
  'nod-game': {
    concept: 'navigator.mediaDevices.getUserMedia() opens the camera stream. A face-detection model runs on each video frame and returns landmark coordinates. The horizontal offset of the nose tip maps to the player\'s left/right velocity.',
    sourceFile: '_projects/games/nod-game/levels/GameLevelNod.js',
    sourceLabel: 'GameLevelNod.js',
    sourceNote: 'getUserMedia setup, landmark extraction, velocity mapping',
    notebook: '_projects/games/nod-game/notebook.src.ipynb',
    prIdea: 'Map a second gesture — eyebrow raise — to a jump action. Open a PR adding the eyebrow landmark check and the jump trigger.'
  },
  'cs-pathway': {
    concept: 'Player progress lives in a persistentProfile object saved to localStorage. Each level gate reads a specific flag before allowing entry. Completing a level sets that flag. The profile is the source of truth for what the player has unlocked.',
    sourceFile: '_projects/games/cs-pathway/model/persistentProfile.js',
    sourceLabel: 'persistentProfile.js',
    sourceNote: 'Profile schema, flag getters/setters, localStorage sync',
    notebook: '_projects/games/cs-pathway/notebook.src.ipynb',
    prIdea: 'Add a new profile field — a "favorite concept" the player selects at the start. Use it to customize a UI label later in the game. Open a PR with the new field and one usage.'
  },
  'robot-logic-game': {
    concept: 'Block pseudocode compiles to a list of instructions. The evaluator iterates the list and dispatches each instruction to a handler function. A LOOP block wraps a sub-list and runs it N times. An IF block evaluates a condition first.',
    sourceFile: '_projects/lessons/robot-logic-game/levels/RobotLogicLevel.js',
    sourceLabel: 'RobotLogicLevel.js',
    sourceNote: 'Instruction list, evaluator loop, LOOP/IF dispatch',
    notebook: '_projects/lessons/robot-logic-game/notebook.src.ipynb',
    prIdea: 'Add a new block type — WHILE — that repeats until a sensor condition is false. Open a PR adding the block to the evaluator and a test level that requires it.'
  },
  'game-lessons': {
    concept: 'Tic-Tac-Toe uses minimax: it scores every possible board state recursively, assigning +1 for AI win, -1 for player win, 0 for draw. The AI always picks the move with the highest score — it\'s mathematically unbeatable.',
    sourceFile: '_projects/lessons/game-lessons/levels/ticTacToe.js',
    sourceLabel: 'ticTacToe.js',
    sourceNote: 'minimax() function, board scoring, move selection',
    notebook: '_projects/lessons/game-lessons/notebook.src.ipynb',
    prIdea: 'Add alpha-beta pruning to the minimax — it skips branches that can\'t affect the outcome. Open a PR showing the pruning logic and a comment explaining the speedup.'
  },
  'pirate-hunt': {
    concept: 'Multi-scene architecture: each scene is an isolated JS module with its own assets and update loop. A scene manager handles loading, unloading, and transitions. Scenes share a global game state object but own their local state.',
    sourceFile: '_projects/games/pirate-hunt/levels/pirate-mega-game2V1.js',
    sourceLabel: 'pirate-mega-game2V1.js',
    sourceNote: 'Scene module structure, scene manager calls, shared state access',
    notebook: '_projects/games/pirate-hunt/notebook.src.ipynb',
    prIdea: 'Add a new scene — a tavern with a single NPC that gives the player a hint. Open a PR with the new scene module and the transition trigger from an existing level.'
  },
  'mansionGame': {
    concept: 'Multi-room maps store each room as a tilemap array and a list of entities. The renderer switches the active tilemap on room transition. NPC dialogue is a state machine — the NPC advances to the next line when the player presses interact.',
    sourceFile: '_projects/games/mansionGame/levels/mansionLevel2.js',
    sourceLabel: 'mansionLevel2.js',
    sourceNote: 'Room tilemap definition, NPC dialogue state, transition trigger',
    notebook: '_projects/games/mansionGame/notebook.src.ipynb',
    prIdea: 'Add a new room — a secret passage that connects two existing rooms. Open a PR with the new room definition, its connections, and a hidden entrance trigger.'
  }
};

function conceptSearch(query) {
  var q = query.trim().toLowerCase();
  var clearBtn = document.getElementById('concept-clear');
  var resultEl = document.getElementById('concept-result-count');
  var countEl  = document.getElementById('game-count');
  var cards = document.querySelectorAll('#games-grid .game-card');

  document.querySelectorAll('.concept-snippet').forEach(function(el) { el.remove(); });
  cards.forEach(function(c) { c.classList.remove('card-matched', 'card-dimmed'); });

  if (!q) {
    clearBtn.classList.remove('visible');
    resultEl.textContent = '';
    resultEl.classList.remove('has-results');
    document.getElementById('concept-share').classList.remove('visible');
    // Restore whatever category filter is currently active
    var activeBtn = document.querySelector('.filter-btn.active');
    var activeCat = activeBtn ? activeBtn.dataset.filter : 'all';
    cards.forEach(function(c) {
      c.style.display = (activeCat === 'all' || c.dataset.category === activeCat) ? 'flex' : 'none';
    });
    updateCount();
    var url = new URL(window.location.href);
    url.searchParams.delete('concept');
    history.replaceState(null, '', url.toString());
    return;
  }

  // Concept search overrides the category filter — reveal every card so matches are visible
  cards.forEach(function(c) { c.style.display = 'flex'; });

  clearBtn.classList.add('visible');
  var matchCount = 0;
  var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');

  cards.forEach(function(card) {
    var key = card.dataset.game;
    var data = GAME_DATA[key];
    var conceptText = data ? data.concept : '';
    var learnText = card.querySelector('.game-learn') ? card.querySelector('.game-learn').textContent : '';
    var searchText = conceptText + ' ' + learnText;

    if (searchText.toLowerCase().includes(q)) {
      card.classList.add('card-matched');
      matchCount++;
      if (data) {
        var sentences = data.concept.replace(/([.!?])\s+/g, '$1|').split('|');
        var best = sentences.find(function(s) { return s.toLowerCase().includes(q); }) || sentences[0];
        var snippet = document.createElement('div');
        snippet.className = 'concept-snippet';
        snippet.innerHTML = best.replace(re, '<mark>$1</mark>');
        card.insertBefore(snippet, card.querySelector('.game-drawer'));
      }
    } else {
      card.classList.add('card-dimmed');
    }
  });

  var shareBtn = document.getElementById('concept-share');
  resultEl.classList.toggle('has-results', matchCount > 0);
  shareBtn.classList.toggle('visible', matchCount > 0);
  shareBtn.classList.remove('copied');
  shareBtn.textContent = '🔗 Copy Link';
  resultEl.textContent = matchCount > 0
    ? matchCount + ' game' + (matchCount !== 1 ? 's' : '') + ' teach this concept'
    : 'No matches — try a broader term';
  countEl.textContent = matchCount > 0
    ? matchCount + ' concept match' + (matchCount !== 1 ? 'es' : '')
    : '';

  var url = new URL(window.location.href);
  if (q) { url.searchParams.set('concept', q); } else { url.searchParams.delete('concept'); }
  history.replaceState(null, '', url.toString());
}

function clearConceptSearch() {
  var input = document.getElementById('concept-search');
  input.value = '';
  conceptSearch('');
  input.focus();
}

function shareConceptLink() {
  var btn = document.getElementById('concept-share');
  var url = window.location.href;
  navigator.clipboard.writeText(url).then(function() {
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.textContent = '🔗 Copy Link';
    }, 2000);
  }).catch(function() {
    window.prompt('Copy this link:', url);
  });
}

function buildDrawer(card) {
  var key = card.dataset.game;
  var d = GAME_DATA[key];
  if (!d) return;
  var inner = card.querySelector('.drawer-inner');
  if (inner.children.length > 0) return; // already built

  var ghSource = REPO + '/' + d.sourceFile;
  var ghNotebook = REPO + '/' + d.notebook;
  var ghBlob = 'https://github.com/nikhilsna/pages';

  inner.innerHTML =
    '<div>' +
      '<div class="drawer-section-label">The concept</div>' +
      '<p class="drawer-concept">' + d.concept + '</p>' +
    '</div>' +
    '<div>' +
      '<div class="drawer-section-label">Go deeper</div>' +
      '<div class="drawer-links">' +
        '<a class="drawer-link" href="' + ghSource + '" target="_blank" rel="noopener">' +
          '<span class="drawer-link-icon">🔗</span>' +
          '<div class="drawer-link-text">' +
            '<span class="drawer-link-title">' + d.sourceLabel + '</span>' +
            '<span class="drawer-link-sub">' + d.sourceNote + '</span>' +
          '</div>' +
        '</a>' +
        '<a class="drawer-link" href="' + ghNotebook + '" target="_blank" rel="noopener">' +
          '<span class="drawer-link-icon">🧪</span>' +
          '<div class="drawer-link-text">' +
            '<span class="drawer-link-title">Open in Jupyter</span>' +
            '<span class="drawer-link-sub">notebook.src.ipynb &mdash; view, fork, run cells</span>' +
          '</div>' +
        '</a>' +
        '<a class="drawer-link" href="' + ghBlob + '/fork" target="_blank" rel="noopener">' +
          '<span class="drawer-link-icon">🔀</span>' +
          '<div class="drawer-link-text">' +
            '<span class="drawer-link-title">Fork &amp; Open a PR</span>' +
            '<span class="drawer-link-sub">' + d.prIdea + '</span>' +
          '</div>' +
        '</a>' +
      '</div>' +
    '</div>';
}

function toggleDrawer(btn) {
  var card = btn.closest('.game-card');
  var drawer = card.querySelector('.game-drawer');
  var isOpen = drawer.classList.contains('open');
  if (!isOpen) buildDrawer(card);
  drawer.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
  btn.innerHTML = isOpen ? 'Dig Deeper &#9660;' : 'Close &#9650;';
}

var categoryColors = {
  physics:    { bg: 'rgba(37,99,235,0.25)',  color: '#93c5fd' },
  collision:  { bg: 'rgba(245,158,11,0.25)', color: '#fcd34d' },
  ai:         { bg: 'rgba(239,68,68,0.25)',  color: '#fca5a5' },
  multiplayer:{ bg: 'rgba(139,92,246,0.25)', color: '#c4b5fd' },
  webapi:     { bg: 'rgba(16,185,129,0.25)', color: '#6ee7b7' },
  logic:      { bg: 'rgba(6,182,212,0.25)',  color: '#67e8f9' },
  adventure:  { bg: 'rgba(251,191,36,0.25)', color: '#fde68a' },
  all:        { bg: '#334155',               color: '#f1f5f9' }
};

function filterGames(cat, btn) {
  document.querySelectorAll('#games-grid .game-card').forEach(function(c) {
    c.style.display = (cat === 'all' || c.dataset.category === cat) ? 'flex' : 'none';
  });
  document.querySelectorAll('.filter-btn').forEach(function(b) {
    b.classList.remove('active');
    b.style.background = '#1e293b';
    b.style.color = '#94a3b8';
  });
  btn.classList.add('active');
  var col = categoryColors[cat] || categoryColors.all;
  btn.style.background = col.bg;
  btn.style.color = col.color;
  updateCount();
}

function updateCount() {
  var visible = document.querySelectorAll('#games-grid .game-card:not([style*="none"])').length;
  document.getElementById('game-count').textContent = 'Showing ' + visible + ' game' + (visible !== 1 ? 's' : '');
}

document.addEventListener('DOMContentLoaded', function() {
  var params = new URLSearchParams(window.location.search);
  var preset = params.get('concept');
  if (preset) {
    var input = document.getElementById('concept-search');
    input.value = preset;
    conceptSearch(preset);
  } else {
    updateCount();
  }
});
</script>
