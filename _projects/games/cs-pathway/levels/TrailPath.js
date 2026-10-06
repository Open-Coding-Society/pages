// TrailPath — draws the "which station first, then next" route on the map.
//
// Reuses the same rendering path as GameEnvBackground (drawing straight onto
// the shared gameEnv.ctx each frame) instead of introducing a new canvas
// layer, per the level's existing "no new rendering system" approach. Placed
// in this.classes right after the background and before the player/NPCs, so
// it paints on the ground, underneath every sprite's own canvas.
//
// Draws two things per station, both status-driven via getStatus(stationId):
//   1. A connecting line to the next station in order (green = done,
//      pulsing blue/orange = current, dim dashed = not reached yet).
//   2. A numbered badge (1, 2, 3... or a star for the boss) floating above
//      each station, showing a checkmark once that station is complete.
//
// File location: @assets/js/projects/cs-pathway/levels/TrailPath.js

import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';
import { STATION_STATUS } from '@assets/js/projects/cs-pathway/model/stationStatus.js';

const BADGE_RADIUS = 17;
const BADGE_OFFSET_Y = 90; // px above each station's sprite center
const NAMEPLATE_OFFSET_Y = BADGE_OFFSET_Y + 34; // further above the numbered badge

const BADGE_COLORS = Object.freeze({
  [STATION_STATUS.LOCKED]: { bg: '#0b1026', border: '#475569', text: '#64748b' },
  [STATION_STATUS.ACTIVE]: { bg: '#0b1026', border: '#38bdf8', text: '#38bdf8' },
  [STATION_STATUS.STUCK]: { bg: '#0b1026', border: '#f59e0b', text: '#f59e0b' },
  [STATION_STATUS.COMPLETE]: { bg: '#052e1a', border: '#4ade80', text: '#4ade80' },
});

class TrailPath extends GameObject {
  constructor(data = {}, gameEnv = null) {
    super(gameEnv);
    this.data = data;
    this.stations = data.stations || []; // ordered: zone 1 -> N, boss last
    this.getStatus = typeof data.getStatus === 'function' ? data.getStatus : () => STATION_STATUS.LOCKED;
  }

  update() {
    this.draw();
  }

  draw() {
    if (!this.gameEnv?.ctx || this.stations.length === 0) return;
    const ctx = this.gameEnv.ctx;
    const t = performance.now();

    ctx.save();
    for (let i = 0; i < this.stations.length - 1; i++) {
      this._drawSegment(ctx, this.stations[i], this.stations[i + 1], t);
    }
    this.stations.forEach((station, index) => this._drawBadge(ctx, station, index, t));
    this.stations.forEach((station) => this._drawNameplate(ctx, station));
    ctx.restore();
  }

  /**
   * Prefer the live sprite's current position/size (so the badge/line track
   * the actual on-screen gatekeeper); fall back to the station's authored
   * position before that NPC has been created yet.
   */
  _centerOf(station) {
    const objects = this.gameEnv.gameObjects || [];
    const obj = objects.find((o) => o?.spriteData?.id === station.id || o?.data?.id === station.id);
    if (obj?.position && obj.width) {
      return { x: obj.position.x + obj.width / 2, y: obj.position.y + obj.height / 2 };
    }
    return { ...station.position };
  }

  _drawSegment(ctx, fromStation, toStation, t) {
    const from = this._centerOf(fromStation);
    const to = this._centerOf(toStation);
    const fromDone = this.getStatus(fromStation.id) === STATION_STATUS.COMPLETE;
    const toStatus = this.getStatus(toStation.id);

    let color = 'rgba(148,163,184,0.35)';
    let dash = [4, 10];
    let lineWidth = 2;
    let glow = 0;
    let dashOffset = 0;

    if (fromDone && toStatus === STATION_STATUS.COMPLETE) {
      color = '#4ade80';
      dash = [];
      lineWidth = 4;
      glow = 6;
    } else if (fromDone && (toStatus === STATION_STATUS.ACTIVE || toStatus === STATION_STATUS.STUCK)) {
      color = toStatus === STATION_STATUS.STUCK ? '#f59e0b' : '#38bdf8';
      dash = [10, 8];
      lineWidth = 4;
      glow = 12;
      // Flowing-energy effect toward the active/stuck station.
      dashOffset = -((t / 40) % (dash[0] + dash[1]));
    }

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.setLineDash(dash);
    ctx.lineDashOffset = dashOffset;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
  }

