import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Npc from './GameEngine/Npc.js';
import Player from './GameEngine/Player.js';
import showDialogBox, { showYellenModal, getFrankAdviceList, getMorganFacts, getSatoshiQuestions } from './DialogBox.js';
import WaypointArrow from './WaypointArrow.js';
import NpcProgressSystem from './NpcProgressSystem.js';

let socketURI
let javaURI
let pagesURI;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    javaURI = "http://localhost:8585";
    socketURI = "ws://localhost:8585/websocket";
    pagesURI = "http://127.0.0.1:4500";
} else {
    javaURI = "https://spring.opencodingsociety.com";
    socketURI = "wss://spring.opencodingsociety.com/websocket";
    pagesURI = "https://open-coding-society.github.io/pages";
}
class GameLevelAirport {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;
    window.gamePath = path;

    const image_src_desert = path + "/images/gamify/map.png"; 
    const image_data_desert = {
      id: 'Airport-Background',
      src: image_src_desert,
      pixels: { height: 580, width: 386 }
    };

    const sprite_src_chillguy = path + "/images/gamify/chillguy.png";
    const CHILLGUY_SCALE_FACTOR = 5;
    const sprite_data_chillguy = {
      id: 'Chill Guy',
      greeting: "Hi I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
      src: sprite_src_chillguy,
      SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: width * 0.41, y: height * 0.31 },
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

