// Forest Win Sublevel
// Save as: assets/js/GameEnginev1.1/GameLevelForestWin.js
import Coin from './Coin.js';

import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import DialogueSystem from './essentials/DialogueSystem.js';

// ── AI Chat System ─────────────────────────────────────────────────────────────
class NpcAiChat {
  constructor(npcName, systemPrompt, avatarSrc) {
    this.npcName = npcName;
    this.systemPrompt = systemPrompt;
    this.avatarSrc = avatarSrc;
    this.history = [];
    this.container = null;
  }

  isOpen() {
    return !!this.container && document.body.contains(this.container);
  }

  close() {
    if (!this.isOpen()) return;
    const panel = this.container.querySelector('.npc-chat-panel');
    const overlay = this.container.querySelector('.npc-chat-overlay');
    if (panel)   { panel.style.opacity = '0'; panel.style.transform = 'translateX(-50%) translateY(16px)'; }
    if (overlay) { overlay.style.opacity = '0'; }
    setTimeout(() => {
      if (this.container && document.body.contains(this.container))
        document.body.removeChild(this.container);
      this.container = null;
    }, 220);
  }

  open() {
    if (this.isOpen()) { this.close(); return; }
    this._injectStyles();

    const wrapper = document.createElement('div');

    const overlay = document.createElement('div');
    overlay.className = 'npc-chat-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0',
      background: 'rgba(0,0,0,0.5)',
      zIndex: '10000', opacity: '0',
      transition: 'opacity 0.22s',
    });
    overlay.addEventListener('click', () => this.close());

    const panel = document.createElement('div');
    panel.className = 'npc-chat-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '28px', left: '50%',
      transform: 'translateX(-50%) translateY(16px)',
      width: 'min(520px, 93vw)',
      maxHeight: '68vh',
      background: 'linear-gradient(160deg,#0c180c 55%,#142010)',
      border: '1px solid #3a5825',
      borderRadius: '10px',
      boxShadow: '0 10px 48px rgba(0,0,0,0.75), inset 0 1px 0 rgba(144,192,96,0.07)',
      zIndex: '10001',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      opacity: '0',
      transition: 'opacity 0.22s, transform 0.22s',
      fontFamily: 'Georgia, serif',
    });
    panel.addEventListener('click', e => e.stopPropagation());

    const header = document.createElement('div');
    Object.assign(header.style, {
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '11px 14px',
      background: 'rgba(30,48,18,0.85)',
      borderBottom: '1px solid #2a4018',
      flexShrink: '0',
    });
    const avatar = document.createElement('img');
    avatar.src = this.avatarSrc;
    Object.assign(avatar.style, {
      width: '34px', height: '34px', objectFit: 'cover',
      borderRadius: '50%', border: '1px solid #4a6028',
      background: '#141e0e', flexShrink: '0',
    });
    const nameEl = document.createElement('span');
    nameEl.textContent = this.npcName;
    Object.assign(nameEl.style, {
      color: '#90c060', fontSize: '12px',
      letterSpacing: '2.5px', textTransform: 'uppercase',
      fontWeight: 'bold', flex: '1',
    });
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    Object.assign(closeBtn.style, {
      background: 'none', border: 'none', color: '#4a6028',
      fontSize: '13px', cursor: 'pointer', padding: '2px 6px',
      lineHeight: '1', borderRadius: '3px',
      transition: 'color 0.15s',
    });
    closeBtn.onmouseenter = () => closeBtn.style.color = '#90c060';
    closeBtn.onmouseleave = () => closeBtn.style.color = '#4a6028';
    closeBtn.onclick = () => this.close();
    header.append(avatar, nameEl, closeBtn);

    const msgList = document.createElement('div');
    Object.assign(msgList.style, {
      flex: '1', overflowY: 'auto',
      padding: '13px 14px',
      display: 'flex', flexDirection: 'column', gap: '9px',
      scrollbarWidth: 'thin', scrollbarColor: '#2a4018 transparent',
    });

    const greeting = this._greeting();
    msgList.appendChild(this._bubble(greeting, 'npc'));
    this.history.push({ role: 'assistant', content: greeting });

    const inputRow = document.createElement('div');
    Object.assign(inputRow.style, {
      display: 'flex', gap: '7px',
      padding: '9px 12px',
      background: 'rgba(8,14,8,0.75)',
      borderTop: '1px solid #243818',
      flexShrink: '0',
    });
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Say something...';
    Object.assign(input.style, {
      flex: '1', background: 'rgba(255,255,255,0.04)',
      border: '1px solid #344820', borderRadius: '5px',
      color: '#c4cc98', fontSize: '13px',
      padding: '7px 11px', outline: 'none',
      fontFamily: 'Georgia, serif',
      transition: 'border-color 0.18s',
    });
    input.onfocus = () => input.style.borderColor = '#557030';
    input.onblur  = () => input.style.borderColor = '#344820';

    const sendBtn = document.createElement('button');
    sendBtn.textContent = '↵';
    Object.assign(sendBtn.style, {
      background: '#223018', color: '#90c060',
      border: '1px solid #3a5020', borderRadius: '5px',
      cursor: 'pointer', fontSize: '15px',
      padding: '5px 13px', fontFamily: 'Georgia, serif',
      transition: 'background 0.15s',
    });
    sendBtn.onmouseenter = () => sendBtn.style.background = '#324028';
    sendBtn.onmouseleave = () => sendBtn.style.background = '#223018';

    const send = async () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      input.disabled = sendBtn.disabled = true;

      msgList.appendChild(this._bubble(text, 'user'));
      const typing = this._typingBubble();
      msgList.appendChild(typing);
      msgList.scrollTop = msgList.scrollHeight;

      this.history.push({ role: 'user', content: text });

      try {
        const reply = await this._ask();
        this.history.push({ role: 'assistant', content: reply });
        typing.remove();
        msgList.appendChild(this._bubble(reply, 'npc'));
      } catch (e) {
        typing.remove();
        msgList.appendChild(this._bubble('...I seem to have lost my words.', 'npc'));
        console.error('NPC AI error:', e);
      }

      msgList.scrollTop = msgList.scrollHeight;
      input.disabled = sendBtn.disabled = false;
      input.focus();
    };

    sendBtn.onclick = send;
    input.onkeydown = e => { if (e.key === 'Enter') send(); };
    inputRow.append(input, sendBtn);

    panel.append(header, msgList, inputRow);
    wrapper.append(overlay, panel);
    document.body.appendChild(wrapper);
    this.container = wrapper;

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      panel.style.opacity = '1';
      panel.style.transform = 'translateX(-50%) translateY(0)';
      input.focus();
    });
  }

  _greeting() {
    return {
      'R2D2':          'Bweeeep! You made it! Ask me anything!',
      'Village Elder': "We don't get many travellers here. What would you like to know?",
      'Villager':      "Oh! A new face! It's been so long — what can I tell you?",
    }[this.npcName] || 'Hello, traveller.';
  }

  _bubble(text, who) {
    const row = document.createElement('div');
    row.style.cssText = `display:flex;justify-content:${who === 'user' ? 'flex-end' : 'flex-start'}`;
    const b = document.createElement('div');
    b.textContent = text;
    Object.assign(b.style, {
      maxWidth: '80%', padding: '8px 11px',
      borderRadius: who === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
      background: who === 'user' ? 'rgba(50,78,24,0.75)' : 'rgba(22,38,14,0.85)',
      color: who === 'user' ? '#ccd8a4' : '#b4c490',
      fontSize: '13px', lineHeight: '1.55',
      border: who === 'user' ? '1px solid #486028' : '1px solid #2a4018',
      wordBreak: 'break-word',
    });
    row.appendChild(b);
    return row;
  }

  _typingBubble() {
    const row = document.createElement('div');
    row.style.display = 'flex';
    const b = document.createElement('div');
    Object.assign(b.style, {
      padding: '9px 13px', borderRadius: '10px 10px 10px 2px',
      background: 'rgba(22,38,14,0.85)', border: '1px solid #2a4018',
      display: 'flex', gap: '5px', alignItems: 'center',
    });
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('span');
      Object.assign(d.style, {
        width: '6px', height: '6px', borderRadius: '50%',
        background: '#4a6828', display: 'inline-block',
        animation: `npcDot 1s ease-in-out ${i * 0.18}s infinite`,
      });
      b.appendChild(d);
    }
    row.appendChild(b);
    return row;
  }

  _injectStyles() {
    if (document.getElementById('npc-ai-chat-style')) return;
    const s = document.createElement('style');
    s.id = 'npc-ai-chat-style';
    s.textContent = `@keyframes npcDot{0%,80%,100%{transform:translateY(0);opacity:.35}40%{transform:translateY(-5px);opacity:1}}`;
    document.head.appendChild(s);
  }

  async _ask() {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: this.systemPrompt,
        messages: this.history,
      }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.content.find(b => b.type === 'text')?.text ?? '...';
  }
}

