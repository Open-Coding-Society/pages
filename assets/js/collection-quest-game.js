/**
 * Collection Quest — browser mini-game for the Java Collections lesson.
 * Teaches Queue (FIFO), dynamic list (party), tallies (map), stack (history).
 */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var root = document.getElementById("collection-quest-game-mount");
    if (!root || root.dataset.cqgInit === "1") return;
    root.dataset.cqgInit = "1";

    var WAVES = [
      "Bug Swarm",
      "Null Phantom",
      "Heap Ogre",
      "Race Condition",
      "Leak Serpent",
      "Kernel Dragon",
      "Segfault Revenant",
      "Overflow Hydra",
    ];

    var CHAOS = [
      "Overclock Surge",
      "Memory Leak",
      "Cache Blessing",
      "Null Storm",
      "Concurrency Rift",
    ];

    var state = {
      titanHp: 240,
      phase: 1,
      round: 1,
      score: 0,
      waveQueue: [],
      party: [
        { name: "Queue Knight", role: "tank", hp: 120, power: 22 },
        { name: "Generic Witch", role: "burst", hp: 95, power: 30 },
        { name: "Array Berserker", role: "bruiser", hp: 130, power: 20 },
        { name: "Map Ranger", role: "support", hp: 100, power: 26 },
      ],
      loot: { gold: 0, gems: 0, patches: 0 },
      defeatStack: [],
      log: [],
      rng: seededRandom(1337),
      gameOver: false,
      won: false,
    };

    function seededRandom(seed) {
      return function () {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };
    }

    function el(tag, cls, html) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      return e;
    }

    function pushLog(msg) {
      state.log.unshift(state.round + ": " + msg);
      state.log = state.log.slice(0, 12);
    }

    function fillWaveQueue() {
      while (state.waveQueue.length < 5) {
        var i = Math.floor(state.rng() * WAVES.length);
        state.waveQueue.push(WAVES[i]);
      }
    }

    root.innerHTML = "";
    var wrap = el("div", "cqg-shell");
    wrap.innerHTML =
      '<header class="cqg-head">' +
      '<h3 class="cqg-title">Collection Quest: NullPointer Titan</h3>' +
      '<p class="cqg-sub">Use <strong>FIFO</strong> (queue), watch your <strong>party list</strong>, spend <strong>loot</strong>, and read the <strong>stack</strong> history — same ideas as Java collections, playable here.</p>' +
      "</header>" +
      '<div class="cqg-hud">' +
      '<div class="cqg-stat"><span class="cqg-label">Titan HP</span><div class="cqg-bar"><div id="cqg-titan-bar" class="cqg-bar-inner"></div></div><span id="cqg-titan-txt"></span></div>' +
      '<div class="cqg-stat"><span class="cqg-label">Phase</span><span id="cqg-phase"></span></div>' +
      '<div class="cqg-stat"><span class="cqg-label">Score</span><span id="cqg-score"></span></div>' +
      "</div>" +
      '<div class="cqg-main">' +
      '<div class="cqg-col"><h4>Party (dynamic list)</h4><div id="cqg-party"></div>' +
      '<div class="cqg-loot"><h4>Loot ledger (map)</h4><ul id="cqg-loot"></ul></div></div>' +
      '<div class="cqg-col cqg-center"><h4>Wave queue (FIFO — always take front)</h4><div id="cqg-queue" class="cqg-chips"></div>' +
      '<div class="cqg-actions">' +
      '<button type="button" id="cqg-fifo" class="cqg-btn cqg-primary">Process next wave (dequeue)</button>' +
      '<button type="button" id="cqg-revive" class="cqg-btn">Revive (5 patches)</button>' +
      '<button type="button" id="cqg-reset" class="cqg-btn cqg-muted">Reset run</button>' +
      "</div>" +
      '<p id="cqg-status" class="cqg-status"></p></div>' +
      '<div class="cqg-col"><h4>Defeat stack (LIFO — newest on top)</h4><ol id="cqg-stack" reversed class="cqg-stacklist"></ol>' +
      '<h4>Event log</h4><ul id="cqg-log" class="cqg-loglist"></ul></div>' +
      "</div>";
    root.appendChild(wrap);

    var titanBar = root.querySelector("#cqg-titan-bar");
    var titanTxt = root.querySelector("#cqg-titan-txt");
    var phaseEl = root.querySelector("#cqg-phase");
    var scoreEl = root.querySelector("#cqg-score");
    var partyEl = root.querySelector("#cqg-party");
    var lootEl = root.querySelector("#cqg-loot");
    var queueEl = root.querySelector("#cqg-queue");
    var stackEl = root.querySelector("#cqg-stack");
    var logEl = root.querySelector("#cqg-log");
    var statusEl = root.querySelector("#cqg-status");
    var btnFifo = root.querySelector("#cqg-fifo");
    var btnRevive = root.querySelector("#cqg-revive");
    var btnReset = root.querySelector("#cqg-reset");

    var MAX_TITAN = 240;

    function aliveParty() {
      return state.party.filter(function (p) {
        return p.hp > 0;
      });
    }

    function nextHero() {
      var alive = aliveParty();
      if (!alive.length) return null;
      var idx = (state.round - 1) % alive.length;
      return alive[idx];
    }

    function updatePhase() {
      if (state.titanHp <= 160 && state.phase === 1) {
        state.phase = 2;
        pushLog("Phase II: Corrupt protocol");
      } else if (state.titanHp <= 80 && state.phase === 2) {
        state.phase = 3;
        pushLog("Phase III: Overflow apocalypse");
      }
    }

    function render() {
      var pct = Math.max(0, (state.titanHp / MAX_TITAN) * 100);
      titanBar.style.width = pct + "%";
      titanTxt.textContent = state.titanHp + " / " + MAX_TITAN;
      phaseEl.textContent = String(state.phase);
      scoreEl.textContent = String(state.score);

      partyEl.innerHTML = "";
      state.party.forEach(function (p) {
        var card = el("div", "cqg-card" + (p.hp <= 0 ? " cqg-dead" : ""));
        card.innerHTML =
          '<div class="cqg-card-name">' +
          p.name +
          " <small>(" +
          p.role +
          ")</small></div>" +
          '<div class="cqg-card-meta">PWR ' +
          p.power +
          "</div>" +
          '<div class="cqg-hpbar"><div class="cqg-hpinner" style="width:' +
          Math.max(0, Math.min(100, (p.hp / 150) * 100)) +
          '%"></div></div>' +
          '<div class="cqg-hptxt">' +
          p.hp +
          " HP</div>";
        partyEl.appendChild(card);
      });

      lootEl.innerHTML = "";
      Object.keys(state.loot).forEach(function (k) {
        var li = el("li", "", "<code>" + k + "</code>: " + state.loot[k]);
        lootEl.appendChild(li);
      });

      queueEl.innerHTML = "";
      state.waveQueue.slice(0, 6).forEach(function (w, i) {
        var chip = el("span", "cqg-chip" + (i === 0 ? " cqg-front" : ""), w);
        queueEl.appendChild(chip);
      });

      stackEl.innerHTML = "";
      state.defeatStack
        .slice()
        .reverse()
        .slice(0, 8)
        .forEach(function (name) {
          stackEl.appendChild(el("li", "", name));
        });

      logEl.innerHTML = "";
      state.log.forEach(function (line) {
        logEl.appendChild(el("li", "", line));
      });

      if (state.won) {
        statusEl.textContent = "Victory! Titan defeated. Tie this run to your lesson write-up.";
        btnFifo.disabled = true;
      } else if (state.gameOver) {
        statusEl.textContent = "Party wiped — reset or stack patches to recover next time.";
        btnFifo.disabled = true;
      } else {
        statusEl.textContent =
          "Tip: dequeue = queue.remove() in Java. Your roster mutates like ArrayList; loot tallies behave like HashMap; defeat history is stack push/pop.";
        btnFifo.disabled = false;
      }
      var hasDead = state.party.some(function (p) {
        return p.hp <= 0;
      });
      btnRevive.disabled =
        state.loot.patches < 5 || state.gameOver || state.won || !hasDead;
    }

    function processFifo() {
      if (state.gameOver || state.won) return;
      fillWaveQueue();
      var enemy = state.waveQueue.shift();
      var hero = nextHero();
      if (!hero) {
        state.gameOver = true;
        pushLog("No heroes standing.");
        render();
        return;
      }

      var chaos = CHAOS[Math.floor(state.rng() * CHAOS.length)];
      var base = hero.power + Math.floor(state.rng() * 10);
      var bonus = chaos === "Overclock Surge" ? 12 : chaos === "Null Storm" ? -6 : 0;
      var dealt = Math.max(0, base + bonus);
      var incoming =
        12 +
        Math.floor(state.rng() * 16) +
        (state.phase - 1) * 4 -
        (chaos === "Cache Blessing" ? 8 : 0);
      incoming = Math.max(0, incoming);

      state.titanHp = Math.max(0, state.titanHp - dealt);
      hero.hp = Math.max(0, hero.hp - incoming);

      state.loot.gold += 15 + Math.floor(state.rng() * 20);
      state.loot.gems += state.phase >= 2 ? 2 : 1;
      if (hero.hp > 0) state.loot.patches += 1;

      state.defeatStack.push(enemy + " · " + chaos);
      if (state.defeatStack.length > 20) state.defeatStack.shift();

      state.score += dealt + Math.floor(state.loot.gold / 50);
      pushLog(hero.name + " vs " + enemy + " (" + chaos + ") → " + dealt + " dmg");

      if (state.titanHp <= 0) state.won = true;
      if (!aliveParty().length) state.gameOver = true;

      updatePhase();
      state.round += 1;
      render();
    }

    function tryRevive() {
      if (state.loot.patches < 5 || state.won || state.gameOver) return;
      var dead = state.party.filter(function (p) {
        return p.hp <= 0;
      })[0];
      if (!dead) return;
      state.loot.patches -= 5;
      dead.hp = 40;
      pushLog("Revived " + dead.name + " (stack-like rewind of fate)");
      render();
    }

    function resetRun() {
      state.titanHp = MAX_TITAN;
      state.phase = 1;
      state.round = 1;
      state.score = 0;
      state.waveQueue = [];
      state.defeatStack = [];
      state.log = [];
      state.gameOver = false;
      state.won = false;
      state.loot = { gold: 0, gems: 0, patches: 0 };
      state.party = [
        { name: "Queue Knight", role: "tank", hp: 120, power: 22 },
        { name: "Generic Witch", role: "burst", hp: 95, power: 30 },
        { name: "Array Berserker", role: "bruiser", hp: 130, power: 20 },
        { name: "Map Ranger", role: "support", hp: 100, power: 26 },
      ];
      state.rng = seededRandom(1337 + (Date.now() % 10000));
      fillWaveQueue();
      render();
    }

    btnFifo.addEventListener("click", processFifo);
    btnRevive.addEventListener("click", tryRevive);
    btnReset.addEventListener("click", resetRun);

    fillWaveQueue();
    render();
  });
})();
