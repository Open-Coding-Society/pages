class PeppaMusic {
  constructor() {
    this.audio = null;
    this.started = false;
    this.endpoint = 'https://itunes.apple.com/search?term=peppa%20pig%20theme&entity=song&limit=10';
    this.userActivated = false;
    this.activateFromUserGesture = this.activateFromUserGesture.bind(this);
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
      this.removeGestureListeners();
      console.log('Peppa music API: playback started');
    } catch (error) {
      console.warn('Peppa music API: failed to start music', error);
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