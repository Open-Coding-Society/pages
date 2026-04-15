/**
 * Real Estate Tycoon — three-level adventure for OCS GameEngine v1.1.
 * Uses: GameEnvBackground, Player, Npc (+ DialogueSystem), Clicker, Coin,
 * multi-level GameControl transitions.
 */
import GamEnvBackground from "../GameEnginev1.1/essentials/GameEnvBackground.js";
import Player from "../GameEnginev1.1/essentials/Player.js";
import Npc from "../GameEnginev1.1/essentials/Npc.js";
import Clicker from "../GameEnginev1.1/essentials/Clicker.js";
import Coin from "../GameEnginev1.1/Coin.js";

function goToNextLevel(gameEnv) {
  const gc = gameEnv.gameControl;
  if (!gc) return;
  if (gc.currentLevelIndex < gc.levelClasses.length - 1) {
    gc.currentLevelIndex += 1;
    gc.transitionToLevel();
  }
}

function playerAgent(gameEnv) {
  const path = gameEnv.path;
  const height = gameEnv.innerHeight;
  const CHILLGUY_SCALE_FACTOR = 5;
  return {
    id: "Agent You",
    greeting: "New agent on the floor — time to close some deals!",
    src: path + "/images/gamify/chillguy.png",
    SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
    STEP_FACTOR: 1000,
    ANIMATION_RATE: 50,
    INIT_POSITION: { x: 0.08, y: 0.82 },
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
    hitbox: { widthPercentage: 0.45, heightPercentage: 0.35 },
    keypress: { up: 87, left: 65, down: 83, right: 68 },
  };
}

export class GameLevelRealEstateOffice {
  constructor(gameEnv) {
    const path = gameEnv.path;

    const bg = {
      name: "skyline_office",
      greeting: "OCS Realty — downtown flagship office.",
      src: path + "/images/gamebuilder/bg/clouds.jpg",
      pixels: { height: 720, width: 1280 },
    };

    const mentor = {
      id: "Broker Morgan",
      greeting: "Walk the floor, collect earnest-money tokens, then ride to the open house.",
      src: path + "/images/gamify/stockguy.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 441, width: 339 },
      INIT_POSITION: { x: 0.72, y: 0.55 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1, wiggle: { angle: 0.05, speed: 0.03 } },
      hitbox: { widthPercentage: 0.12, heightPercentage: 0.22 },
      dialogues: [
        "Listings move fast — know your comps.",
        "Disclose everything. Trust is your brand.",
        "Every showing is a pitch — smile, then listen.",
        "Your pipeline is a queue: first lead in, first follow-up out.",
      ],
      interact: function () {
        if (this.dialogueSystem) this.showRandomDialogue();
      },
    };

    const banker = {
      id: "Loan Officer Dana",
      greeting: "Rates are fictional today — this is practice debt!",
      src: path + "/images/gamify/janetYellen.png",
      SCALE_FACTOR: 5.5,
      ANIMATION_RATE: 50,
      pixels: { height: 282, width: 268 },
      INIT_POSITION: { x: 0.22, y: 0.62 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.12, heightPercentage: 0.2 },
      dialogues: [
        "Pre-approval letters win bids.",
        "Debt-to-income matters more than curb appeal.",
        "We stack contingencies like a nested stack — pop them in order at closing.",
      ],
      interact: function () {
        if (this.dialogueSystem) this.showRandomDialogue();
      },
    };

    const townCar = {
      id: "Town Car",
      greeting: "Ready for the open house on Maple Drive?",
      src: path + "/images/gamify/octocat.png",
      SCALE_FACTOR: 9,
      ANIMATION_RATE: 50,
      pixels: { height: 301, width: 801 },
      // Place mid-screen so collision is easy to trigger
      INIT_POSITION: { x: 0.52, y: 0.32 },
      orientation: { rows: 1, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      // Larger hitbox to make interaction reliable
      hitbox: { widthPercentage: 0.35, heightPercentage: 0.25 },
      dialogues: [
        "GPS says traffic is light — perfect for a showing.",
        "I only do FIFO pickups: you’re next in queue.",
      ],
      reaction: function () {
        if (this.dialogueSystem) this.showReactionDialogue();
      },
      interact: function () {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
        }
        this.dialogueSystem.showDialogue(
          "Buyers are lined up at the open house. Drive over now?",
          "Town Car",
          this.spriteData.src
        );
        this.dialogueSystem.addButtons([
          {
            text: "Drive to open house",
            primary: true,
            action: () => {
              this.dialogueSystem.closeDialogue();
              goToNextLevel(gameEnv);
            },
          },
          {
            text: "Finish calls first",
            action: () => this.dialogueSystem.closeDialogue(),
          },
        ]);
      },
    };

    const leadGen = {
      id: "Lead Gen Kiosk",
      greeting: "Tap for digital leads!",
      src: path + "/images/gamify/box-button.png",
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 50,
      pixels: { height: 128, width: 128 },
      INIT_POSITION: { x: 0.88, y: 0.72 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1, wiggle: 0.08 },
      hitbox: { widthPercentage: 0.15, heightPercentage: 0.15 },
      interact: function () {
        console.log("Lead gen ping — stack another open-house RSVP.");
      },
    };

    const coinA = {
      id: "earnest-a",
      INIT_POSITION: { x: 0.35, y: 0.78 },
      value: 1,
      color: "#FFD700",
      zIndex: 12,
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
    };
    const coinB = {
      id: "earnest-b",
      INIT_POSITION: { x: 0.58, y: 0.42 },
      value: 1,
      color: "#F4D03F",
      zIndex: 12,
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
    };

    this.classes = [
      { class: GamEnvBackground, data: bg },
      { class: Player, data: playerAgent(gameEnv) },
      { class: Npc, data: mentor },
      { class: Npc, data: banker },
      { class: Npc, data: townCar },
      { class: Clicker, data: leadGen },
      { class: Coin, data: coinA },
      { class: Coin, data: coinB },
    ];
  }
}

