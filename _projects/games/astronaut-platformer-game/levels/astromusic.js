console.log("astromusic.js loaded from _projects/astronaut-platformer-game/levels");
class AstroMusic {
  constructor() {
    this.audio = null;
    this.started = false;
    this.isPlaying = false;
    this.userActivated = false;
    this.activateFromUserGesture = this.activateFromUserGesture.bind(this);

    this.queries = [
      'space ambient instrumental',
      'sci fi instrumental soundtrack',
      'space synth instrumental',
      'ambient electronic instrumental',
      'chiptune space instrumental',
    ];

    this.vocalKeywords = [
      'feat', 'ft.', 'vocal', 'remix', 'radio edit',
      'acoustic', 'live', 'karaoke', 'cover', 'mix',
    ];

    this.createToggleButton();
  }

  createToggleButton() {
    const btn = document.createElement('button');
    btn.id = 'astro-music-toggle';
    btn.innerHTML = '🔇 Music';
    btn.style.cssText = `
      position: fixed;
      bottom: 18px;
      left: 18px;
      z-index: 10000;
      padding: 8px 16px;
      font-size: 14px;
      font-family: 'Press Start 2P', monospace, sans-serif;
      background: rgba(0, 0, 0, 0.75);
      color: #44ff88;
      border: 2px solid #44ff88;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 0 12px rgba(0, 255, 136, 0.4);
      letter-spacing: 1px;
      transition: all 0.2s;
    `;
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(0,180,100,0.35)';
      btn.style.boxShadow  = '0 0 18px rgba(0,255,136,0.7)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = this.isPlaying ? 'rgba(0,180,100,0.35)' : 'rgba(0,0,0,0.75)';
      btn.style.boxShadow  = this.isPlaying ? '0 0 18px rgba(0,255,136,0.7)' : '0 0 12px rgba(0,255,136,0.4)';
    });
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.blur();
      this.toggleMusic();
    });
    document.body.appendChild(btn);
    this.toggleBtn = btn;
  }

  async fetchPreviewUrl() {
    for (const term of this.queries) {
      try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=25`;
        const response = await fetch(url);
        if (!response.ok) continue;

        const data = await response.json();
        const tracks = Array.isArray(data.results) ? data.results : [];

        const scored = tracks
          .filter(t => t && t.previewUrl)
          .map(t => {
            const name  = (t.trackName        || '').toLowerCase();
            const genre = (t.primaryGenreName || '').toLowerCase();

            if (this.vocalKeywords.some(k => name.includes(k))) return null;

            let score = 0;
            if (name.includes('instrumental'))  score += 4;
            if (name.includes('ambient'))        score += 3;
            if (name.includes('theme'))          score += 2;
            if (name.includes('score'))          score += 2;
            if (name.includes('bgm'))            score += 2;
            if (name.includes('ost'))            score += 2;
            if (genre.includes('instrumental'))  score += 4;
            if (genre.includes('soundtrack'))    score += 3;
            if (genre.includes('ambient'))       score += 3;
            if (genre.includes('electronic'))    score += 1;
            if (genre.includes('classical'))     score += 1;

            return { track: t, score };
          })
          .filter(Boolean)
          .sort((a, b) => b.score - a.score);

        if (scored.length === 0) continue;

        const pick = scored[Math.floor(Math.random() * Math.min(3, scored.length))].track;
        console.log(`Astro music API: "${pick.trackName}" by ${pick.artistName} [${pick.primaryGenreName}]`);
        return pick.previewUrl;

      } catch (_) { /* try next query */ }
    }

    throw new Error('Astro music API: no playable preview URL found');
  }

  async startMusic() {
    if (this.started || !this.userActivated) return;

    try {
      const previewUrl = await this.fetchPreviewUrl();
      this.audio = new Audio(previewUrl);
      this.audio.volume = 0.75;
      this.audio.loop   = true;
      await this.audio.play();
      this.started   = true;
      this.isPlaying = true;
      this.removeGestureListeners();
      this.updateButton();
      console.log('Astro music API: playback started');
    } catch (error) {
      console.warn('Astro music API: failed to start music', error);
    }
  }

  stopMusic() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      this.updateButton();
      console.log('Astro music API: playback stopped');
    }
  }

  async toggleMusic() {
    if (!this.started) {
      this.userActivated = true;
      await this.startMusic();
    } else if (this.isPlaying) {
      this.stopMusic();
    } else {
      if (this.audio) {
        await this.audio.play();
        this.isPlaying = true;
        this.updateButton();
        console.log('Astro music API: playback resumed');
      }
    }
  }

  updateButton() {
    if (!this.toggleBtn) return;
    const on = this.isPlaying;
    this.toggleBtn.innerHTML        = on ? '🔊 Music' : '🔇 Music';
    this.toggleBtn.style.background = on ? 'rgba(0,180,100,0.35)' : 'rgba(0,0,0,0.75)';
    this.toggleBtn.style.color      = on ? '#ffffff' : '#44ff88';
    this.toggleBtn.style.boxShadow  = on
      ? '0 0 18px rgba(0,255,136,0.7)'
      : '0 0 12px rgba(0,255,136,0.4)';
  }

  activateFromUserGesture() {
    this.userActivated = true;
    this.startMusic();
  }

  addGestureListeners() {
    window.addEventListener('click',      this.activateFromUserGesture, { once: true });
    window.addEventListener('keydown',    this.activateFromUserGesture, { once: true });
    window.addEventListener('touchstart', this.activateFromUserGesture, { once: true });
  }

  removeGestureListeners() {
    window.removeEventListener('click',      this.activateFromUserGesture);
    window.removeEventListener('keydown',    this.activateFromUserGesture);
    window.removeEventListener('touchstart', this.activateFromUserGesture);
  }
}

export default AstroMusic;