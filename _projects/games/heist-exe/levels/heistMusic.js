console.log("heistMusic.js loaded");

class heistMusic {
  constructor() {
    this.player = null;
    this.started = false;
    this.isPlaying = false;
    this.videoId = 'wZe-_boTWMk';
    this.loopEnd = 58;
    this.loopInterval = null;
    this.userActivated = false;
    this.activateFromUserGesture = this.activateFromUserGesture.bind(this);
    this.loadYouTubeAPI();
    this.createToggleButton();
  }

  loadYouTubeAPI() {
    if (document.getElementById('yt-iframe-api')) return;
    const tag = document.createElement('script');
    tag.id = 'yt-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      if (this.userActivated && !this.started) this.startMusic();
    };
  }

  createToggleButton() {
    const btn = document.createElement('button');
    btn.id = 'heist-music-toggle';
    btn.innerHTML = 'Music';
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

    const container = document.createElement('div');
    container.id = 'heist-yt-player';
    container.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;bottom:0;left:0;';

    document.body.appendChild(container);
    document.body.appendChild(btn);
    this.toggleBtn = btn;
  }

  startMusic() {
    if (this.started || !this.userActivated) return;
    if (!window.YT || !window.YT.Player) return; // API not ready yet; onYouTubeIframeAPIReady will retry
    try {
      this.player = new window.YT.Player('heist-yt-player', {
        height: '1',
        width: '1',
        videoId: this.videoId,
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, rel: 0 },
        events: {
          onReady: (event) => {
            event.target.setVolume(35);
            event.target.playVideo();
            this.started = true;
            this.isPlaying = true;
            this.removeGestureListeners();
            this.updateButton();
            this.startLoopWatcher();
          },
          onError: (event) => {
            console.warn('heistMusic: player error', event.data);
          },
        },
      });
    } catch (error) {
      console.warn('heistMusic: Failed to start music', error);
    }
  }

  startLoopWatcher() {
    this.stopLoopWatcher();
    this.loopInterval = setInterval(() => {
      if (!this.player || !this.isPlaying) return;
      if (this.player.getCurrentTime() >= this.loopEnd) {
        this.player.seekTo(0, true);
        this.player.playVideo();
      }
    }, 500);
  }

  stopLoopWatcher() {
    if (this.loopInterval !== null) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
  }

  stopMusic() {
    if (this.player) {
      this.player.pauseVideo();
      this.player.seekTo(0, true);
      this.isPlaying = false;
      this.stopLoopWatcher();
      this.updateButton();
    }
  }

  toggleMusic() {
    if (!this.started) {
      this.userActivated = true;
      this.startMusic();
    } else if (this.isPlaying) {
      this.stopMusic();
    } else {
      if (this.player) {
        this.player.playVideo();
        this.isPlaying = true;
        this.startLoopWatcher();
        this.updateButton();
      }
    }
  }

  updateButton() {
    if (this.toggleBtn) {
      this.toggleBtn.innerHTML = this.isPlaying ? 'Music On' : 'Music Off';
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

export default heistMusic;