// ── Personalities ──────────────────────────────────────────────────────────────
const PERSONA_R2D2 = `You are R2D2, a cheerful astromech droid in a fantasy/sci-fi game world called Ashenholm.
You are enthusiastic and supportive, speak in short upbeat sentences, and occasionally say "Bweep!" or "Boop!".
The player (an octopus) just arrived safely in Ashenholm by choosing the right forest path.
You are very proud of them. Keep answers 1-3 sentences. Be warm and a little funny.`;

const PERSONA_ELDER = `You are the Village Elder of Ashenholm — wise, weathered, calm.
You speak slowly and thoughtfully, and know the forest's history and the fork in the road (most go left, to their peril).
The player (an octopus traveller) has just arrived safely. Be quietly proud of them.
Respond in character: measured, a little cryptic. 1-3 sentences per reply.`;

const PERSONA_VILLAGER = `You are a friendly, excitable villager of Ashenholm.
You haven't seen an outsider in a very long time and are thrilled.
You know village gossip, local life, and a little about the dangerous forest.
Be warm, chatty, and slightly flustered. 1-3 sentences per reply.`;

// ─────────────────────────────────────────────────────────────────────────────

class GameLevelForestWin {
  constructor(gameEnv) {
    console.log("Initializing GameLevelForestWin...");

    this.gameEnv = gameEnv;

    let height = gameEnv.innerHeight;
    let path   = gameEnv.path;

    // ── Background ────────────────────────────────────────────────────────────
    const image_data_bg = {
      name: 'village',
      greeting: "Warm light. The smell of bread. You made it.",
      src: path + "/images/gamify/village.jpg",
      pixels: { height: 580, width: 1038 }
    };

    // ── Player (Octopus) ──────────────────────────────────────────────────────
    const OCTOPUS_SCALE_FACTOR = 5;
    const sprite_data_player = {
      id: 'Octopus',
      greeting: "I can't believe I made it...",
      src: path + "/images/gamify/octopus.png",
      SCALE_FACTOR: OCTOPUS_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      GRAVITY: false,
      INIT_POSITION: { x: 0.1, y: 0.75 },
      pixels: { height: 250, width: 167 },
      orientation: { rows: 3, columns: 2 },
      down:      { row: 0, start: 0, columns: 2 },
      downLeft:  { row: 0, start: 0, columns: 2, mirror: true, rotate:  Math.PI / 16 },
      downRight: { row: 0, start: 0, columns: 2,               rotate: -Math.PI / 16 },
      left:      { row: 1, start: 0, columns: 2, mirror: true },
      right:     { row: 1, start: 0, columns: 2 },
      up:        { row: 0, start: 0, columns: 2 },
      upLeft:    { row: 1, start: 0, columns: 2, mirror: true, rotate: -Math.PI / 16 },
      upRight:   { row: 1, start: 0, columns: 2,               rotate:  Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    // ── NPC: R2D2 ─────────────────────────────────────────────────────────────
    const r2d2Chat = new NpcAiChat('R2D2', PERSONA_R2D2, path + "/images/gamify/r2_idle.png");

    const sprite_greet_r2d2 = "Bweeeep! You made it! I knew you would!";
    const sprite_data_r2d2 = {
      id: 'R2D2',
      greeting: sprite_greet_r2d2,
      src: path + "/images/gamify/r2_idle.png",
      SCALE_FACTOR: 7,
      ANIMATION_RATE: 80,
      pixels: { height: 223, width: 505 },
      INIT_POSITION: { x: 0.5, y: 0.45 },
      orientation: { rows: 1, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "Bweeeep! I knew you would choose correctly. I believed in you the whole time.",
        "The desert is behind you now. Ashenholm is here. You earned this.",
        "I have to say — a lot of people go left. You did not. That matters.",
        "Boop bweep! Translation: well done. Sincerely."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_r2d2);
      },
      interact: function() {
        if (r2d2Chat.isOpen()) { r2d2Chat.close(); return; }
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen())
          this.dialogueSystem.closeDialogue();
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();

        this._praiseIndex = (this._praiseIndex || 0);
        const praises = [
          "Bweep boop! You chose right. Literally and figuratively.",
          "I have to say — most people don't make it here. You should be proud.",
          "The village is yours to explore. You've earned the peace.",
          "If you ever doubted yourself back at that fork... don't. You had it.",
          "Bweeeeeep! That's just me being happy. Ignore me."
        ];
        const msg = praises[this._praiseIndex % praises.length];
        this._praiseIndex++;

        this.dialogueSystem.showDialogue(msg, "R2D2", this.spriteData.src);
        this.dialogueSystem.addButtons([
          {
            text: "💬 Chat with me",
            primary: true,
            action: () => {
              this.dialogueSystem.closeDialogue();
              r2d2Chat.open();
            }
          },
          {
            text: "🏆 See the credits",
            action: () => {
              this.dialogueSystem.closeDialogue();
              _showWinScreen();
            }
          },
          { text: "Stay a little longer", action: () => this.dialogueSystem.closeDialogue() }
        ]);
      }
    };

    // ── NPC: Village Elder ────────────────────────────────────────────────────
    const elderChat = new NpcAiChat('Village Elder', PERSONA_ELDER, path + "/images/gamify/tux.png");

    const sprite_greet_elder = "We don't get many travellers who make it here. Welcome.";
    const sprite_data_elder = {
      id: 'Village Elder',
      greeting: sprite_greet_elder,
      src: path + "/images/gamify/tux.png",
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 50,
      pixels: { height: 256, width: 352 },
      INIT_POSITION: { x: 0.78, y: 0.55 },
      orientation: { rows: 8, columns: 11 },
      down: { row: 5, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "We don't get many travellers who make it here. Welcome.",
        "The fork has been there longer than the village. Most go left.",
        "You can rest here. You've earned it.",
        "The forest sent you to us. That means something.",
        "Stay as long as you need. Ashenholm does not rush its guests."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_elder);
      },
      interact: function() {
        if (elderChat.isOpen()) { elderChat.close(); return; }
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen())
          this.dialogueSystem.closeDialogue();
        elderChat.open();
      }
    };

    // ── NPC: Villager ─────────────────────────────────────────────────────────
    const villagerChat = new NpcAiChat('Villager', PERSONA_VILLAGER, path + "/images/gamify/octocat.png");

    const sprite_greet_villager = "Oh! A new face! It's been so long!";
    const sprite_data_villager = {
      id: 'Villager',
      greeting: sprite_greet_villager,
      src: path + "/images/gamify/octocat.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 301, width: 801 },
      INIT_POSITION: { x: 0.3, y: 0.6 },
      orientation: { rows: 1, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
      dialogues: [
        "Oh! A new face! It's been so long since anyone came through the right path!",
        "You must be exhausted. The forest is no joke.",
        "We saw your light from the watchtower. We hoped you'd make it.",
        "Welcome to Ashenholm. You're safe now."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_villager);
      },
      interact: function() {
        if (villagerChat.isOpen()) { villagerChat.close(); return; }
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen())
          this.dialogueSystem.closeDialogue();
        villagerChat.open();
      }
    };

    // ── Coin ──────────────────────────────────────────────────────────────────
    const sprite_data_coin = {
      id: 'coin',
      greeting: false,
      INIT_POSITION: { x: 0.5, y: 0.8 },
      color: '#FFD700',
      zIndex: 12,
      value: 1
    };

    // ── Win screen + credits ──────────────────────────────────────────────────
    function _showWinScreen() {
      const screen = document.createElement('div');
      Object.assign(screen.style, {
        position: 'fixed', top: '0', left: '0',
        width: '100%', height: '100%',
        background: 'rgba(5,12,3,0.97)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        zIndex: '10003', color: '#c8d0a0',
        fontFamily: 'Georgia, serif',
        overflowY: 'auto', padding: '40px 0'
      });

      screen.innerHTML = `
        <h1 style="color:#90c060;font-size:28px;letter-spacing:4px;margin-bottom:8px;text-align:center">
          ✦ YOU MADE IT OUT ALIVE ✦
        </h1>
        <p style="font-style:italic;color:#8a9870;margin-bottom:40px;font-size:14px;text-align:center">
          Ashenholm. Warm light. The journey is complete.
        </p>
        <div style="width:1px;height:40px;background:rgba(144,192,96,0.3);margin-bottom:40px"></div>
        <h2 style="color:#506030;font-size:13px;letter-spacing:6px;margin-bottom:32px;text-align:center">CREDITS</h2>
        <div style="display:flex;flex-direction:column;gap:20px;text-align:center;max-width:480px;width:100%">
          <div>
            <div style="color:#506030;font-size:10px;letter-spacing:3px;margin-bottom:4px">GAME DESIGN</div>
            <div style="color:#c0b898;font-size:14px">Aarav- Dev. of Maze, Fin- Dev. of Doors, Ahmad- Dev. of Forest, All coders made the credits</div>
          </div>
          <div>
            <div style="color:#506030;font-size:10px;letter-spacing:3px;margin-bottom:4px">BUILT WITH</div>
            <div style="color:#c0b898;font-size:14px">GameEnginev1.1 · Night Hacks GameBuilder</div>
          </div>
          <div>
            <div style="color:#506030;font-size:10px;letter-spacing:3px;margin-bottom:4px">LEVELS</div>
            <div style="color:#c0b898;font-size:14px;line-height:1.8">
              GameLevelMaze · GameLevelDoors<br>
              GameLevelForest · GameLevelForestSub<br>
              GameLevelForestDeath · GameLevelForestWin
            </div>
          </div>
          <div>
            <div style="color:#506030;font-size:10px;letter-spacing:3px;margin-bottom:4px">CHARACTERS</div>
            <div style="color:#c0b898;font-size:14px;line-height:1.8">
              Octopus · Tux · Octocat · R2D2<br>
              Chicken Jockey · The Strange Beckoner<br>
              The Warden · The Wraith · Village Elder · Villager
            </div>
          </div>
          <div>
            <div style="color:#506030;font-size:10px;letter-spacing:3px;margin-bottom:4px">SPECIAL THANKS</div>
            <div style="color:#c0b898;font-size:14px">Everyone who went right.</div>
          </div>
        </div>
        <div style="width:1px;height:40px;background:rgba(144,192,96,0.3);margin:40px 0"></div>
      `;

      const btn = document.createElement('button');
      btn.textContent = 'The End';
      Object.assign(btn.style, {
        padding: '10px 32px', background: '#283820', color: '#c0b898',
        border: '1px solid #506030', borderRadius: '4px', cursor: 'pointer',
        fontFamily: 'Georgia, serif', fontSize: '15px',
        letterSpacing: '2px', marginBottom: '40px'
      });
      btn.onclick = () => document.body.removeChild(screen);
      screen.appendChild(btn);
      document.body.appendChild(screen);
    }

    // ── Level class list ──────────────────────────────────────────────────────
    this.classes = [
      { class: GameEnvBackground, data: image_data_bg       },
      { class: Player,            data: sprite_data_player   },
      { class: Npc,               data: sprite_data_r2d2     },
      { class: Npc,               data: sprite_data_elder    },
      { class: Npc,               data: sprite_data_villager },
      { class: Coin,              data: sprite_data_coin     },
    ];
  }
}

export default GameLevelForestWin;