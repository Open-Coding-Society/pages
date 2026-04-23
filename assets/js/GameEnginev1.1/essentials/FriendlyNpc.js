import Npc from "./Npc.js";

class FriendlyNpc extends Npc {
    constructor(data = {}, gameEnv = null) {
        super(data, gameEnv);
        this.clickOnly = data.clickOnly !== undefined ? data.clickOnly : false;
        this.clicks = 0;

        // ── Zone distances ───────────────────────────────────────────────────
        // alertDistance: how far away the NPC "notices" the player and stands up.
        //   Derived from alertDistance multiplier on spriteData (default 1.25×)
        //   applied to the NPC's rendered width once available, OR falls back to
        //   the raw pixel value passed in data.interactDistance.
        //   We resolve the pixel value lazily in update() once this.width is set.
        this._alertDistanceMultiplier = data.alertDistance || 1.25;
        this._alertDistancePx = null; // resolved lazily

        // interactDistance: the E-key / collision zone. Kept for compatibility
        // but with hitbox 0.0 on the NPC and 0.2 on the player the engine's own
        // collision events are the authoritative source for E-key eligibility.
        this.interactDistance = data.interactDistance || 120;

        // ── Per-approach state ───────────────────────────────────────────────
        this._inAlertZone   = false; // true while player is within alert radius
        this._inCollision   = false; // true while engine collision event is active
    }

    // ── Lazy alert-distance resolver ─────────────────────────────────────────
    // We can't read this.width reliably in the constructor because the sprite
    // hasn't loaded yet.  Call this once per update; it memoises after first hit.
    _resolveAlertDistance() {
        if (this._alertDistancePx !== null) return this._alertDistancePx;
        const w = this.width || 0;
        if (w > 0) {
            this._alertDistancePx = w * this._alertDistanceMultiplier;
        }
        // Return best-effort fallback until width is known
        return this._alertDistancePx ?? this.interactDistance * 1.5;
    }

    update() {
        super.update(); // handles patrol, draw, base key listeners

        const player = this.gameEnv?.gameObjects?.find(
            obj => obj.constructor.name === "Player"
        );
        if (!player) return;

        // ── Distance to player (centre-to-centre) ────────────────────────────
        const npcCx   = this.position.x + (this.width  || 0) / 2;
        const npcCy   = this.position.y + (this.height || 0) / 2;
        const plrCx   = player.position.x + (player.width  || 0) / 2;
        const plrCy   = player.position.y + (player.height || 0) / 2;
        const distance = Math.sqrt((plrCx - npcCx) ** 2 + (plrCy - npcCy) ** 2);

        const alertDist = this._resolveAlertDistance();

        // ── Check engine collision events (authoritative for E-key) ──────────
        const engineCollision = !!(
            player?.state?.collisionEvents?.includes(this.spriteData?.id)
        );

        // Don't trigger alert zone until the NPC sprite is loaded (width > 0).
        // On frame 1 width is 0 and alertDist falls back to interactDistance*1.5
        // (~180 px), which can encompass the player spawn position and fire
        // reaction() before the player has moved — the phantom collision.
        const spriteReady = (this.width || 0) > 0;
        const nowInAlert = spriteReady && distance < alertDist;

        if (nowInAlert && !this._inAlertZone) {
            // ── Entered alert zone ───────────────────────────────────────────
            this._inAlertZone = true;

            // Switch NPC to standing/alert animation row
            this.direction = 'up';

            // Always show the "Press E" toast — unconditionally, every entry
            if (!this.clickOnly) {
                const toast = this.gameEnv?.currentLevel?.showToast
                           ?? this.gameEnv?.gameLevel?.showToast;
                if (toast) {
                    toast.call(
                        this.gameEnv.currentLevel ?? this.gameEnv.gameLevel,
                        "Press E to interact"
                    );
                }
            }

            // Fire reaction so level can run its own once/always logic
            if (!this.clickOnly && typeof this.reaction === 'function') {
                this.reaction();
            }
        }

        if (!nowInAlert && this._inAlertZone) {
            // ── Left alert zone ──────────────────────────────────────────────
            this._inAlertZone = false;

            // Return NPC to idle/sitting animation row
            this.direction = 'down';
        }

        // ════════════════════════════════════════════════════════════════════
        // COLLISION ZONE  (engine collision event active)
        //   • E-key interaction is already handled by Npc.handleKeyInteract()
        //     which checks collisionEvents.  Nothing extra needed here except
        //     tracking state for future use (e.g. highlight border).
        // ════════════════════════════════════════════════════════════════════
        if (engineCollision !== this._inCollision) {
            this._inCollision = engineCollision;
            // Future hook: visual highlight on collision entry/exit
        }
    }

    handleClick(event) {
        if (typeof this.interact !== 'function') return;

        this.clicks += 1;
        this.interact(this.clicks, this.spriteData?.id || this.uniqueId || 'unknown', this, event);
    }

    handleKeyInteract() {
        if (this.clickOnly) return;
        super.handleKeyInteract();
    }
}

export default FriendlyNpc;