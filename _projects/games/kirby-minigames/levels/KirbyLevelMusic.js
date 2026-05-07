import PeppaMusic from "../../peppa-pig/levels/PeppaMusic.js";

class KirbyLevelMusic extends PeppaMusic {
  constructor(options = {}) {
    const previousController = window.__kirbyLevelMusicController;
    if (previousController && typeof previousController.destroy === "function") {
      previousController.destroy();
    }

    super();

    this.levelName = options.levelName || "Kirby Minigames";
    this.buttonId = options.buttonId || "kirby-level-music-toggle";
    this.storageKey = options.storageKey || "kirby-minigames:music-enabled";
    this.endpoint = options.endpoint || this.endpoint;
    this.buttonLabel = options.buttonLabel || `${this.levelName} Music`;

    if (this.toggleBtn) {
      this.toggleBtn.id = this.buttonId;
      this.toggleBtn.setAttribute("aria-label", this.buttonLabel);
      this.toggleBtn.title = this.buttonLabel;
    }

    this.restorePreference();
    window.__kirbyLevelMusicController = this;
    this._beforeUnloadHandler = () => this.destroy();
    window.addEventListener("beforeunload", this._beforeUnloadHandler, {
      once: true,
    });
    this.updateButton();
  }

  createToggleButton() {
    document
      .querySelectorAll("[data-kirby-level-music='true'], #peppa-music-toggle")
      .forEach((node) => node.remove());

    const btn = document.createElement("button");
    btn.id = "peppa-music-toggle";
    btn.dataset.kirbyLevelMusic = "true";
    btn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 10000;
      padding: 8px 16px;
      font-size: 14px;
      font-family: sans-serif;
      background: #1f6fd6;
      color: white;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleMusic();
    });
    document.body.appendChild(btn);
    this.toggleBtn = btn;
  }

  restorePreference() {
    try {
      const savedPreference = localStorage.getItem(this.storageKey);
      this.enabled = savedPreference !== "off";
    } catch (_) {
      this.enabled = true;
    }
  }

  savePreference(isEnabled) {
    try {
      localStorage.setItem(this.storageKey, isEnabled ? "on" : "off");
    } catch (_) {}
  }

  async startMusic() {
    if (!this.enabled) return;
    await super.startMusic();
    this.updateButton();
  }

  stopMusic() {
    super.stopMusic();
    this.updateButton();
  }

  async toggleMusic() {
    if (this.isPlaying) {
      this.enabled = false;
      this.savePreference(false);
      this.stopMusic();
      return;
    }

    this.enabled = true;
    this.savePreference(true);

    if (!this.started) {
      this.userActivated = true;
      await this.startMusic();
      return;
    }

    if (!this.audio) {
      await this.startMusic();
      return;
    }

    try {
      await this.audio.play();
      this.isPlaying = true;
    } catch (error) {
      console.warn("Kirby level music: failed to resume music", error);
      this.isPlaying = false;
    }

    this.updateButton();
  }

  activateFromUserGesture() {
    if (!this.enabled) return;
    super.activateFromUserGesture();
  }

  attach() {
    if (this.enabled) {
      this.addGestureListeners();
    }
    this.updateButton();
    return this;
  }

  updateButton() {
    if (!this.toggleBtn) return;
    const stateIcon = this.isPlaying ? "🔊" : "🔇";
    this.toggleBtn.textContent = `${stateIcon} ${this.levelName} Music`;
  }

  destroy() {
    this.removeGestureListeners();
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.audio = null;
    this.started = false;
    this.isPlaying = false;

    if (this.toggleBtn) {
      this.toggleBtn.remove();
      this.toggleBtn = null;
    }

    if (window.__kirbyLevelMusicController === this) {
      window.__kirbyLevelMusicController = null;
    }

    if (this._beforeUnloadHandler) {
      window.removeEventListener("beforeunload", this._beforeUnloadHandler);
      this._beforeUnloadHandler = null;
    }
  }
}

export default KirbyLevelMusic;