  _drawBadge(ctx, station, index, t) {
    const center = this._centerOf(station);
    const badgeCenter = { x: center.x, y: center.y - BADGE_OFFSET_Y };
    const status = this.getStatus(station.id);
    const colors = BADGE_COLORS[status] || BADGE_COLORS[STATION_STATUS.LOCKED];

    ctx.beginPath();
    ctx.arc(badgeCenter.x, badgeCenter.y, BADGE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = colors.bg;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = colors.border;
    if (status === STATION_STATUS.ACTIVE) {
      // Gentle pulse so the "do this one next" badge stands out.
      ctx.shadowColor = colors.border;
      ctx.shadowBlur = 10 + Math.sin(t / 220) * 6;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = colors.text;
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = status === STATION_STATUS.COMPLETE ? '✓' : (station.isBoss ? '★' : String(index + 1));
    ctx.fillText(label, badgeCenter.x, badgeCenter.y + 1);
  }

  /**
   * Per-station identity plate — separate signal from the status-colored
   * badge above: always the same icon/color for a given station regardless
   * of lock state (dimmed when locked), so each station is recognizable at
   * a glance while real per-station building art is still pending.
   */
  _drawNameplate(ctx, station) {
    if (!station.icon && !station.accentColor) return;
    const center = this._centerOf(station);
    const color = station.accentColor || '#94a3b8';
    const status = this.getStatus(station.id);
    const alpha = status === STATION_STATUS.LOCKED ? 0.35 : 1;

    const label = `${station.icon || ''} ${station.name}`.trim();
    ctx.font = 'bold 11px "Courier New", monospace';
    const textWidth = ctx.measureText(label).width;
    const paddingX = 10;
    const plateWidth = textWidth + paddingX * 2;
    const plateHeight = 22;

    // Clamp so stations near a map edge (e.g. a station placed high up, or
    // near the right edge like the boss) don't have their nameplate drawn
    // partly or fully outside the canvas.
    const canvasWidth = this.gameEnv?.innerWidth ?? ctx.canvas?.width ?? Infinity;
    const margin = 6;
    const plateCenter = {
      x: Math.min(
        Math.max(center.x, plateWidth / 2 + margin),
        Math.max(canvasWidth - plateWidth / 2 - margin, plateWidth / 2 + margin),
      ),
      y: Math.max(center.y - NAMEPLATE_OFFSET_Y, plateHeight / 2 + margin),
    };

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    const x = plateCenter.x - plateWidth / 2;
    const y = plateCenter.y - plateHeight / 2;
    const radius = plateHeight / 2;
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + plateWidth, y, x + plateWidth, y + plateHeight, radius);
    ctx.arcTo(x + plateWidth, y + plateHeight, x, y + plateHeight, radius);
    ctx.arcTo(x, y + plateHeight, x, y, radius);
    ctx.arcTo(x, y, x + plateWidth, y, radius);
    ctx.closePath();
    ctx.fillStyle = 'rgba(4,6,15,0.75)';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, plateCenter.x, plateCenter.y + 1);
    ctx.restore();
  }

  resize() {
    // Positions are recomputed live from gameObjects each draw; nothing to cache.
  }

  destroy() {
    const index = this.gameEnv.gameObjects.indexOf(this);
    if (index !== -1) this.gameEnv.gameObjects.splice(index, 1);
  }
}

export default TrailPath;
