console.log("PeppaMusic.js loaded from _projects/PeppaPigGame/levels");
class PeppaMusic {
  constructor() {
    this.audio = null;
    this.started = false;
    this.isPlaying = false;
    this.endpoint = 'https://itunes.apple.com/search?term=peppa%20pig%20theme&entity=song&limit=10';
    this.userActivated = false;
    this.activateFromUserGesture = this.activateFromUserGesture.bind(this);
    this.createToggleButton();
  }

  createToggleButton() {
    // Create the music toggle button
    const btn = document.createElement('button');
    btn.id = 'peppa-music-toggle';
    btn.innerHTML = '🔇 Music';
    btn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 10000;
      padding: 8px 16px;
      font-size: 14px;
      font-family: sans-serif;
      background: #ff6b9d;
      color: white;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMusic();
    });
    document.body.appendChild(btn);
    this.toggleBtn = btn;
  }

  async fetchPreviewUrl() {
    const response = await fetch(this.endpoint);
    if (!response.ok) {
      throw new Error('API request failed (' + response.status + ')');
    }

    const data = await response.json();
    const tracks = (data && Array.isArray(data.results)) ? data.results : [];
    const track = tracks.find(function(item) {
      return item && item.previewUrl;
    });

    if (!track || !track.previewUrl) {
      throw new Error('No playable preview URL found in API response');
    }

    return track.previewUrl;
  }

  async startMusic() {
    if (this.started || !this.userActivated) return;

    try {
      const previewUrl = await this.fetchPreviewUrl();
      this.audio = new Audio(previewUrl);
      this.audio.volume = 0.35;
      this.audio.loop = true;
      await this.audio.play();
      this.started = true;
      this.isPlaying = true;
      this.removeGestureListeners();
      this.updateButton();
      console.log('Peppa music API: playback started');
    } catch (error) {
      console.warn('Peppa music API: failed to start music', error);
    }
  }

  stopMusic() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      this.updateButton();
      console.log('Peppa music API: playback stopped');
    }
  }

  async toggleMusic() {
    if (!this.started) {
      // First time - need to activate from user gesture
      this.userActivated = true;
      await this.startMusic();
    } else if (this.isPlaying) {
      this.stopMusic();
    } else {
      // Resume playing
      if (this.audio) {
        await this.audio.play();
        this.isPlaying = true;
        this.updateButton();
        console.log('Peppa music API: playback resumed');
      }
    }
  }

  updateButton() {
    if (this.toggleBtn) {
      this.toggleBtn.innerHTML = this.isPlaying ? '🔊 Music' : '🔇 Music';
    }
  }

  activateFromUserGesture() {
    this.userActivated = true;
    this.startMusic();
  }

  addGestureListeners() {
    window.addEventListener('click', this.activateFromUserGesture, { once: true });
    window.addEventListener('keydown', this.activateFromUserGesture, { once: true });
    window.addEventListener('touchstart', this.activateFromUserGesture, { once: true });
  }

  removeGestureListeners() {
    window.removeEventListener('click', this.activateFromUserGesture);
    window.removeEventListener('keydown', this.activateFromUserGesture);
    window.removeEventListener('touchstart', this.activateFromUserGesture);
  }
}

export default PeppaMusic;