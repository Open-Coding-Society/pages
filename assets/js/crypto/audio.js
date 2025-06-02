// Audio manager for crypto mining interface
class AudioManager {
    constructor() {
        this.sounds = {
            miningStart: new Audio('/assets/sounds/crypto/mining_start.mp3'),
            miningStop: new Audio('/assets/sounds/crypto/mining_stop.mp3'),
            reward: new Audio('/assets/sounds/crypto/reward.mp3'),
            click: new Audio('/assets/sounds/crypto/click.mp3'),
            bgm: new Audio('/assets/sounds/crypto/mining_bgm.mp3')
        };

        // Configure BGM
        this.sounds.bgm.loop = true;
        this.sounds.bgm.volume = 0.3;

        // Configure other sounds
        this.sounds.miningStart.volume = 0.5;
        this.sounds.miningStop.volume = 0.5;
        this.sounds.reward.volume = 0.6;
        this.sounds.click.volume = 0.4;

        // Initialize audio state
        this.isMuted = localStorage.getItem('cryptoAudioMuted') === 'true';
        this.isBGMPlaying = false;
    }

    // Play a sound effect
    play(soundName) {
        if (this.isMuted) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            // Reset the sound to start if it's already playing
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.warn(`Error playing sound ${soundName}:`, error);
            });
        }
    }

    // Toggle BGM
    toggleBGM() {
        if (this.isMuted) return;

        if (this.isBGMPlaying) {
            this.sounds.bgm.pause();
            this.isBGMPlaying = false;
        } else {
            this.sounds.bgm.play().catch(error => {
                console.warn('Error playing BGM:', error);
            });
            this.isBGMPlaying = true;
        }
    }

    // Toggle mute state
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('cryptoAudioMuted', this.isMuted);

        if (this.isMuted) {
            this.sounds.bgm.pause();
            this.isBGMPlaying = false;
        } else if (this.isBGMPlaying) {
            this.sounds.bgm.play().catch(error => {
                console.warn('Error playing BGM:', error);
            });
        }
    }

    // Stop all sounds
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.isBGMPlaying = false;
    }
}

// Create global audio manager instance
window.audioManager = new AudioManager();

// Export for module usage
export default window.audioManager;