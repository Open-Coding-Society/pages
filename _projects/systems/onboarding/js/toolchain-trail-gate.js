import { SnakeApple, SnakePlayer } from './toolchain-snake.js';

export default class ToolchainTrailGate {
  constructor(env) {
    const { challenge, save, counter, errorMessage } = env.game.environment.toolchainSnakeGate;
    this.gameControl = env.gameControl;
    this.save = save;
    this.counter = counter;
    this.errorMessage = errorMessage;
    this.progress = { id: 'toolchain-snake-gate', challengeId: challenge.id, current: 0, goal: 5 };
    this.showScore();
    this.classes = [
      { class: SnakePlayer, data: { id: 'toolchain-snake', gate: this } },
      { class: SnakeApple, data: { id: 'toolchain-apple' } },
    ];
  }

  showScore() {
    this.counter.textContent = `Apples: ${this.progress.current} / ${this.progress.goal}`;
  }

  recordApple() {
    if (this.isComplete()) return;
    this.progress.current++;
    this.showScore();
    this.gameControl.reportProgress();
  }

  resetScore() {
    this.progress.current = 0;
    this.showScore();
    this.gameControl.reportProgress();
  }

  getProgress() {
    return this.progress;
  }

  isComplete() {
    return this.progress.current >= this.progress.goal;
  }

  onComplete() {
    this.errorMessage.textContent = '';
    return this.save();
  }

  onCompletionError(error) {
    this.errorMessage.textContent = `Unlock could not be saved: ${error.message}`;
  }
}
