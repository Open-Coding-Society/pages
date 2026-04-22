import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

const SKILL_TREE_DATA = {
  branches: {
    setup: { color: '#2ecc71', name: 'SETUP', shadow: 'rgba(46, 204, 113, 0.4)' },
    tools: { color: '#f1c40f', name: 'TOOLS', shadow: 'rgba(241, 196, 15, 0.4)' },
    agile: { color: '#e74c3c', name: 'AGILE', shadow: 'rgba(231, 76, 60, 0.4)' },
  },
  nodes: [
    // SETUP BRANCH (Left side - sprawling)
    { id: 's1', branch: 'setup', x: 40, y: 90, title: 'Identity Forge', current: 5, max: 5, icon: 'fa-user' },
    { id: 's2', branch: 'setup', x: 32, y: 85, title: 'Profile Config', current: 1, max: 5, req: ['s1'], icon: 'fa-id-card' },
    { id: 's3', branch: 'setup', x: 25, y: 75, title: 'Avatar Select', current: 0, max: 5, req: ['s2'], icon: 'fa-user-ninja' },
    { id: 's4', branch: 'setup', x: 38, y: 70, title: 'World Themes', current: 0, max: 5, req: ['s2'], icon: 'fa-globe' },
    { id: 's5', branch: 'setup', x: 18, y: 65, title: 'Discord Auth', current: 0, max: 1, req: ['s3'], icon: 'fa-brands fa-discord' },
    { id: 's6', branch: 'setup', x: 28, y: 60, title: 'Wayfinding', current: 0, max: 5, req: ['s3', 's4'], icon: 'fa-compass' },
    { id: 's7', branch: 'setup', x: 12, y: 55, title: 'GitHub Auth', current: 0, max: 1, req: ['s5'], icon: 'fa-brands fa-github' },
    { id: 's8', branch: 'setup', x: 22, y: 48, title: 'Course Enlist', current: 0, max: 5, req: ['s6'], icon: 'fa-book' },
    { id: 's9', branch: 'setup', x: 32, y: 50, title: 'Code Hub', current: 0, max: 5, req: ['s6'], icon: 'fa-code' },
    { id: 's10', branch: 'setup', x: 15, y: 38, title: 'Skill Passport', current: 0, max: 5, req: ['s8'], icon: 'fa-passport' },
    { id: 's11', branch: 'setup', x: 28, y: 35, title: 'Enrichment', current: 0, max: 5, req: ['s8', 's9'], icon: 'fa-seedling' },
    { id: 's12', branch: 'setup', x: 10, y: 25, title: 'Pathway Mastery', current: 0, max: 1, req: ['s10', 's11'], icon: 'fa-crown' },

    // TOOLS BRANCH (Center - vertical spine)
    { id: 't1', branch: 'tools', x: 50, y: 85, title: 'Terminal Basics', current: 5, max: 5, icon: 'fa-terminal' },
    { id: 't2', branch: 'tools', x: 50, y: 70, title: 'Package Managers', current: 2, max: 5, req: ['t1'], icon: 'fa-box' },
    { id: 't3', branch: 'tools', x: 44, y: 60, title: 'Mac OS Brew', current: 0, max: 5, req: ['t2'], icon: 'fa-brands fa-apple' },
    { id: 't4', branch: 'tools', x: 50, y: 55, title: 'Ubuntu Apt', current: 0, max: 5, req: ['t2'], icon: 'fa-brands fa-ubuntu' },
    { id: 't5', branch: 'tools', x: 56, y: 60, title: 'Windows WSL', current: 0, max: 5, req: ['t2'], icon: 'fa-brands fa-windows' },
    { id: 't6', branch: 'tools', x: 50, y: 42, title: 'VSCode Setup', current: 0, max: 5, req: ['t3', 't4', 't5'], icon: 'fa-file-code' },
    { id: 't7', branch: 'tools', x: 44, y: 32, title: 'Git Operations', current: 0, max: 5, req: ['t6'], icon: 'fa-code-branch' },
    { id: 't8', branch: 'tools', x: 56, y: 32, title: 'Virtual Envs', current: 0, max: 5, req: ['t6'], icon: 'fa-cubes' },
    { id: 't9', branch: 'tools', x: 50, y: 20, title: 'Make / Build', current: 0, max: 5, req: ['t7', 't8'], icon: 'fa-hammer' },
    { id: 't10', branch: 'tools', x: 50, y: 8, title: 'Toolchain Master', current: 0, max: 1, req: ['t9'], icon: 'fa-tools' },

    // AGILE BRANCH (Right side - sprawling)
    { id: 'a1', branch: 'agile', x: 60, y: 90, title: 'Agile Manifesto', current: 5, max: 5, icon: 'fa-bolt' },
    { id: 'a2', branch: 'agile', x: 68, y: 85, title: 'Scrum Setup', current: 3, max: 5, req: ['a1'], icon: 'fa-users' },
    { id: 'a3', branch: 'agile', x: 75, y: 75, title: 'Issue Tracking', current: 0, max: 5, req: ['a2'], icon: 'fa-clipboard-list' },
    { id: 'a4', branch: 'agile', x: 62, y: 70, title: 'Standups', current: 0, max: 5, req: ['a2'], icon: 'fa-comments' },
    { id: 'a5', branch: 'agile', x: 82, y: 65, title: 'Commit Stds', current: 0, max: 5, req: ['a3'], icon: 'fa-code-commit' },
    { id: 'a6', branch: 'agile', x: 72, y: 60, title: 'Sprints', current: 0, max: 5, req: ['a3', 'a4'], icon: 'fa-running' },
    { id: 'a7', branch: 'agile', x: 88, y: 55, title: 'Pull Requests', current: 0, max: 5, req: ['a5'], icon: 'fa-code-pull-request' },
    { id: 'a8', branch: 'agile', x: 78, y: 48, title: 'Code Reviews', current: 0, max: 5, req: ['a6'], icon: 'fa-magnifying-glass' },
    { id: 'a9', branch: 'agile', x: 68, y: 50, title: 'Retrospectives', current: 0, max: 5, req: ['a6'], icon: 'fa-backward-step' },
    { id: 'a10', branch: 'agile', x: 85, y: 38, title: 'CI/CD Basics', current: 0, max: 5, req: ['a7', 'a8'], icon: 'fa-server' },
    { id: 'a11', branch: 'agile', x: 72, y: 35, title: 'Analytics', current: 0, max: 5, req: ['a8', 'a9'], icon: 'fa-chart-line' },
    { id: 'a12', branch: 'agile', x: 90, y: 25, title: 'SDLC Master', current: 0, max: 1, req: ['a10', 'a11'], icon: 'fa-layer-group' },
  ]
};

