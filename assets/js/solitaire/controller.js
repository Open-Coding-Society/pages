// /assets/js/solitaire/controller.js

export class Controller {
  constructor(game, ui) {
    this.game = game;
    this.ui = ui;
  }

  startNewGame() { this.game.newGame(); }
  restart() { this.game.newGame(); }
  handleStockClick() { this.game.drawFromStock(); }
  handleCardClick(cardId) {
    if (this.game.autoMoveToFoundation(cardId)) return;
    // Extendable: smart hints on click if no auto move
  }
  handleDrop(cardId, targetKind, targetIndex) {
    this.game.tryMoveCardById(cardId, targetKind, targetIndex);
  }
  showMenu() { this.ui.showMenu(); }
  showOver() { this.ui.showOver(this.game.score, this.ui.currentTimeStr()); }

  hint() {
    // Same behavior preserved
    alert("Hint: Move Aces to foundations. Uncover face-down tableau cards. Build alternating colors down.");
  }
  undo() {
    // Same placeholder behavior preserved
    alert("Undo feature: implement by pushing moves to a stack and reversing them.");
  }
}
