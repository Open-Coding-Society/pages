import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Npc from './GameEngine/Npc.js';
import Player from './GameEngine/Player.js';

class GameLevelWallstreet {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_src_city = path + "/images/gamify/city.png";
    const image_data_city = {
      name: 'city',
      greeting: "Welcome to the city! It is like paradise, bustling and vast so enjoy your stay!",
      src: image_src_city,
      pixels: { height: 966, width: 654 }
    };


    // const decorStatue = new Npc({
    //   id: 'Statue',
    //   src: image_src_statue,
    //   SCALE_FACTOR: 4,
    //   ANIMATION_RATE: 0,
    //   pixels: { height: 300, width: 200 },
    //   INIT_POSITION: { x: width * 0.4, y: height * 0.6 },
    //   orientation: { rows: 1, columns: 1 },
    //   down: { row: 0, start: 0, columns: 1 },
    //   hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 }
    //   // No 'reaction' or 'interact' functions
    // });

    // gameEnv.addObject(decorStatue);


    const sprite_src_chillguy = path + "/images/gamify/chillguy.png";
    const CHILLGUY_SCALE_FACTOR = 5;
    const sprite_data_chillguy = {
      id: 'Chill Guy',
      greeting: "Hi I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
      src: sprite_src_chillguy,
      SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / CHILLGUY_SCALE_FACTOR) },
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
      INIT_POSITION: { x: width * 0.28, y: height * 0.82 },
      orientation: { rows: 1, columns: 1 }, 
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        function intro() {
          alert("Hey, kid. I'm Frank Sinatra — welcome to the bright lights and wild nights of Las Vegas.\nHere, you can test your luck on Blackjack, Poker, or the Minefield Challenge.\nBut remember: in gambling, the swing of fortune can be swift and brutal.\nWant a tip before you step in?");
        }
        function giveAdvice() {
          const adviceList = [
            "The house always has an edge, so play smart and know when to walk away.",
            "Set a budget before you play, and never chase your losses.",
            "Luck be a lady tonight, but skill keeps you in the game.",
            "Sometimes the best bet is the one you don't make.",
            "Enjoy the thrill, but remember: it's just a game."
          ];
          const advice = adviceList[Math.floor(Math.random() * adviceList.length)];
          alert("Frank's Advice: " + advice + "\nWant to answer a question before you go in?");
        }
        function askQuestion() {
          alert("Frank's Question: If you won a big jackpot tonight, what would you do with the money?");
        }
        function frankResponse(response) {
          alert("Frank Sinatra: " + response + "\nReady to try your luck?");
        }
        intro();
      },
      interact: function () {
        this.reaction();
      }
    };

    const sprite_src_stocks = path + "/images/gamify/stockguy.png";
    const sprite_data_stocks = {
      id: 'Stock-NPC',
      greeting: "Good day, I am J.P. Morgan, financier of industry and architect of American banking.",
      src: sprite_src_stocks,
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 441, width: 339 },
      INIT_POSITION: { x: width / 3, y: height / 3 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        function intro() {
          alert("Good day, I am J.P. Morgan, financier of industry and architect of American banking.\nAre you ready to test your skills in the stock market?");
        }
        function explainStocks() {
          alert("The stock market is a place of opportunity and risk. You can buy shares in companies and watch your investments grow—or shrink.\nWould you like to proceed to the Stock Exchange and begin your investment journey?");
        }
        function whatAreStocks() {
          alert("Stocks represent ownership in a company. When you buy a stock, you become a partial owner and can benefit from its success.\nWould you like to try investing now?");
        }
        intro();
      },
      interact: function () { this.reaction(); }
    };

    const sprite_src_crypto = path + "/images/gamify/satoshiNakamoto.png";
    const sprite_data_crypto = {
      id: 'Crypto-NPC',
      greeting: "Greetings, seeker. I am Satoshi Nakamoto, architect of decentralized currency.",
      src: sprite_src_crypto,
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 282, width: 282 },
      INIT_POSITION: { x: width * 0.75, y: height * 0.6 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        function intro() {
          alert("Greetings, seeker. I am Satoshi Nakamoto, architect of decentralized currency.\nAre you curious about Bitcoin or ready to explore the Crypto Hub?");
        }
        function aboutBitcoin() {
          alert("Bitcoin is a decentralized digital currency, born from a desire for freedom and transparency. It operates without banks or governments.\nWould you like to know how to buy or mine Bitcoin?");
        }
        function howToBuy() {
          alert("To buy Bitcoin, you need a digital wallet and access to a crypto exchange. You can purchase fractions of a Bitcoin.\nWould you like to visit the Crypto Hub to start your journey?");
        }
        function howToMine() {
          alert("Mining Bitcoin requires powerful computers to solve complex puzzles. Miners are rewarded with Bitcoin for verifying transactions.\nWould you like to try mining or learn more?");
        }
        intro();
      },
      interact: function () {
        this.reaction();
      }
    };

    const image_src_bank = path + "/images/gamify/bank.png";

    const spriteBank = {
      id: 'bank',
      src: image_src_bank,
      SCALE_FACTOR: 4,
      pixels: {height: 270, width: 377},
      INIT_POSITION: { x: width * 0.6, y: height * 0.41 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      orientation: { rows: 1, columns: 1 },
    }

    // === Fixed Bank NPC ===
    const sprite_src_bank = path + "/images/gamify/janetYellen.png";
    const sprite_data_bank = {
      id: 'Bank-NPC',
      greeting: "Welcome, I'm Janet Yellen, Secretary of the Treasury.",
      src: sprite_src_bank,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { height: 282, width: 268 },
      INIT_POSITION: { x: width * 0.6, y: height * 0.41 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        function intro() {
          alert("Welcome, I'm Janet Yellen, Secretary of the Treasury.\nToday, you have just been entrusted with an initial sum of $100,000 to shape your financial future.\nWould you like to learn about the bank, review your analytics, or get financial tips?");
        }
        function explainBank() {
          alert("The Bank keeps track of your every transaction, monitors your balance, and helps you plan for the future.\nWould you like to see your analytics or hear a tip?");
        }
        function analyticsIntro() {
          alert("Bank Analytics provides a detailed overview of your spending, investments, and savings.\nWould you like to proceed to the analytics dashboard?");
        }
        function financialTip() {
          const tips = [
            "Diversify your investments to reduce risk.",
            "Always keep an emergency fund.",
            "Track your spending to find savings opportunities.",
            "Invest for the long term, not quick gains.",
            "Review your financial goals regularly."
          ];
          const tip = tips[Math.floor(Math.random() * tips.length)];
          alert("Janet Yellen - Financial Tip: " + tip);
        }
        intro();
      },
      interact: function () {
        this.reaction();
      }
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_city },
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_casino },
      { class: Npc, data: sprite_data_stocks },
      { class: Npc, data: sprite_data_crypto },
      { class: Npc, data: sprite_data_bank },
      // {class: Npc, data: spriteBank},
    ];
  }
}

export default GameLevelWallstreet;