/**
 * GameLevelCsPath4SkillTree - Visual Skill Tree UI
 *
 * Implements a complex, full-screen DOM overlay over the game engine canvas
 * to display an interactive skill tree tracking pathway progress.
 */
class GameLevelCsPath4SkillTree extends GameLevelCsPathIdentity {
  static levelId = 'skill-tree';
  static displayName = 'Skill Tree & Progression';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath4SkillTree.displayName,
      logPrefix: 'Skill Tree',
    });

    let { width, height, path } = this.getLevelDimensions();

    // ── Background ──────────────────────────────────────────────
    // A dark fallback background behind the DOM overlay
    const image_src = path + "/images/projects/cs-pathway-game/bg3/analytics-observatory-fantasy.png";
    const bg_data = {
      name: GameLevelCsPath4SkillTree.displayName,
      greeting: "Skill Tree initialized.",
      src: image_src,
    };

    // ── Player (Hidden/Locked in place for UI level) ──────
    const player_src = path + "/images/projects/cs-pathway-game/player/minimalist.png";
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
      id: 'Minimalist_Identity',
      greeting: "Viewing Skill Tree.",
      src: player_src,
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: -1000, y: -1000 }, // Offscreen
      pixels: { height: 1024, width: 1024 },
      orientation: { rows: 2, columns: 2 },
      down:      { row: 0, start: 0, columns: 1 },
      left:      { row: 1, start: 0, columns: 1, mirror: true },
      right:     { row: 1, start: 0, columns: 1 },
      up:        { row: 0, start: 1, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
    };

    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
    ];

    this.overlayContainer = null;
  }

  initialize() {
    super.initialize();
    this.createSkillTreeOverlay();
  }

  destroy() {
    this.removeSkillTreeOverlay();
    super.destroy();
  }

  createSkillTreeOverlay() {
    if (this.overlayContainer) return;

    // Create main container
    this.overlayContainer = document.createElement('div');
    this.overlayContainer.id = 'skill-tree-overlay';
    
    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
      #skill-tree-overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a0f 100%);
        z-index: 1000;
        overflow: hidden;
        font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: white;
        user-select: none;
      }
      
      .st-header {
        position: absolute;
        top: 20px; left: 0; width: 100%;
        text-align: center;
        z-index: 1002;
        pointer-events: none;
      }
      .st-header h1 {
        margin: 0; font-size: 2.5rem; letter-spacing: 4px;
        text-transform: uppercase;
        background: linear-gradient(90deg, #fff, #888);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
      }
      .st-header p {
        margin: 5px 0 0 0; color: #aaa; font-size: 1.1rem;
      }

      .st-svg-container {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 1001;
        pointer-events: none;
      }

      .st-node-container {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 1002;
      }

      .st-node {
        position: absolute;
        transform: translate(-50%, -50%);
        display: flex; flex-direction: column; align-items: center;
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .st-node:hover {
        transform: translate(-50%, -50%) scale(1.15);
        z-index: 1003;
      }

      .st-node-circle {
        width: 56px; height: 56px;
        border-radius: 50%;
        background: #111;
        display: flex; justify-content: center; align-items: center;
        position: relative;
        border: 2px solid #333;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
      }
      
      .st-node.unlocked .st-node-circle {
        background: #1a1a1a;
      }

      .st-node-icon {
        font-size: 22px;
        color: #555;
      }
      .st-node.unlocked .st-node-icon {
        color: white;
      }

      .st-node-progress-ring {
        position: absolute;
        top: -4px; left: -4px; right: -4px; bottom: -4px;
        border-radius: 50%;
        border: 4px solid transparent;
      }

      .st-node-label {
        margin-top: 8px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #777;
        text-align: center;
        width: 120px;
        font-weight: 600;
        text-shadow: 0 2px 4px rgba(0,0,0,0.8);
      }
      .st-node.unlocked .st-node-label {
        color: #ddd;
      }

      .st-node-fraction {
        position: absolute;
        bottom: -6px;
        right: -6px;
        background: #000;
        border-radius: 10px;
        padding: 2px 6px;
        font-size: 10px;
        font-weight: bold;
        color: #aaa;
        border: 1px solid #333;
      }
      .st-node.unlocked .st-node-fraction {
        color: white;
      }
      
      .st-node.locked .st-node-icon {
        opacity: 0.2;
      }
      .st-node.locked::after {
        content: '\\f023'; /* FontAwesome lock */
        font-family: 'Font Awesome 6 Free', 'FontAwesome';
        font-weight: 900;
        position: absolute;
        top: 20px;
        color: #666;
        font-size: 16px;
      }

      /* Modal */
      .st-modal-backdrop {
        position: absolute; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,0,0.8);
        z-index: 2000;
        display: none;
        justify-content: center; align-items: center;
        backdrop-filter: blur(4px);
      }
      .st-modal {
        background: #111;
        border: 1px solid #333;
        border-radius: 12px;
        padding: 24px;
        width: 400px;
        max-width: 90%;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        text-align: center;
      }
      .st-modal h2 { margin: 0 0 10px 0; font-size: 24px; }
      .st-modal p { color: #aaa; line-height: 1.5; margin-bottom: 20px; }
      .st-modal-btn {
        background: #333; border: none; color: white;
        padding: 10px 20px; border-radius: 6px;
        cursor: pointer; font-weight: bold; font-size: 14px;
        text-transform: uppercase; letter-spacing: 1px;
        transition: background 0.2s;
      }
      .st-modal-btn:hover { background: #555; }
      .st-modal-close {
        position: absolute; top: 15px; right: 15px;
        background: none; border: none; color: #777;
        font-size: 20px; cursor: pointer;
      }
      .st-modal-close:hover { color: white; }
    `;
    this.overlayContainer.appendChild(style);

    // Header
    const header = document.createElement('div');
    header.className = 'st-header';
    header.innerHTML = `
      <h1>Pathway Matrix</h1>
      <p>Enhance your capabilities and unlock new domains.</p>
    `;
    this.overlayContainer.appendChild(header);

    // SVG Container for paths
    const svgNS = "http://www.w3.org/2000/svg";
    const svgContainer = document.createElementNS(svgNS, 'svg');
    svgContainer.setAttribute('class', 'st-svg-container');
    this.overlayContainer.appendChild(svgContainer);

    // Node Container
    const nodeContainer = document.createElement('div');
    nodeContainer.className = 'st-node-container';
    this.overlayContainer.appendChild(nodeContainer);

    // Render Connections first
    SKILL_TREE_DATA.nodes.forEach(node => {
      if (node.req) {
        node.req.forEach(reqId => {
          const reqNode = SKILL_TREE_DATA.nodes.find(n => n.id === reqId);
          if (reqNode) {
            const isUnlocked = node.current > 0 || (reqNode.current === reqNode.max); // Very basic logic
            const isFullyUnlocked = node.current > 0;
            const branchData = SKILL_TREE_DATA.branches[node.branch];
            
            const path = document.createElementNS(svgNS, 'path');
            
            // Calculate bezier curve
            const startX = reqNode.x;
            const startY = reqNode.y;
            const endX = node.x;
            const endY = node.y;
            
            // Simple curve logic: control points are offset vertically
            const d = \`M \${startX}% \${startY}% C \${startX}% \${startY - 10}%, \${endX}% \${endY + 10}%, \${endX}% \${endY}%\`;
            
            path.setAttribute('d', d);
            path.setAttribute('fill', 'none');
            
            if (isFullyUnlocked) {
              path.setAttribute('stroke', branchData.color);
              path.setAttribute('stroke-width', '4');
              path.style.filter = \`drop-shadow(0 0 6px \${branchData.shadow})\`;
            } else if (isUnlocked) {
              path.setAttribute('stroke', '#555');
              path.setAttribute('stroke-width', '3');
            } else {
              path.setAttribute('stroke', '#222');
              path.setAttribute('stroke-width', '2');
            }
            
            svgContainer.appendChild(path);
          }
        });
      }
    });

    // Determine state function
    const isNodeUnlocked = (node) => {
      if (!node.req || node.req.length === 0) return true;
      return node.req.some(reqId => {
        const reqNode = SKILL_TREE_DATA.nodes.find(n => n.id === reqId);
        return reqNode && reqNode.current === reqNode.max;
      });
    };

    // Render Nodes
    SKILL_TREE_DATA.nodes.forEach(node => {
      const branchData = SKILL_TREE_DATA.branches[node.branch];
      const unlocked = isNodeUnlocked(node);
      const inProgress = node.current > 0 && node.current < node.max;
      const completed = node.current === node.max;
      
      const el = document.createElement('div');
      el.className = \`st-node \${unlocked ? 'unlocked' : 'locked'}\`;
      el.style.left = \`\${node.x}%\`;
      el.style.top = \`\${node.y}%\`;
      
      // Determine border styling
      let ringStyle = '';
      if (completed) {
        ringStyle = \`border-color: \${branchData.color}; box-shadow: 0 0 15px \${branchData.shadow}; background-color: \${branchData.color}22;\`;
      } else if (inProgress) {
        ringStyle = \`border-color: \${branchData.color}; border-style: dashed; border-width: 3px;\`;
      } else if (unlocked) {
        ringStyle = \`border-color: #555;\`;
      }

      el.innerHTML = \`
        <div class="st-node-circle" style="\${completed ? 'border-color: ' + branchData.color : ''}">
          <div class="st-node-progress-ring" style="\${ringStyle}"></div>
          <i class="fa-solid \${node.icon || 'fa-star'} st-node-icon"></i>
          \${unlocked ? \`<div class="st-node-fraction" style="\${completed ? 'border-color: ' + branchData.color : ''}">\${node.current}/\${node.max}</div>\` : ''}
        </div>
        <div class="st-node-label">\${node.title}</div>
      \`;

      el.addEventListener('click', () => {
        this.openModal(node, branchData, unlocked);
      });

      nodeContainer.appendChild(el);
    });

    // Add FontAwesome if not present
    if (!document.getElementById('fa-stylesheet')) {
      const link = document.createElement('link');
      link.id = 'fa-stylesheet';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }

    // Modal structure
    this.modalBackdrop = document.createElement('div');
    this.modalBackdrop.className = 'st-modal-backdrop';
    this.modalBackdrop.innerHTML = \`
      <div class="st-modal" style="position:relative;">
        <button class="st-modal-close"><i class="fa-solid fa-xmark"></i></button>
        <div id="st-modal-icon" style="font-size: 40px; margin-bottom: 15px;"></div>
        <h2 id="st-modal-title"></h2>
        <p id="st-modal-desc"></p>
        <div style="margin-bottom: 20px; font-weight: bold; font-size: 18px; color: #fff;" id="st-modal-progress"></div>
        <button class="st-modal-btn" id="st-modal-action">Start Training</button>
      </div>
    \`;
    this.overlayContainer.appendChild(this.modalBackdrop);

    this.modalBackdrop.querySelector('.st-modal-close').addEventListener('click', () => {
      this.modalBackdrop.style.display = 'none';
    });

    // Close on click outside
    this.modalBackdrop.addEventListener('click', (e) => {
      if (e.target === this.modalBackdrop) {
        this.modalBackdrop.style.display = 'none';
      }
    });

    // Append to game container or body
    const gameWrapper = document.getElementById('game-container') || document.body;
    gameWrapper.appendChild(this.overlayContainer);
  }

  openModal(node, branchData, unlocked) {
    if (!unlocked) return; // Maybe show a "Locked: Requires X" instead, but doing nothing is fine for now

    const titleEl = this.modalBackdrop.querySelector('#st-modal-title');
    const descEl = this.modalBackdrop.querySelector('#st-modal-desc');
    const iconEl = this.modalBackdrop.querySelector('#st-modal-icon');
    const progEl = this.modalBackdrop.querySelector('#st-modal-progress');
    const btnEl = this.modalBackdrop.querySelector('#st-modal-action');

    titleEl.textContent = node.title;
    titleEl.style.color = branchData.color;
    
    iconEl.innerHTML = \`<i class="fa-solid \${node.icon}" style="color: \${branchData.color}"></i>\`;
    iconEl.style.textShadow = \`0 0 20px \${branchData.shadow}\`;

    descEl.textContent = \`Master the concepts of \${node.title} within the \${branchData.name} pathway. Complete associated tasks to gain proficiency.\`;
    
    progEl.textContent = \`Proficiency: \${node.current} / \${node.max}\`;

    if (node.current === node.max) {
      btnEl.textContent = "Review";
      btnEl.style.background = "#333";
      btnEl.style.color = "#fff";
    } else {
      btnEl.textContent = "Train Skill";
      btnEl.style.background = branchData.color;
      btnEl.style.color = "#000";
    }

    btnEl.onclick = () => {
      // Logic to start training, maybe route to the actual level or mock progress
      if (node.current < node.max) {
        node.current++;
        this.removeSkillTreeOverlay();
        this.createSkillTreeOverlay(); // Re-render to show update
      }
      this.modalBackdrop.style.display = 'none';
    };

    this.modalBackdrop.style.display = 'flex';
  }

  removeSkillTreeOverlay() {
    if (this.overlayContainer && this.overlayContainer.parentNode) {
      this.overlayContainer.parentNode.removeChild(this.overlayContainer);
    }
    this.overlayContainer = null;
  }
}

export default GameLevelCsPath4SkillTree;
