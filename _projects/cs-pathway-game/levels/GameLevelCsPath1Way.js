// Imports: Level objects and UI helpers.
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

/**
 * GameLevel CS Pathway - Wayfinding World
 */
class GameLevelCsPath1Way extends GameLevelCsPathIdentity {
  static levelId = 'wayfinding-world';
  static displayName = 'Wayfinding World';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath1Way.displayName,
      logPrefix: 'Wayfinding World',
    });

    let { width, height, path } = this.getLevelDimensions();

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/projects/cs-pathway-game/bg1/wayfinding-world-fantasy.png";
    const bg_data = {
        name: GameLevelCsPath1Way.displayName,
        greeting: "Welcome to the CSSE pathway! This quest will establish your bearings in the Wayfinding World, where you'll discover your course, uncover your strengths, and enrich your persona!",
        src: image_src,
    };

    this.restoreIdentitySelections({
      bgData: bg_data,
      themeManifestUrl: `${path}/images/projects/cs-pathway-game/bg1/index.json`,
      themeAssetPrefix: `${path}/images/projects/cs-pathway-game/bg1/`,
    });
    
    // ── Player ───────────────────────────────────────────────────
    const player_src = path + "/images/projects/cs-pathway-game/player/minimalist.png";
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
      id: 'Minimalist_Identity',
      greeting: "Hi I am a new adventurer on the CS pathway!",
      src: player_src,
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / PLAYER_SCALE_FACTOR) },
      pixels: { height: 1024, width: 1024 },
      orientation: { rows: 2, columns: 2 },
      down:      { row: 0, start: 0, columns: 1 },
      downRight: { row: 0, start: 0, columns: 1, rotate:  Math.PI / 16 },
      downLeft:  { row: 0, start: 0, columns: 1, rotate: -Math.PI / 16 },
      left:      { row: 1, start: 0, columns: 1, mirror: true },
      right:     { row: 1, start: 0, columns: 1 },
      up:        { row: 0, start: 1, columns: 1 },
      upLeft:    { row: 1, start: 0, columns: 1, mirror: true, rotate:  Math.PI / 16 },
      upRight:   { row: 1, start: 0, columns: 1, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
    };

    this.primeAssetGate({
      playerSrc: player_data.src,
      backgroundSrc: bg_data.src,
    });

    // ── Gatekeepers ────────────────────────────────────────────
    const codeHubGatekeeperPos = {
      x: width * 0.76,
      y: height * 0.26,
    };

    const personalEnrichmentGatekeeperPos = {
      x: width * 0.23,
      y: height * 0.23,
    };

    const skillPassportGatekeeperPos = {
      x: width * 0.77,
      y: height * 0.49  ,
    };

    const courseEnlistGatekeeperPos = {
      x: width * 0.24,
      y: height * 0.46,
    };

    const createDiscMarkerSrc = (fillColor, borderColor = '#f8fafc') => {
      const frameOpacity = [0.7, 0.78, 0.86, 0.94, 1, 0.94, 0.86, 0.78];
      const discFrames = frameOpacity
        .map((opacity, index) => {
          const cx = 128 + (index * 256);
          const ringAngle = index * 45;
          const angleRad = (ringAngle * Math.PI) / 180;
          const oppositeAngleRad = angleRad + Math.PI;
          const orbitRadius = 112;
          const markerX = cx + (Math.cos(angleRad) * orbitRadius);
          const markerY = 128 + (Math.sin(angleRad) * orbitRadius);
          const marker2X = cx + (Math.cos(oppositeAngleRad) * orbitRadius);
          const marker2Y = 128 + (Math.sin(oppositeAngleRad) * orbitRadius);
          const markerShadowX = cx + (Math.cos(angleRad) * (orbitRadius + 4));
          const markerShadowY = 128 + (Math.sin(angleRad) * (orbitRadius + 4));
          const marker2ShadowX = cx + (Math.cos(oppositeAngleRad) * (orbitRadius + 4));
          const marker2ShadowY = 128 + (Math.sin(oppositeAngleRad) * (orbitRadius + 4));
          return `
        <g opacity='${opacity}'>
          <circle cx='${cx}' cy='128' r='114' fill='none' stroke='rgba(0,0,0,0.5)' stroke-width='20'/>
          <circle cx='${cx}' cy='128' r='106' fill='${fillColor}' stroke='${borderColor}' stroke-width='18'/>
          <circle cx='${cx}' cy='128' r='98' fill='none' stroke='rgba(255,255,255,0.34)' stroke-width='6'/>
          <circle cx='${cx}' cy='128' r='104' fill='url(#shine)' />
          <circle cx='${cx}' cy='128' r='112' fill='none' stroke='rgba(255,255,255,0.92)' stroke-width='11' stroke-linecap='round' stroke-dasharray='190 500' transform='rotate(${ringAngle} ${cx} 128)'/>
          <circle cx='${markerShadowX}' cy='${markerShadowY}' r='12' fill='rgba(0,0,0,0.45)' />
          <circle cx='${markerX}' cy='${markerY}' r='10' fill='#ffffff' />
          <circle cx='${marker2ShadowX}' cy='${marker2ShadowY}' r='10' fill='rgba(0,0,0,0.35)' />
          <circle cx='${marker2X}' cy='${marker2Y}' r='8' fill='#fde047' />
        </g>`;
        })
        .join('');

      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='2048' height='256' viewBox='0 0 2048 256'>
        <defs>
          <radialGradient id='shine' cx='35%' cy='30%' r='70%'>
            <stop offset='0%' stop-color='#ffffff' stop-opacity='0.45' />
            <stop offset='45%' stop-color='#ffffff' stop-opacity='0.14' />
            <stop offset='100%' stop-color='#000000' stop-opacity='0.22' />
          </radialGradient>
        </defs>
        ${discFrames}
      </svg>`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    const gatekeeperBaseData = {
      SCALE_FACTOR: 12,
      ANIMATION_RATE: 6,
      pixels: { width: 2048, height: 256 },
      orientation: { rows: 1, columns: 8 },
      down: { row: 0, start: 0, columns: 8, wiggle: { angle: Math.PI / 60, speed: 0.08 } },
      up: { row: 0, start: 0, columns: 8 },
      left: { row: 0, start: 0, columns: 8 },
      right: { row: 0, start: 0, columns: 8 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
    };

    const createGatekeeperData = ({ id, greeting, position, markerColor, reaction, interact, interactDistance }) => ({
      ...gatekeeperBaseData,
      src: createDiscMarkerSrc(markerColor),
      id,
      greeting,
      INIT_POSITION: { ...position },
      interactDistance: interactDistance || 120,
      ...(reaction ? { reaction } : {}),
      ...(interact ? { interact } : {}),
    });

    const npc_data_codeHubGatekeeper = createGatekeeperData({
      id: 'CodeHubGatekeeper',
      greeting: 'Welcome to the Code Hub! Choose what you want to explore first!',
      position: codeHubGatekeeperPos,
      markerColor: '#22c55e',
    });

    const npc_data_personalEnrichmentGatekeeper = createGatekeeperData({
      id: 'PersonalEnrichmentGatekeeper',
      greeting: 'Welcome to Personal Enrichment! Build habits, curiosity, and real-world growth.',
      position: personalEnrichmentGatekeeperPos,
      markerColor: '#3b82f6',
    });

    const npc_data_skillPassportGatekeeper = createGatekeeperData({
      id: 'SkillPassportGatekeeper',
      greeting: 'Welcome to Skill Passport! Track your progress and collect your coding milestones.',
      position: skillPassportGatekeeperPos,
      markerColor: '#f59e0b',
    });

    const npc_data_courseEnlistGatekeeper = createGatekeeperData({
      id: 'CourseEnlistGatekeeper',
      greeting: 'Welcome to Course Enlist! Choose your next class and map your pathway.',
      position: courseEnlistGatekeeperPos,
      markerColor: '#ef4444',
    });

    // List of objects definitions for this level
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
      { class: Npc, data: npc_data_codeHubGatekeeper },
      { class: Npc, data: npc_data_personalEnrichmentGatekeeper },
      { class: Npc, data: npc_data_skillPassportGatekeeper },
      { class: Npc, data: npc_data_courseEnlistGatekeeper },
    ];
  }

}

export default GameLevelCsPath1Way;