// RedRidingMusic.js
class RedRidingMusic {
  constructor() {
    this.audio = null;
    this.started = false;
    this.isPlaying = false;
    // Search for a fitting song on iTunes
    this.endpoint = 'https://itunes.apple.com/search?term=little+red+riding+hood&entity=song&limit=5';
    this.userActivated = false;
    this.createToggleButton();
  }

  createToggleButton() {
    const btn = document.createElement('button');
    btn.id = 'red-riding-music-toggle';
    btn.innerHTML = '🎵 Music';

    // Styled to match your red theme
    btn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 10000;
      padding: 10px 20px;
      font-size: 16px;
      font-family: 'Courier New', Courier, monospace;
      font-weight: bold;
      background: #8b0000;
      color: white;
      border: 2px solid #ff4444;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(255,0,0,0.5);
    `;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMusic();
    });

    document.body.appendChild(btn);
    this.toggleBtn = btn;
  }

  async fetchPreviewUrl() {
    try {
        const response = await fetch(this.endpoint);
        const data = await response.json();
        // Look for the first result with a preview URL
        const track = data.results.find(item => item.previewUrl);
        if (!track) throw new Error('No track found');
        return track.previewUrl;
    } catch (error) {
        console.error("iTunes API Error:", error);
        return null;
    }
  }

  async startMusic() {
    if (this.started) return;

    const previewUrl = await this.fetchPreviewUrl();
    if (previewUrl) {
      this.audio = new Audio(previewUrl);
      this.audio.volume = 0.3;
      this.audio.loop = true;
      await this.audio.play();
      this.started = true;
      this.isPlaying = true;
      this.updateButton();
    }
  }

  async toggleMusic() {
    if (!this.started) {
      await this.startMusic();
    } else if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      await this.audio.play();
      this.isPlaying = true;
    }
    this.updateButton();
  }

  updateButton() {
    if (this.toggleBtn) {
      this.toggleBtn.innerHTML = this.isPlaying ? '🔊 Music On' : '🔈 Music Off';
      this.toggleBtn.style.background = this.isPlaying ? '#8b0000' : '#444';
    }
  }

  destroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    if (this.toggleBtn) this.toggleBtn.remove();
  }
}

export default RedRidingMusic;