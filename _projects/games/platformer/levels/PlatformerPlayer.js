import PlayerPlatformer from '@assets/js/GameEnginev1.1/essentials/PlayerPlatformer.js';

class PlatformerPlayer extends PlayerPlatformer {
	constructor(data = {}, gameEnv = null) {
		super(data, gameEnv);

		this.debugHitbox = Boolean(data?.debugHitbox);
		this.debugHitboxColor = data?.debugHitboxColor || 'rgba(57, 255, 20, 0.95)';
		this._debugHitboxElement = null;
		this.jumpSoundSrc = data?.jumpSoundSrc || null;
		this.jumpSoundVolume = data?.jumpSoundVolume ?? 0.7;
		this._jumpAudio = null;

		if (this.debugHitbox) {
			this._ensureDebugHitboxElement();
		}

		if (this.jumpSoundSrc) {
			this._jumpAudio = new Audio(this.jumpSoundSrc);
			this._jumpAudio.preload = 'auto';
			this._jumpAudio.volume = Math.min(1, Math.max(0, this.jumpSoundVolume));
		}
	}

	_playJumpSound() {
		if (!this._jumpAudio) return;
		try {
			this._jumpAudio.currentTime = 0;
			this._jumpAudio.play().catch(() => {});
		} catch (_) {}
	}

	_ensureDebugHitboxElement() {
		if (!this.debugHitbox || this._debugHitboxElement || !this.gameEnv?.container) return;

		const el = document.createElement('div');
		el.id = `${this.id}-hitbox-debug`;
		el.style.position = 'absolute';
		el.style.pointerEvents = 'none';
		el.style.border = `2px solid ${this.debugHitboxColor}`;
		el.style.boxSizing = 'border-box';
		el.style.borderRadius = '50%';
		el.style.zIndex = '9999';
		el.style.display = 'none';
		el.style.background = 'transparent';

		this.gameEnv.container.appendChild(el);
		this._debugHitboxElement = el;
	}

	_removeDebugHitboxElement() {
		if (!this._debugHitboxElement) return;
		if (this._debugHitboxElement.parentNode) {
			this._debugHitboxElement.parentNode.removeChild(this._debugHitboxElement);
		}
		this._debugHitboxElement = null;
	}

	_updateDebugHitboxOverlay() {
		if (!this.debugHitbox) {
			this._removeDebugHitboxElement();
			return;
		}

		this._ensureDebugHitboxElement();
		if (!this._debugHitboxElement) return;

		const bounds = this.getWorldCollisionBounds();
		const diameter = Math.min(bounds.right - bounds.left, bounds.bottom - bounds.top)
			* (this.hitbox?.radiusPercentage ?? 0.5) * 2;
		const width = Math.max(0, diameter);
		const height = width;

		if (width < 1 || height < 1) {
			this._debugHitboxElement.style.display = 'none';
			return;
		}

		this._debugHitboxElement.style.display = 'block';
		this._debugHitboxElement.style.left = `${(bounds.left + bounds.right - width) / 2}px`;
		this._debugHitboxElement.style.top = `${(this.gameEnv?.top || 0) + (bounds.top + bounds.bottom - height) / 2}px`;
		this._debugHitboxElement.style.width = `${width}px`;
		this._debugHitboxElement.style.height = `${height}px`;
		this._debugHitboxElement.style.borderColor = this.debugHitboxColor;
	}

	onJump() {
		this._playJumpSound();
	}

	update() {
		super.update();
		this._updateDebugHitboxOverlay();
	}

	destroy() {
		this._removeDebugHitboxElement();
		if (this._jumpAudio) {
			try {
				this._jumpAudio.pause();
				this._jumpAudio.src = '';
			} catch (_) {}
			this._jumpAudio = null;
		}
		super.destroy();
	}
}

export default PlatformerPlayer;