    const sprite_src_casino = path + "/images/gamify/frankSinatra.png";
    const sprite_data_casino = {
      id: 'Casino-NPC',
      greeting: "Hey, kid. I'm Frank Sinatra — welcome to the bright lights and wild nights of Las Vegas.",
      src: sprite_src_casino,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 50,
      pixels: { height: 281, width: 280 },
      INIT_POSITION: { x: width * 0.15, y: height * 0.25 },
      orientation: { rows: 1, columns: 1 }, 
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.05, heightPercentage: 0.1 },
      reaction: function () {
        function openInModal(url) {
          openReusableModal('casinoModal', 'casinoFrame', url);
        }

        const dialogFunctions = {
          intro: function() {
          showDialogBox(
            "Frank Sinatra",
            "Hey, kid. I'm Frank Sinatra — welcome to the bright lights and wild nights of Las Vegas.\nHere, you can test your luck on Blackjack, Poker, or the Minefield Challenge.\nBut remember: in gambling, the swing of fortune can be swift and brutal.\nWant a tip before you step in?",
            [
              { label: "Yes, give me advice", action: () => dialogFunctions.giveAdvice(), keepOpen: true },
              { label: "Take me to the Casino", action: () => {
                // Give NPC cookie for visiting the casino
                if (gameEnv.game && gameEnv.game.giveNpcCookie) {
                  gameEnv.game.updateNpcProgress(gameEnv.game.id, sprite_data_casino.id);
                  gameEnv.game.giveNpcCookie(sprite_data_casino.id, "casino_visited", "Try your luck at the casino games! Play responsibly and remember - the house always has an edge.");
                }
                openInModal(`${pagesURI}/gamify/casinohomepage`);
              }},
              { label: "No thanks", action: () => {} }
            ]
          );
          },
          giveAdvice: function() {
          const adviceList = getFrankAdviceList();
          const advice = adviceList[Math.floor(Math.random() * adviceList.length)];
          showDialogBox(
            "Frank's Advice",
            advice + "\nWant to answer a question before you go in?",
            [
              { label: "Sure, ask me!", action: () => dialogFunctions.askQuestion(), keepOpen: true },
              { label: "Take me to the Casino", action: () => {
                // Give NPC cookie for visiting the casino
                if (gameEnv.game && gameEnv.game.giveNpcCookie) {
                  gameEnv.game.updateNpcProgress(gameEnv.game.id, sprite_data_casino.id);
                  gameEnv.game.giveNpcCookie(sprite_data_casino.id, "casino_visited", "Try your luck at the casino games! Play responsibly and remember - the house always has an edge.");
                }

                openInModal(`${pagesURI}/gamify/casinohomepage`);
              }},
              { label: "Another tip", action: () => dialogFunctions.giveAdvice(), keepOpen: true },
              { label: "Maybe later", action: () => {} }
            ]
          );
          },
          askQuestion: function() {
          showDialogBox(
            "Frank's Question",
            "If you won a big jackpot tonight, what would you do with the money?",
            [
                { label: "Save it", action: () => dialogFunctions.frankResponse("Smart move, kid. Saving is always classy.") },
                { label: "Spend it all!", action: () => dialogFunctions.frankResponse("Ha! Just don't spend it all in one place, capisce?") },
                { label: "Invest it", action: () => dialogFunctions.frankResponse("Now that's the spirit of a true high roller!") },
                { label: "Back", action: () => dialogFunctions.giveAdvice(), keepOpen: true }
            ]
          );
          },
          frankResponse: function(response) {
          showDialogBox(
            "Frank Sinatra",
            response + "\nReady to try your luck?",
            [
              { label: "Take me to the Casino", action: () => {
                // Give NPC cookie for visiting the casino
                if (gameEnv.game && gameEnv.game.giveNpcCookie) {
                  gameEnv.game.updateNpcProgress(gameEnv.game.id, sprite_data_casino.id);
                  gameEnv.game.giveNpcCookie(sprite_data_casino.id, "casino_visited", "Try your luck at the casino games! Play responsibly and remember - the house always has an edge.");
                }
                openInModal(`${pagesURI}/gamify/casinohomepage`);
              }},
              { label: "Back to advice", action: () => dialogFunctions.giveAdvice(), keepOpen: true },
              { label: "Thanks, Frank!", action: () => {
                // Give NPC cookie for completing the dialogue
                if (gameEnv.game && gameEnv.game.giveNpcCookie) {
                  gameEnv.game.updateNpcProgress(gameEnv.game.id, sprite_data_casino.id);
                  gameEnv.game.giveNpcCookie(sprite_data_casino.id, "dialogue_completed", "Feel free to come back and visit the casino anytime you want to test your luck!");
                }
              } }
            ]
          );
        }
        };

        // Return the dialog functions so they can be accessed from interact
        return dialogFunctions;
      },
      interact: async function () {
        const game = gameEnv.game;
        const npcProgressSystem = new NpcProgressSystem();
        const allowed = await npcProgressSystem.checkNpcProgress(game, sprite_data_casino.id);
        if (allowed) {
          const dialogFunctions = sprite_data_casino.reaction();
          dialogFunctions.intro();
        }
      }
    };

    const sprite_src_stocks = path + "/images/gamify/stockguy.png";
    const sprite_data_stocks = {
      id: 'Stock-NPC',
      greeting: "Good day, I am J.P. Morgan, financier of industry and architect of American banking.",
      src: sprite_src_stocks,
      SCALE_FACTOR: 7,
      ANIMATION_RATE: 50,
      pixels: { height: 441, width: 339 },
      INIT_POSITION: { x: width * 0.17, y: height * 0.8 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.03, heightPercentage: 0.06 },
      reaction: function () {
        function openInModal(url) {
          openReusableModal('stocksModal', 'stocksFrame', url);
        }

        const dialogFunctions = {
          intro: function() {
          showDialogBox(
            "J.P. Morgan",
            "Good day, I am J.P. Morgan, financier of industry and architect of American banking.\nAre you ready to test your skills in the stock market?",
            [
                { label: "Yes", action: () => dialogFunctions.explainStocks(), keepOpen: true },
              { label: "Thank you for the introduction", action: () => {
                // Give NPC cookie for completing the dialogue
                if (gameEnv.game && gameEnv.game.giveNpcCookie) {
                  gameEnv.game.updateNpcProgress(gameEnv.game.id, sprite_data_stocks.id);
                  gameEnv.game.giveNpcCookie(sprite_data_stocks.id, "dialogue_completed");
                }
              } }
            ]
          );
          },
          explainStocks: function() {
          showDialogBox(
            "J.P. Morgan",
            "The stock market is a place of opportunity and risk. You can buy shares in companies and watch your investments grow—or shrink.\nWould you like to proceed to the Stock Exchange and begin your investment journey?",
            [
              { label: "Take me to the Stock Exchange", action: () => openInModal(`${pagesURI}/stocks/viewer`) },
              { label: "Remind me what stocks are", action: () => dialogFunctions.whatAreStocks(), keepOpen: true },
              { label: "Back", action: () => dialogFunctions.intro(), keepOpen: true }
            ]
          );
          },
          whatAreStocks: function() {
          const facts = getMorganFacts();
          const fact = facts[Math.floor(Math.random() * facts.length)];
          showDialogBox(
            "J.P. Morgan",
            fact + "\nWould you like to try investing now?",
            [
              { label: "Yes, let's invest", action: () => openInModal(`${pagesURI}/stocks/viewer`) },
              { label: "Back", action: () => dialogFunctions.explainStocks(), keepOpen: true }
            ]
          );
        }
        };

        // Return the dialog functions so they can be accessed from interact
        return dialogFunctions;
      },
      interact: async function () {
        const game = gameEnv.game;
        const npcProgressSystem = new NpcProgressSystem();
        const allowed = await npcProgressSystem.checkNpcProgress(game, sprite_data_stocks.id);
        if (allowed) {
          // Get player position from the game environment
          const player = gameEnv.player;
          if (!player) {
            // If we can't get player position, just show the dialog
            const dialogFunctions = sprite_data_stocks.reaction();
            dialogFunctions.intro();
            return;
          }
        }
      }
    };

    const sprite_src_crypto = path + "/images/gamify/satoshiNakamoto.png";
    const sprite_data_crypto = {
      id: 'Crypto-NPC',
      greeting: "Greetings, seeker. I am Satoshi Nakamoto, architect of decentralized currency.",
      src: sprite_src_crypto,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { height: 282, width: 282 },
      INIT_POSITION: { x: width * 0.73, y: height * 0.25 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.05, heightPercentage: 0.1 },
      reaction: function () {
        function openInModal(url) {
          openReusableModal('cryptoModal', 'cryptoFrame', url);
        }

        const dialogFunctions = {
          intro: function() {
          showDialogBox(
            "Satoshi Nakamoto",
            "Greetings, seeker. I am Satoshi Nakamoto, architect of decentralized currency.\nAre you curious about Bitcoin or ready to explore the Crypto Hub?",
            [
                { label: "Tell me about Bitcoin", action: () => dialogFunctions.aboutBitcoin(), keepOpen: true },
              { label: "Go to Crypto Hub", action: () => openInModal(`${pagesURI}/crypto/portfolio`) },
              { label: "Thank you, Satoshi", action: () => {
                // Give NPC cookie for completing the dialogue
                if (gameEnv.game && gameEnv.game.giveNpcCookie) {
                  gameEnv.game.updateNpcProgress(gameEnv.game.id, sprite_data_crypto.id);
                  gameEnv.game.giveNpcCookie(sprite_data_crypto.id, "dialogue_completed");
                }
              } }
            ]
          );
          },
          aboutBitcoin: function() {
          showDialogBox(
            "Satoshi Nakamoto",
            "Bitcoin is a decentralized digital currency, born from a desire for freedom and transparency. It operates without banks or governments.\nWould you like to know how to buy or mine Bitcoin?",
            [
                { label: "How do I buy Bitcoin?", action: () => dialogFunctions.howToBuy(), keepOpen: true },
                { label: "Back", action: () => dialogFunctions.intro(), keepOpen: true }
            ]
          );
          },
          howToBuy: function() {
          showDialogBox(
            "Satoshi Nakamoto",
            "To buy Bitcoin, you need a digital wallet and access to a crypto exchange. You can purchase fractions of a Bitcoin.\nWould you like to visit the Crypto Hub to start your journey?",
            [
              { label: "Yes, take me there", action: () => openInModal(`${pagesURI}/crypto/portfolio`) },
              { label: "Back", action: () => dialogFunctions.aboutBitcoin(), keepOpen: true }
            ]
          );
          },

        };

        return dialogFunctions;
      },
      interact: async function () {
        const game = gameEnv.game;
        const npcProgressSystem = new NpcProgressSystem();
        const allowed = await npcProgressSystem.checkNpcProgress(game, sprite_data_crypto.id);
        if (allowed) {
          const dialogFunctions = sprite_data_crypto.reaction();
          dialogFunctions.intro();
        }
      }
    };

    const sprite_src_mining = path + "/images/gamify/miningRigMan.png";
    const sprite_data_mining = {
      id: 'Mining-NPC',
      greeting: "Hey there! I'm Max, your friendly neighborhood crypto miner. Let's talk about mining!",
      src: sprite_src_mining,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { height: 500, width: 500 },
      INIT_POSITION: { x: width * 0.62, y: height * 0.27 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.05, heightPercentage: 0.1 },
      reaction: function () {
        function openInModal(url) {
          openReusableModal('miningModal', 'miningFrame', url);
        }

        const dialogFunctions = {
          intro: function() {
            showDialogBox(
              "Max the Miner",
              "Hey there! I'm Max, your friendly neighborhood crypto miner. I've been mining Bitcoin since the early days!\nWant to learn about mining or try your hand at it?",
              [
                { label: "Tell me about mining", action: () => dialogFunctions.explainMining(), keepOpen: true },
                { label: "Try Mining", action: () => openInModal(`${pagesURI}/crypto/mining`) },
                { label: "What's your setup?", action: () => dialogFunctions.mySetup(), keepOpen: true },
                { label: "Thank you, Max", action: () => {
                  // Give NPC cookie for completing the dialogue
                  if (gameEnv.game && gameEnv.game.giveNpcCookie) {
                    gameEnv.game.updateNpcProgress(gameEnv.game.id, sprite_data_mining.id);
                    gameEnv.game.giveNpcCookie(sprite_data_mining.id, "dialogue_completed");
                  }
                } }
              ]
            );
          },
          explainMining: function() {
            showDialogBox(
              "Max the Miner",
              "Mining is like solving complex puzzles to verify transactions on the blockchain. Miners use powerful computers to compete for rewards in cryptocurrency.\nThe more computing power you have, the better your chances of winning!\nWould you like to know more about the technical side?",
              [
                { label: "Technical Details", action: () => dialogFunctions.technicalDetails(), keepOpen: true },
                { label: "Try Mining", action: () => openInModal(`${pagesURI}/crypto/mining`) },
                { label: "Back", action: () => dialogFunctions.intro(), keepOpen: true }
              ]
            );
          },
          technicalDetails: function() {
            showDialogBox(
              "Max the Miner",
              "Here's the cool stuff:\n• Mining uses SHA-256 hashing algorithm\n• Difficulty adjusts automatically\n• You need specialized hardware (ASICs) for Bitcoin\n• Electricity costs are crucial\n• Mining pools help small miners compete\n\nReady to try mining yourself?",
              [
                { label: "Start Mining", action: () => openInModal(`${pagesURI}/crypto/mining`) },
                { label: "Back", action: () => dialogFunctions.explainMining(), keepOpen: true }
              ]
            );
          },
          mySetup: function() {
            showDialogBox(
              "Max the Miner",
              "I've got a sweet setup:\n• 10 ASIC miners running 24/7\n• Custom cooling system to keep them frosty\n• Solar panels to offset electricity costs\n• Mining pool connection for consistent rewards\n\nWant to see how it all works?",
              [
                { label: "Try Mining", action: () => openInModal(`${pagesURI}/crypto/mining`) },
                { label: "Back", action: () => dialogFunctions.intro(), keepOpen: true }
              ]
            );
          }
        };

        return dialogFunctions;
      },
      interact: async function () {
        const game = gameEnv.game;
        const npcProgressSystem = new NpcProgressSystem();
        const allowed = await npcProgressSystem.checkNpcProgress(game, sprite_data_mining.id);
        if (allowed) {
          const dialogFunctions = sprite_data_mining.reaction();
          dialogFunctions.intro();
        }
      }
    };

    const sprite_src_fidelity = path + "/images/gamify/fidelitygirl.png";
    const sprite_data_fidelity = {
      id: 'Fidelity',
      greeting: "Hi I'm Fidelity! Let's tackle some finance and tech questions!",
      src: sprite_src_fidelity,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { height: 747, width: 498 },
      INIT_POSITION: { x: width * 0.34, y: height * 0.15 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.03, heightPercentage: 0.06 },
      reaction: function() {
        return {
          intro: function() {
            gameEnv.game.attemptQuizForNpc(sprite_data_fidelity.id);
          }
        };
      },
      interact: async function () {
        const game = gameEnv.game;
        const npcProgressSystem = new NpcProgressSystem();
        const allowed = await npcProgressSystem.checkNpcProgress(game, sprite_data_fidelity.id);
        if (allowed) {
          gameEnv.game.updateNpcProgress(gameEnv.game.id, sprite_data_fidelity.id);
          const dialogFunctions = sprite_data_fidelity.reaction();
          dialogFunctions.intro();
        }
      }
    };

    const sprite_src_schwab = path + "/images/gamify/schwabbman.png";
    const sprite_data_schwab = {
      id: 'Schwab',
      greeting: "Hi I'm Schwab! Let's tackle some finance and tech questions!",
      src: sprite_src_schwab,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { height: 747, width: 398 },
      INIT_POSITION: { x: width * 0.48, y: height * 0.15 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.03, heightPercentage: 0.06 },
      reaction: function() {
        return {
          intro: function() {
            gameEnv.game.attemptQuizForNpc(sprite_data_schwab.id);
          }
        };
      },
      interact: async function () {
        const game = gameEnv.game;
        const npcProgressSystem = new NpcProgressSystem();
        const allowed = await npcProgressSystem.checkNpcProgress(game, sprite_data_schwab.id);
        if (allowed) {
          gameEnv.game.updateNpcProgress(gameEnv.game.id, sprite_data_schwab.id);
          const dialogFunctions = sprite_data_schwab.reaction();
          dialogFunctions.intro();
        }
      }
    };

    const sprite_src_computer = path + "/images/gamify/stockupdatepc.png";
    const sprite_greet_computer = "*Computer Fan Whirs* Let me show you the latest market news!";
    const sprite_data_computer = {
      id: 'Market Computer',
      greeting: sprite_greet_computer,
      src: sprite_src_computer,
      SCALE_FACTOR: 1.5,
      ANIMATION_RATE: 50,
      pixels: { height: 1068, width: 1078 },
      INIT_POSITION: { x: width * 0.9, y: height * 0.65 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function() {
        return {
          intro: function() {
            showDialogBox(
              "Market Computer",
              "*Computer Fan Whirs* Let me show you the latest market news!\nWould you like to view the latest market updates or financial news?",
              [
                { label: "Show Market Updates", action: () => alert("Market data loaded! (Feature coming soon)") },
                { label: "Thank you, Computer", action: () => {
                  // Give NPC cookie for completing the interaction
                  if (gameEnv.game && gameEnv.game.giveNpcCookie) {
                    gameEnv.game.giveNpcCookie(sprite_data_computer.id, "computer_interaction");
                  }
                } }
              ]
            );
          }
        };
      },
      interact: async function () {
        const game = gameEnv.game;
        const npcProgressSystem = new NpcProgressSystem();
        const allowed = await npcProgressSystem.checkNpcProgress(game, sprite_data_computer.id);
        if (allowed) {
          const dialogFunctions = sprite_data_computer.reaction();
          dialogFunctions.intro();
        }
      }
    };
    const sprite_src_bank = path + "/images/gamify/janetYellen.png";
    const sprite_data_bank = {
      id: 'Bank-NPC',
      greeting: "Welcome, I'm Janet Yellen, Secretary of the Treasury.",
      src: sprite_src_bank,
      SCALE_FACTOR: 5.5,
      ANIMATION_RATE: 50,
      pixels: { height: 282, width: 268 },
      INIT_POSITION: { x: width * 0.7, y: height * 0.75 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.05, heightPercentage: 0.1 },
      reaction: function () {
        function openInModal(url) {
          openReusableModal('yellenModal', 'yellenFrame', url);
        }

        const dialogFunctions = {
          intro: function() {
          showDialogBox(
            "Janet Yellen",
            "Welcome, I'm Janet Yellen, Secretary of the Treasury.\nToday, you have just been entrusted with an initial sum of $100,000 to shape your financial future.\nWould you like to learn about the bank, review your analytics, get financial tips, visit the Treasury website, or see the overall leaderboard?",
            [
                { label: "Learn about the Bank", action: () => dialogFunctions.explainBank(), keepOpen: true },
                { label: "Review Analytics", action: () => dialogFunctions.analyticsIntro(), keepOpen: true },
                { label: "Financial Tip", action: () => dialogFunctions.financialTip(), keepOpen: true },
                { label: "Loans", action: () => openInModal(`${pagesURI}/gamify/loan`)},
                { label: "Overall Leaderboard", action: () => openInModal(`${pagesURI}/leaderboard/overall-leaderboard`) },
                { label: "Thank you, Ms. Yellen", action: () => {
                  // Give NPC cookie for completing the dialogue
                  if (gameEnv.game && gameEnv.game.giveNpcCookie) {
                    gameEnv.game.updateNpcProgress(gameEnv.game.id, sprite_data_bank.id);
                    gameEnv.game.giveNpcCookie(sprite_data_bank.id, "dialogue_completed");
                  }
                } }
            ]
          );
          },
          explainBank: function() {
          showDialogBox(
            "Janet Yellen",
            "The Bank keeps track of your every transaction, monitors your balance, and helps you plan for the future.\nWould you like to see your analytics or hear a tip?",
            [
                { label: "See Analytics", action: () => dialogFunctions.analyticsIntro(), keepOpen: true },
                { label: "Financial Tip", action: () => dialogFunctions.financialTip(), keepOpen: true },
                { label: "Back", action: () => dialogFunctions.intro(), keepOpen: true }
            ]
          );
          },
          analyticsIntro: function() {

          showDialogBox(
            "Janet Yellen",
            "Bank Analytics provides a detailed overview of your spending, investments, and savings.\nWould you like to proceed to the analytics dashboard?",
            [
              { label: "Open Analytics", action: () => showYellenModal(`${pagesURI}/gamify/bankanalytics`) },
                { label: "Back", action: () => dialogFunctions.intro(), keepOpen: true }
            ]
          );
          },
          financialTip: function() {
          const tips = [
            "Diversify your investments to reduce risk.",
            "Always keep an emergency fund.",
            "Track your spending to find savings opportunities.",
            "Invest for the long term, not quick gains.",
            "Review your financial goals regularly.",
            "Bonus: Even small savings add up over time!"
          ];
          const tip = tips[Math.floor(Math.random() * tips.length)];
          showDialogBox(
            "Janet Yellen - Financial Tip",
            tip,
            [
                { label: "Another Tip", action: () => dialogFunctions.financialTip(), keepOpen: true },
                { label: "Back", action: () => dialogFunctions.intro(), keepOpen: true }
            ]
          );
        }
        };

        // Return the dialog functions so they can be accessed from interact
        return dialogFunctions;
      },
      interact: async function () {
        const game = gameEnv.game;
        const npcProgressSystem = new NpcProgressSystem();
        const allowed = await npcProgressSystem.checkNpcProgress(game, sprite_data_bank.id);
        if (allowed) {
          const dialogFunctions = sprite_data_bank.reaction();
          dialogFunctions.intro();
        }
      }
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_desert },
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_crypto },
      { class: Npc, data: sprite_data_mining },
      { class: Npc, data: sprite_data_stocks},
      { class: Npc, data: sprite_data_casino},
      { class: Npc, data: sprite_data_fidelity },
      { class: Npc, data: sprite_data_schwab },
      { class: Npc, data: sprite_data_bank},
      { class: Npc, data: sprite_data_mining}
    ];
    this.npcProgressSystem = new NpcProgressSystem();
  }
}