export class GameLevelRealEstateOpenHouse {
  constructor(gameEnv) {
    const path = gameEnv.path;

    const bg = {
      name: "listing_mansion",
      greeting: "Staged, spotless, slightly haunted (disclose in addendum).",
      src: path + "/images/gamify/MansionLevel2MainBackground.jpeg",
      pixels: { height: 720, width: 1280 },
    };

    const seller = {
      id: "Seller Pat",
      greeting: "Offers due by sundown!",
      src: path + "/images/gamify/frankSinatra.png",
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { height: 400, width: 300 },
      INIT_POSITION: { x: 0.7, y: 0.5 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.12, heightPercentage: 0.22 },
      dialogues: [
        "I already packed the kitchen — please don’t open that closet.",
        "Appraisal came in high. Don’t jinx it.",
        "If they ask about the foundation, talk about the garden.",
      ],
      interact: function () {
        if (this.dialogueSystem) this.showRandomDialogue();
      },
    };

    const inspector = {
      id: "Inspector Bot",
      greeting: "Thermal scan complete. Mostly.",
      src: path + "/images/gamify/robot.png",
      SCALE_FACTOR: 9,
      ANIMATION_RATE: 80,
      pixels: { height: 316, width: 627 },
      INIT_POSITION: { x: 0.18, y: 0.35 },
      orientation: { rows: 3, columns: 6 },
      down: { row: 1, start: 0, columns: 6 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "Roof age: unknown. Attitude: optimistic.",
        "I found seventeen smart bulbs and zero grounding jokes.",
        "This HVAC hums in B-flat. Not a defect, just jazz.",
      ],
      interact: function () {
        if (this.dialogueSystem) this.showRandomDialogue();
      },
    };

    const refreshments = {
      id: "Refreshment Table",
      greeting: "Cookie compliance: eat one, log one.",
      src: path + "/images/gamify/box-button.png",
      SCALE_FACTOR: 7,
      ANIMATION_RATE: 50,
      pixels: { height: 128, width: 128 },
      INIT_POSITION: { x: 0.5, y: 0.72 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1, wiggle: 0.06 },
      hitbox: { widthPercentage: 0.14, heightPercentage: 0.14 },
    };

    const soldSign = {
      id: "Escrow Limo",
      greeting: "Sign here, then we fund.",
      src: path + "/images/gamify/exitportalfull.png",
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 100,
      pixels: { width: 2029, height: 2025 },
      INIT_POSITION: { x: 0.42, y: 0.08 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.15 },
      dialogues: ["Closing desk is prepped. Keys are in the lockbox."],
      reaction: function () {},
      interact: function () {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
        }
        this.dialogueSystem.showDialogue(
          "Offer accepted — head to the title office for closing?",
          "Escrow",
          this.spriteData.src
        );
        this.dialogueSystem.addButtons([
          {
            text: "Close the deal",
            primary: true,
            action: () => {
              this.dialogueSystem.closeDialogue();
              goToNextLevel(gameEnv);
            },
          },
          {
            text: "Renegotiate",
            action: () => this.dialogueSystem.closeDialogue(),
          },
        ]);
      },
    };

    const coinC = {
      id: "earnest-c",
      INIT_POSITION: { x: 0.28, y: 0.68 },
      value: 2,
      color: "#E8DAEF",
      zIndex: 12,
    };

    this.classes = [
      { class: GamEnvBackground, data: bg },
      { class: Player, data: playerAgent(gameEnv) },
      { class: Npc, data: seller },
      { class: Npc, data: inspector },
      { class: Clicker, data: refreshments },
      { class: Coin, data: coinC },
      { class: Npc, data: soldSign },
    ];
  }
}

export class GameLevelRealEstateClosing {
  constructor(gameEnv) {
    const path = gameEnv.path;

    const bg = {
      name: "title_clouds",
      greeting: "Title & escrow — where signatures become keys.",
      src: path + "/images/gamebuilder/bg/clouds.jpg",
      pixels: { height: 720, width: 1280 },
    };

    const closer = {
      id: "Closer Quinn",
      greeting: "Funds wired. You did it, agent.",
      src: path + "/images/gamify/historyProf.png",
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { height: 400, width: 320 },
      INIT_POSITION: { x: 0.55, y: 0.48 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.12, heightPercentage: 0.22 },
      dialogues: [
        "Recording number prints in 24 hours.",
        "Welcome to the homeowner club — dues are called property tax.",
        "Replay any level from the dropdown to practice your pitch.",
      ],
      interact: function () {
        if (this.dialogueSystem) this.showRandomDialogue();
      },
    };

    const bonus = {
      id: "commission-bonus",
      INIT_POSITION: { x: 0.3, y: 0.55 },
      value: 3,
      color: "#58D68D",
      zIndex: 12,
    };

    this.classes = [
      { class: GamEnvBackground, data: bg },
      { class: Player, data: playerAgent(gameEnv) },
      { class: Npc, data: closer },
      { class: Coin, data: bonus },
    ];
  }
}

export const gameLevelClasses = [
  GameLevelRealEstateOffice,
  GameLevelRealEstateOpenHouse,
  GameLevelRealEstateClosing,
];
