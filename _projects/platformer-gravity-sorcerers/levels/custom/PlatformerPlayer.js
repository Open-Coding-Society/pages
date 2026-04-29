import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';

class PlatformerPlayer extends Player {
	constructor(data = null, gameEnv = null) {
		super(data, gameEnv);

		this.verticalVelocity = 0;
		this.gravityAcceleration = data?.gravityAcceleration ?? 0.4;
		this.jumpVelocity = data?.jumpVelocity ?? Math.max(8, this.yVelocity * 1.5);

		this.isGrounded = false;
		this._groundedThisFrame = false;
		this._skipGravityThisFrame = false;
		this._jumpPressedLatch = false;
		this.clearPressedKeysOnCollision = false;
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
		const width = Math.max(0, bounds.right - bounds.left);
		const height = Math.max(0, bounds.bottom - bounds.top);

		if (width < 1 || height < 1) {
			this._debugHitboxElement.style.display = 'none';
			return;
		}

		this._debugHitboxElement.style.display = 'block';
		this._debugHitboxElement.style.left = `${bounds.left}px`;
		this._debugHitboxElement.style.top = `${(this.gameEnv?.top || 0) + bounds.top}px`;
		this._debugHitboxElement.style.width = `${width}px`;
		this._debugHitboxElement.style.height = `${height}px`;
		this._debugHitboxElement.style.borderColor = this.debugHitboxColor;
	}

	_clampPercent(value) {
		return Math.min(0.49, Math.max(0, Number(value) || 0));
	}

	_getHitboxPercents() {
		return {
			width: this._clampPercent(this.hitbox?.widthPercentage),
			height: this._clampPercent(this.hitbox?.heightPercentage),
		};
	}

