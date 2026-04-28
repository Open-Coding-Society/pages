import GameEnvBackground from './essentials/GameEnvBackground.js';
import Npc from './essentials/Npc.js';
import Player from './essentials/Player.js';
import showDialogBox from './essentials/DialogBox.js';
import NpcProgressSystem from './NpcProgressSystem.js';

class GameLevelFuturesExchange {
  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    const bg = {
      id: 'Futures-Exchange-Background',
      src: `${path}/images/gamify/futures-map.svg`,
      pixels: { height: 1024, width: 1024 }
    };

    const player = {
      id: 'Chill Guy',
      greeting: 'New venue unlocked: Futures Exchange.',
      src: `${path}/images/gamify/chillguy.png`,
      SCALE_FACTOR: 5,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: width * 0.14, y: height * 0.82 },
      pixels: { height: 384, width: 512 },
      orientation: { rows: 3, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: { row: 2, start: 0, columns: 3 },
      right: { row: 1, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    function openReusableModal(modalId, frameId, url) {
      let modal = document.getElementById(modalId);
      if (!modal) {
        modal = document.createElement("div");
        modal.id = modalId;
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100vw";
        modal.style.height = "100vh";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        modal.style.display = "none";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "1000";
        document.body.appendChild(modal);

        const iframeWrapper = document.createElement("div");
        iframeWrapper.style.position = "relative";
        iframeWrapper.style.overflow = "hidden";
        iframeWrapper.style.width = "92%";
        iframeWrapper.style.maxWidth = "1100px";
        iframeWrapper.style.height = "86%";
        iframeWrapper.style.border = "2px solid rgba(57,255,182,0.55)";
        iframeWrapper.style.borderRadius = "12px";
        iframeWrapper.style.boxShadow = "0 0 30px rgba(0,0,0,0.6)";
        modal.appendChild(iframeWrapper);

        const frame = document.createElement("iframe");
        frame.id = frameId;
        frame.style.width = "100%";
        frame.style.height = "100%";
        frame.style.border = "none";
        iframeWrapper.appendChild(frame);

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "✖";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "10px";
        closeBtn.style.right = "10px";
        closeBtn.style.fontSize = "20px";
        closeBtn.style.background = "#39ffb6";
        closeBtn.style.color = "#00110c";
        closeBtn.style.border = "none";
        closeBtn.style.padding = "10px 14px";
        closeBtn.style.borderRadius = "10px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.zIndex = "1100";
        closeBtn.onclick = () => {
          modal.style.display = "none";
          frame.src = "";
        };
        iframeWrapper.appendChild(closeBtn);
      }

      const frame = document.getElementById(frameId);
      frame.src = url;
      modal.style.display = "flex";
    }

    const FUTURES_COMPLETE_EVENT = "ff:futures:complete";
    const completionState = { done: false };

    this._onMessage = (event) => {
      if (!event || !event.data) return;
      if (event.data?.type !== FUTURES_COMPLETE_EVENT) return;
      completionState.done = true;
      try {
        const g = gameEnv.game;
        if (g && g.giveNpcCookie) {
          g.updateNpcProgress(g.id, "Futures-NPC");
          g.giveNpcCookie("Futures-NPC", "completed", "Completed futures mini-game.");
        }
      } catch {}
      showDialogBox("Futures Exchange", "Nice. Futures mini-game completed. The next map is unlocked.", [
        { label: "OK", action: () => {}, keepOpen: false }
      ]);
    };
    window.addEventListener("message", this._onMessage);

    const futuresNpc = {
      id: 'Futures-NPC',
      greeting: 'Step into the pit. This is futures trading.',
      src: `${path}/images/gamify/futures-trader.svg`,
      zIndex: 12,
      SCALE_FACTOR: 4.2,
      ANIMATION_RATE: 50,
      pixels: { height: 512, width: 512 },
      INIT_POSITION: { x: width * 0.52, y: height * 0.62 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.10, heightPercentage: 0.18 },
      interact: async () => {
        const npcProgressSystem = new NpcProgressSystem();
        const allowed = await npcProgressSystem.checkNpcProgress(gameEnv.game, futuresNpc.id);
        if (!allowed) return;

        const url = `${path}/gamify/fortuneFinders/futures`;
        const teach = [
          "Futures = a contract to buy/sell a product later at a price agreed today.",
          "LONG means you profit if price goes up. SHORT means you profit if price goes down.",
          "You don’t pay full notional up front — you post MARGIN. Leverage cuts both ways.",
          "In the mini‑game, survive 10 days without your equity going negative (margin call)."
        ].join("\n\n");

        showDialogBox("Futures Trader", teach, [
          {
            label: "Play mini-game",
            action: () => openReusableModal("futuresModal", "futuresFrame", url),
            keepOpen: false
          },
          {
            label: "Learn Coding Behind Futures",
            action: () => openReusableModal("futuresLessonModal", "futuresLessonFrame", `${path}/gamify/fortuneFinders/futures-lesson`),
            keepOpen: false
          },
          {
            label: "Quick tip",
            action: () => showDialogBox(
              "Quick tip",
              "Start with 1 contract and ~12–20% margin. If you’re guessing direction, reduce contracts first — sizing matters more than being right.",
              [{ label: "Got it", action: () => {}, keepOpen: false }]
            ),
            keepOpen: true
          },
          { label: "Not now", action: () => {}, keepOpen: false }
        ]);
      }
    };

    const gateNpc = {
      id: 'Futures-Gate',
      greeting: 'Complete the futures mini-game to unlock the next map.',
      // Use the dedicated gate asset; if it ever fails to load, don't render a huge red fallback.
      src: `${path}/images/gamify/level-gate.svg`,
      zIndex: 11,
      // If the SVG fails to load, Character falls back to a solid square.
      // Make it visible (so progression isn't "invisible") but subtle.
      fillStyle: 'rgba(57,255,182,0.18)',
      SCALE_FACTOR: 9,
      ANIMATION_RATE: 50,
      // Must match the SVG (512x512) or the renderer will crop the image.
      pixels: { height: 512, width: 512 },
      // Keep the gate out of the center so it never blocks the trader NPC on small screens.
      INIT_POSITION: { x: width * 0.88, y: height * 0.16 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.08, heightPercentage: 0.12 },
      interact: () => {
        if (!completionState.done) {
          showDialogBox("Map Locked", "Finish the Futures mini-game first.", [{ label: "OK", action: () => {}, keepOpen: false }]);
          return;
        }
        showDialogBox("Unlocked", "Next map unlocked. Travel now?", [
          { label: "Travel", action: () => gameEnv?.game?.gameControl?.endLevel?.(), keepOpen: false },
          { label: "Later", action: () => {}, keepOpen: false }
        ]);
      }
    };

    this.classes = [
      { class: GameEnvBackground, data: bg },
      { class: Player, data: player },
      { class: Npc, data: futuresNpc },
      { class: Npc, data: gateNpc },
    ];
  }

  destroy() {
    try {
      if (this._onMessage) window.removeEventListener("message", this._onMessage);
    } catch {}
  }
}

export default GameLevelFuturesExchange;

if (typeof window !== 'undefined') {
  window.GameLevelFuturesExchange = GameLevelFuturesExchange;
}

