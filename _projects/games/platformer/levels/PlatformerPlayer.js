import PlayerPlatformer from '@assets/js/GameEnginev1.1/essentials/PlayerPlatformer.js';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';

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

		const bounds = this._getPlayerWorldCollisionBounds();
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

	_getPlayerCollisionInsets() {
		return {
			left: this.width * (this.hitbox?.widthPercentage || 0) / 2,
			right: this.width * (this.hitbox?.widthPercentage || 0) / 2,
			top: this.height * (this.hitbox?.heightPercentage || 0) / 2,
			bottom: this.height * (this.hitbox?.heightPercentage || 0) / 2,
		};
	}

	_getPlayerWorldCollisionBounds() {
		const insets = this._getPlayerCollisionInsets();
		return {
			left: this.position.x + insets.left,
			right: this.position.x + this.width - insets.right,
			top: this.position.y + insets.top,
			bottom: this.position.y + this.height - insets.bottom,
		};
	}

	onJump() {
		this._playJumpSound();
	}

	update() {
		super.update();
		this._updateDebugHitboxOverlay();
	}

	_resolveOtherObject() {
		const otherId = this.collisionData?.touchPoints?.other?.id;
		if (!otherId || !this.gameEnv?.gameObjects) return null;
		return this.gameEnv.gameObjects.find((obj) => obj?.canvas?.id === otherId) || null;
	}

	handleCollisionState() {
		const touchPoints = this.collisionData?.touchPoints?.this;
		const otherObject = this._resolveOtherObject();
		const bounds = this._getPlayerWorldCollisionBounds();
		const radius = Math.min(bounds.right - bounds.left, bounds.bottom - bounds.top)
			* (this.hitbox?.radiusPercentage ?? 0.5);

		if (!touchPoints) {
			return;
		}

		if (!(otherObject instanceof Barrier)) {
			super.handleCollisionState();
			return;
		}

		// Resolve one contact face; overlapping top/side extents must not cancel a jump.
		if (touchPoints.top) {
			if (this.verticalVelocity <= 0) {
				this.position.y = otherObject.y - this.height / 2 - radius;
				this.land();
			}
		} else if (touchPoints.bottom && this.verticalVelocity > 0) {
			this.position.y = otherObject.y + otherObject.height - this.height / 2 + radius;
			this.hitCeiling();
		} else if (touchPoints.left) {
			this.velocity.x = 0;
			this.position.x = otherObject.x - this.width / 2 - radius;
		} else if (touchPoints.right) {
			this.velocity.x = 0;
			this.position.x = otherObject.x + otherObject.width - this.width / 2 + radius;
		}
		this.setupCanvas();
	}

	handleCollisionReaction(other) {
		const otherObject = this._resolveOtherObject();
		if (otherObject instanceof Barrier) {
			return;
		}
		super.handleCollisionReaction(other);
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