	_getPlayerCollisionInsets() {
		const percents = this._getHitboxPercents();
		return {
			left: this.width * percents.width,
			right: this.width * percents.width,
			top: this.height * percents.height,
			bottom: this.height * percents.height,
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

	_getOtherCollisionRect(other) {
		const otherRect = other.canvas.getBoundingClientRect();
		const otherWidthReduction = otherRect.width * (other.hitbox?.widthPercentage || 0.0);
		const otherHeightReduction = otherRect.height * (other.hitbox?.heightPercentage || 0.0);

		return {
			left: otherRect.left + otherWidthReduction,
			top: otherRect.top + otherHeightReduction,
			right: otherRect.right - otherWidthReduction,
			bottom: otherRect.bottom,
		};
	}

	// Override default collision so player hitbox trims all sides, including bottom.
	isCollision(other) {
		const thisRect = this.canvas.getBoundingClientRect();
		const insets = this._getHitboxPercents();
		const thisWidthReduction = thisRect.width * insets.width;
		const thisHeightReduction = thisRect.height * insets.height;

		const thisCollisionRect = {
			left: thisRect.left + thisWidthReduction,
			top: thisRect.top + thisHeightReduction,
			right: thisRect.right - thisWidthReduction,
			bottom: thisRect.bottom - thisHeightReduction,
		};

		const otherCollisionRect = this._getOtherCollisionRect(other);

		const hit = (
			thisCollisionRect.left < otherCollisionRect.right &&
			thisCollisionRect.right > otherCollisionRect.left &&
			thisCollisionRect.top < otherCollisionRect.bottom &&
			thisCollisionRect.bottom > otherCollisionRect.top
		);

		const touchPoints = {
			this: {
				id: this.canvas.id,
				greet: this.spriteData?.greeting || 'Hello',
				top: thisCollisionRect.bottom > otherCollisionRect.top && thisCollisionRect.top < otherCollisionRect.top,
				bottom: thisCollisionRect.top < otherCollisionRect.bottom && thisCollisionRect.bottom > otherCollisionRect.bottom,
				left: thisCollisionRect.right > otherCollisionRect.left && thisCollisionRect.left < otherCollisionRect.left,
				right: thisCollisionRect.left < otherCollisionRect.right && thisCollisionRect.right > otherCollisionRect.right,
			},
			other: {
				id: other.canvas.id,
				greet: other.spriteData?.greeting || 'Hello',
				reaction: other.spriteData?.reaction || null,
				top: otherCollisionRect.bottom > thisCollisionRect.top && otherCollisionRect.top < thisCollisionRect.top,
				bottom: otherCollisionRect.top < thisCollisionRect.bottom && otherCollisionRect.bottom > thisCollisionRect.bottom,
				left: otherCollisionRect.right > thisCollisionRect.left && otherCollisionRect.left < thisCollisionRect.left,
				right: otherCollisionRect.left < thisCollisionRect.right && otherCollisionRect.right > thisCollisionRect.right,
			},
		};

		this.collisionData = { hit, touchPoints };
	}

	_hasBarrierSupport() {
		if (!this.gameEnv?.gameObjects) return false;

		const supportTolerance = 4;
		const playerBounds = this._getPlayerWorldCollisionBounds();

		return this.gameEnv.gameObjects.some((obj) => {
			if (!(obj instanceof Barrier)) return false;

			const barrierLeft = obj.x;
			const barrierRight = obj.x + obj.width;
			const barrierTop = obj.y;

			const horizontallyOverlapping = playerBounds.right > barrierLeft && playerBounds.left < barrierRight;
			const standingOnTop = Math.abs(playerBounds.bottom - barrierTop) <= supportTolerance;

			return horizontallyOverlapping && standingOnTop;
		});
	}

	updateVelocity() {
		this.velocity.x = 0;
		this.moved = false;

		if (this.pressedKeys[this.keypress.right]) {
			this.velocity.x = this.xVelocity;
			this.moved = true;
		} else if (this.pressedKeys[this.keypress.left]) {
			this.velocity.x = -this.xVelocity;
			this.moved = true;
		}

		const upPressed = Boolean(this.pressedKeys[this.keypress.up]);
		if (upPressed && (this.isGrounded || this._hasBarrierSupport()) && !this._jumpPressedLatch) {
			this.verticalVelocity = this.jumpVelocity;
			this._playJumpSound();
			this.isGrounded = false;
			this._groundedThisFrame = false;
			this._skipGravityThisFrame = false;
			this._jumpPressedLatch = true;
			this.moved = true;
		}

		if (!upPressed) {
			this._jumpPressedLatch = false;
		}
	}

	updateDirection() {
		if (this.pressedKeys[this.keypress.right]) {
			this.direction = 'right';
		} else if (this.pressedKeys[this.keypress.left]) {
			this.direction = 'left';
		}
	}

	update() {
		this.updateVelocity();
		this.updateDirection();

		if (!this._skipGravityThisFrame) {
			this.verticalVelocity -= this.gravityAcceleration;
		}

		this._groundedThisFrame = false;
		this._skipGravityThisFrame = false;

		// positive verticalVelocity means upward movement in world coordinates
		this.velocity.y = -this.verticalVelocity;

		super.move();
		super.draw();
		super.collisionChecks();
		this.setupCanvas();
		this._updateDebugHitboxOverlay();

		this.isGrounded = this._groundedThisFrame;
		this.velocity.y = -this.verticalVelocity;
	}

	_resolveOtherObject() {
		const otherId = this.collisionData?.touchPoints?.other?.id;
		if (!otherId || !this.gameEnv?.gameObjects) return null;
		return this.gameEnv.gameObjects.find((obj) => obj?.canvas?.id === otherId) || null;
	}

	handleCollisionState() {
		const touchPoints = this.collisionData?.touchPoints?.this;
		const otherObject = this._resolveOtherObject();
		const insets = this._getPlayerCollisionInsets();

		if (!touchPoints) {
			return;
		}

		if (!(otherObject instanceof Barrier)) {
			super.handleCollisionState();
			return;
		}

		if (touchPoints.left || touchPoints.right) {
			this.velocity.x = 0;
		}

		// Standing on the top of a barrier: stop falling and skip gravity for this frame.
		// Do not apply this while moving upward, or the jump gets canceled on the takeoff frame.
		if (touchPoints.top && this.verticalVelocity <= 0) {
			this.position.y = otherObject.y - (this.height - insets.bottom);
			this.verticalVelocity = 0;
			this.velocity.y = 0;
			this.isGrounded = true;
			this._groundedThisFrame = true;
			this._skipGravityThisFrame = true;
		}

		// Hitting the underside of a barrier while jumping: stop upward motion.
		if (touchPoints.bottom) {
			this.position.y = otherObject.y + otherObject.height - insets.top;
			this.verticalVelocity = 0;
			this.velocity.y = 0;
			
		}

		if (touchPoints.left) {
			this.position.x = otherObject.x - (this.width - insets.right);
		}

		if (touchPoints.right) {
			this.position.x = otherObject.x + otherObject.width - insets.left;
		}
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