export default GameLevelAirport;

// Make GameLevelAirport available globally for auto-instntiation
if (typeof window !== 'undefined') {
  window.GameLevelAirport = GameLevelAirport;
}

// Waypoint Arrow Integration
window.addEventListener('DOMContentLoaded', function() {
  let gameCanvas = document.getElementById('gameCanvas');
  let gameContainer = document.getElementById('gameContainer') || (gameCanvas && gameCanvas.parentNode);
  if (!gameContainer) return;

  // Initialize the waypoint arrow
  new WaypointArrow(gameCanvas, window.gamePath);
});

// Utility function to create and open a reusable modal with an iframe
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

    // Create iframe wrapper
    const iframeWrapper = document.createElement("div");
    iframeWrapper.id = `${frameId}Wrapper`;
    iframeWrapper.style.position = "relative";
    iframeWrapper.style.overflow = "hidden";
    iframeWrapper.style.width = "90%";
    iframeWrapper.style.maxWidth = "1000px";
    iframeWrapper.style.height = "80%";
    iframeWrapper.style.border = "2px solid #ccc";
    iframeWrapper.style.borderRadius = "8px";
    iframeWrapper.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
    modal.appendChild(iframeWrapper);

    // Create iframe
    const frame = document.createElement("iframe");
    frame.id = frameId;
    frame.style.width = "100%";
    frame.style.height = "110%";
    frame.style.position = "absolute";
    frame.style.top = "0%";
    frame.style.left = "0";
    frame.style.border = "none";
    iframeWrapper.appendChild(frame);

    // Add close button
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✖";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.fontSize = "24px";
    closeBtn.style.background = "#00ff80";
    closeBtn.style.color = "#000";
    closeBtn.style.border = "none";
    closeBtn.style.padding = "10px 15px";
    closeBtn.style.borderRadius = "5px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.boxShadow = "0 0 15px rgba(0,255,128,0.5)";
    closeBtn.style.zIndex = "1100";
    closeBtn.style.transition = "all 0.3s ease";
    closeBtn.onmouseover = () => {
      closeBtn.style.background = "#00cc66";
      closeBtn.style.transform = "scale(1.1)";
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.background = "#00ff80";
      closeBtn.style.transform = "scale(1)";
    };
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
