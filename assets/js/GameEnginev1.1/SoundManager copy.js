class SoundManager {
    constructor() {
        this.sounds = {};
        this.volume = 0.5;
        this.muted = false;
        this.initializeSounds();
    }

    initializeSounds() {
        // Initialize sound objects for each event type
        const soundEffects = {
            crash_sound: 'assets/sounds/market/crash.mp3',
            rally_sound: 'assets/sounds/market/rally.mp3',
            earnings_sound: 'assets/sounds/market/earnings.mp3',
            fed_sound: 'assets/sounds/market/fed.mp3',
            merger_sound: 'assets/sounds/market/merger.mp3',
            ipo_sound: 'assets/sounds/market/ipo.mp3',
            disaster_sound: 'assets/sounds/market/disaster.mp3',
            political_sound: 'assets/sounds/market/political.mp3',
            tech_sound: 'assets/sounds/market/tech.mp3',
            regulatory_sound: 'assets/sounds/market/regulatory.mp3'
        };

        // Create Audio objects for each sound
        for (const [key, path] of Object.entries(soundEffects)) {
            this.sounds[key] = new Audio(path);
            this.sounds[key].volume = this.volume;
        }
    }

    playSound(soundType) {
        if (this.muted) return;

        const sound = this.sounds[soundType];
        if (sound) {
            // Clone the audio to allow multiple simultaneous plays
            const soundClone = sound.cloneNode();
            soundClone.volume = this.volume;
            soundClone.play().catch(error => {
                console.warn(`Failed to play sound ${soundType}:`, error);
            });
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    isMuted() {
        return this.muted;
    }
}

export default SoundManager; 