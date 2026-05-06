// level2.js - Red Riding Hood Level 2: The Chase
import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Character from '/assets/js/GameEnginev1.1/essentials/Character.js';
class SplineBarrier {
  constructor(leftPoints, rightPoints, gameEnv) {
      this.leftControlPoints = leftPoints;
      this.rightControlPoints = rightPoints;
      this.gameEnv = gameEnv;
      this.ctx = gameEnv.ctx;
      
      const leftSamples = this.sampleSpline(this.leftControlPoints, 1000);
      const rightSamples = this.sampleSpline(this.rightControlPoints, 1000);
      
      // Connect left and right samples to create a closed polygon loop representing the walkable area
      this.polygon = [...leftSamples, ...rightSamples.reverse()];
  }

  getCatmullRomPoint(t, p0, p1, p2, p3) {
      const t2 = t * t;
      const t3 = t2 * t;
      const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      return { x, y };
  }

  getSplinePoint(t, controlPoints) {
      const p = controlPoints;
      const numSegments = p.length - 1;
      if (t >= numSegments) t = numSegments - 0.001;
      if (t < 0) t = 0;
      const segment = Math.floor(t);
      const localT = t - segment;
      const p0 = p[Math.max(segment - 1, 0)];
      const p1 = p[segment];
      const p2 = p[Math.min(segment + 1, p.length - 1)];
      const p3 = p[Math.min(segment + 2, p.length - 1)];
      return this.getCatmullRomPoint(localT, p0, p1, p2, p3);
  }

  sampleSpline(controlPoints, numSamples) {
      const samples = [];
      const maxT = controlPoints.length - 1;
      for (let i = 0; i <= numSamples; i++) {
          samples.push(this.getSplinePoint((i / numSamples) * maxT, controlPoints));
      }
      return samples;
  }

  checkOutOfBounds(player) {
      if (!player || !player.position) return false;
      
      // Check against the player's feet
      const px = player.position.x + player.width / 2;
      const py = player.position.y + player.height * 0.8;

      // Ray casting algorithm to check if feet are perfectly inside the custom polygon area
      let inside = false;
      const vs = this.polygon;
      for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
          const xi = vs[i].x, yi = vs[i].y;
          const xj = vs[j].x, yj = vs[j].y;
          const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
      }

      // Block player if they stray outside the polygon boundaries
      return !inside;
  }

  draw(debug = false) {
      if (debug && this.polygon.length > 0) {
          // Fill the valid walkable custom area with transparent green so you can see it exactly
          this.ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
          this.ctx.beginPath();
          this.ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
          for (let i = 1; i < this.polygon.length; i++) {
              this.ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
          }
          this.ctx.closePath();
          this.ctx.fill();
      }
  }
}

class Wolf extends Character {
  constructor(data, gameEnv) {
    super(data, gameEnv);
    this.velocity = { x: 0, y: 0 };
    this.speed = data.SPEED || 2;
    this.controlPoints = data.pathPoints || null;
    this.pathT = 0;
  }

  buildControlPoints() {
    const width = this.gameEnv.innerWidth;
    const height = this.gameEnv.innerHeight;
    return [
      { x: width * 0.554, y: height * 0.307 },
      { x: width * 0.561, y: height * 0.355 },
      { x: width * 0.557, y: height * 0.394 },
      { x: width * 0.565, y: height * 0.404 },
      { x: width * 0.554, y: height * 0.453 },
      { x: width * 0.536, y: height * 0.509 },
      { x: width * 0.527, y: height * 0.581 },
      { x: width * 0.532, y: height * 0.637 },
      { x: width * 0.531, y: height * 0.654 },
      { x: width * 0.545, y: height * 0.694 },
      { x: width * 0.582, y: height * 0.740 },
      { x: width * 0.645, y: height * 0.779 },
      { x: width * 0.731, y: height * 0.788 },
      { x: width * 0.776, y: height * 0.764 },
      { x: width * 0.812, y: height * 0.721 },
      { x: width * 0.829, y: height * 0.681 },
      { x: width * 0.856, y: height * 0.627 },
      { x: width * 0.859, y: height * 0.576 },
      { x: width * 0.846, y: height * 0.547 },
      { x: width * 0.826, y: height * 0.507 },
      { x: width * 0.794, y: height * 0.473 },
      { x: width * 0.775, y: height * 0.445 },
      { x: width * 0.760, y: height * 0.427 },
      { x: width * 0.760, y: height * 0.398 },
      { x: width * 0.764, y: height * 0.374 },
      { x: width * 0.786, y: height * 0.345 },
      { x: width * 0.811, y: height * 0.321 },
      { x: width * 0.835, y: height * 0.281 },
      { x: width * 0.848, y: height * 0.252 },
      { x: width * 0.852, y: height * 0.246 }
    ];
  }

  getCatmullRomPoint(t, p0, p1, p2, p3) {
    const t2 = t * t;
    const t3 = t2 * t;

    const x = 0.5 * (
      (2 * p1.x) +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    );

    const y = 0.5 * (
      (2 * p1.y) +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    );

    return { x, y };
  }

  getSplinePoint(t) {
    const p = this.controlPoints;
    const numSegments = p.length - 1;

    if (t >= numSegments) t = numSegments - 0.001;
    if (t < 0) t = 0;

    const segment = Math.floor(t);
    const localT = t - segment;

    // Clamped control points for smooth transition near the ends
    const p0 = p[Math.max(segment - 1, 0)];
    const p1 = p[segment];
    const p2 = p[Math.min(segment + 1, p.length - 1)];
    const p3 = p[Math.min(segment + 2, p.length - 1)];

    return this.getCatmullRomPoint(localT, p0, p1, p2, p3);
  }

  update() {
    if (!this.controlPoints) {
      this.controlPoints = this.buildControlPoints();
      this.position.x = this.controlPoints[0].x;
      this.position.y = this.controlPoints[0].y;
      this.pathT = 0;
    }

    const segment = Math.min(Math.floor(this.pathT), this.controlPoints.length - 2);
    if (segment >= 0) {
      const p1 = this.controlPoints[segment];
      const p2 = this.controlPoints[segment + 1];
      const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      
      this.pathT += dist > 0 ? (this.speed / dist) : 0.01;
    }

    if (this.pathT >= this.controlPoints.length - 1) {
      this.pathT = 0;
    }

    const newPos = this.getSplinePoint(this.pathT);

    this.velocity.x = newPos.x - this.position.x;
    this.velocity.y = newPos.y - this.position.y;

    this.position.x = newPos.x;
    this.position.y = newPos.y;

    this.draw();
  }
}

class GameLevelRedRidingHood2 {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    this.continue = true;
    this.debugMode = false; // Set to true to see the green path and enable click logging
    this.wonGame = false;

    this.titleElement = document.createElement('div');
    this.titleElement.style.position = 'absolute';
    this.titleElement.style.top = '60px';
    this.titleElement.style.width = '100%';
    this.titleElement.style.textAlign = 'center';
    this.titleElement.style.color = 'red';
    this.titleElement.style.fontSize = '40px';
    this.titleElement.style.fontWeight = '900';
    this.titleElement.style.fontFamily = '"Courier New", Courier, monospace';
    this.titleElement.style.textShadow = '2px 2px 4px black, 0 0 10px #ff0000';
    this.titleElement.style.zIndex = '9999';
    this.titleElement.innerHTML = "LEVEL 2: THE CHASE";
    document.body.appendChild(this.titleElement);

    this.cottageZone = {
      x: width * 0.82,
      y: 0,
      width: width * 0.15,
      height: height * 0.25
    };

    this.winPopup = document.createElement('div');
    this.winPopup.style.display = 'none';
    this.winPopup.style.position = 'absolute';
    this.winPopup.style.top = '50%';
    this.winPopup.style.left = '50%';
    this.winPopup.style.transform = 'translate(-50%, -50%)';
    this.winPopup.style.background = 'linear-gradient(135deg, #2d0a0a, #6b1a1a)';
    this.winPopup.style.border = '4px solid #ff4444';
    this.winPopup.style.borderRadius = '20px';
    this.winPopup.style.padding = '40px 50px';
    this.winPopup.style.textAlign = 'center';
    this.winPopup.style.zIndex = '99999';
    this.winPopup.style.boxShadow = '0 0 40px rgba(255,0,0,0.6), 0 0 80px rgba(255,0,0,0.3)';
    this.winPopup.style.maxWidth = '500px';
    this.winPopup.innerHTML = `
      <div style="font-size: 60px; margin-bottom: 10px;">🐺😶</div>
      <div style="color: #ff6666; font-size: 32px; font-weight: 900; font-family: 'Courier New', monospace; text-shadow: 0 0 10px #ff0000; margin-bottom: 15px;">
        CHAPTER CLOSED.
      </div>
      <div style="color: #ffcccc; font-size: 17px; font-family: 'Courier New', monospace; line-height: 1.8; margin-bottom: 25px;">
        Red Riding Hood ran away.<br>
        The wolf tried.<br>
        <span style="color:#ff4444;">Red knew the fairytale better.</span>
      </div>
      <button id="winContinueBtn" style="
        background: #ff2222;
        color: white;
        border: none;
        padding: 12px 30px;
        font-size: 18px;
        font-weight: 900;
        font-family: 'Courier New', monospace;
        border-radius: 10px;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 2px;
        box-shadow: 0 0 15px rgba(255,0,0,0.5);
      ">Close ✕</button>
    `;
    document.body.appendChild(this.winPopup);

    // Helper to log exact coordinates when you click the screen!
    if (this.debugMode) {
      window.addEventListener('mousedown', (e) => {
        // Calculate percentage based on screen click
        const xRatio = (e.clientX / window.innerWidth).toFixed(3);
        const yRatio = (e.clientY / window.innerHeight).toFixed(3);
        console.log(`{ x: width * ${xRatio}, y: height * ${yRatio} },`);
      });
    }

    const leftPoints = [
      { x: width * 0.152, y: height * 0.910 },
      { x: width * 0.158, y: height * 0.899 },
      { x: width * 0.171, y: height * 0.885 },
      { x: width * 0.180, y: height * 0.866 },
      { x: width * 0.195, y: height * 0.833 },
      { x: width * 0.208, y: height * 0.801 },
      { x: width * 0.216, y: height * 0.780 },
      { x: width * 0.231, y: height * 0.768 },
      { x: width * 0.257, y: height * 0.768 },
      { x: width * 0.275, y: height * 0.769 },
      { x: width * 0.308, y: height * 0.768 },
      { x: width * 0.348, y: height * 0.763 },
      { x: width * 0.366, y: height * 0.763 },
      { x: width * 0.381, y: height * 0.753 },
      { x: width * 0.399, y: height * 0.737 },
      { x: width * 0.407, y: height * 0.722 },
      { x: width * 0.423, y: height * 0.694 },
      { x: width * 0.435, y: height * 0.657 },
      { x: width * 0.447, y: height * 0.604 },
      { x: width * 0.452, y: height * 0.556 },
      { x: width * 0.452, y: height * 0.518 },
      { x: width * 0.461, y: height * 0.500 },
      { x: width * 0.457, y: height * 0.467 },
      { x: width * 0.450, y: height * 0.428 },
      { x: width * 0.428, y: height * 0.396 },
      { x: width * 0.411, y: height * 0.381 },
      { x: width * 0.388, y: height * 0.355 },
      { x: width * 0.388, y: height * 0.328 },
      { x: width * 0.390, y: height * 0.295 },
      { x: width * 0.406, y: height * 0.268 },
      { x: width * 0.440, y: height * 0.246 },
      { x: width * 0.467, y: height * 0.239 },
      { x: width * 0.490, y: height * 0.241 },
      { x: width * 0.504, y: height * 0.261 },
      { x: width * 0.509, y: height * 0.269 },
      { x: width * 0.518, y: height * 0.288 },
      { x: width * 0.534, y: height * 0.317 },
      { x: width * 0.540, y: height * 0.340 },
      { x: width * 0.545, y: height * 0.367 },
      { x: width * 0.545, y: height * 0.404 },
      { x: width * 0.535, y: height * 0.433 },
      { x: width * 0.523, y: height * 0.482 },
      { x: width * 0.511, y: height * 0.528 },
      { x: width * 0.507, y: height * 0.567 },
      { x: width * 0.501, y: height * 0.605 },
      { x: width * 0.504, y: height * 0.657 },
      { x: width * 0.515, y: height * 0.697 },
      { x: width * 0.516, y: height * 0.710 },
      { x: width * 0.529, y: height * 0.729 },
      { x: width * 0.554, y: height * 0.759 },
      { x: width * 0.581, y: height * 0.774 },
      { x: width * 0.617, y: height * 0.788 },
      { x: width * 0.638, y: height * 0.798 },
      { x: width * 0.709, y: height * 0.811 },
      { x: width * 0.747, y: height * 0.798 },
      { x: width * 0.791, y: height * 0.774 },
      { x: width * 0.834, y: height * 0.736 },
      { x: width * 0.856, y: height * 0.684 },
      { x: width * 0.871, y: height * 0.626 },
      { x: width * 0.878, y: height * 0.567 },
      { x: width * 0.860, y: height * 0.506 },
      { x: width * 0.825, y: height * 0.465 },
      { x: width * 0.792, y: height * 0.432 },
      { x: width * 0.785, y: height * 0.393 },
      { x: width * 0.804, y: height * 0.359 },
      { x: width * 0.836, y: height * 0.322 },
      { x: width * 0.845, y: height * 0.301 },
      { x: width * 0.833, y: height * 0.249 }
    ];

    const rightPoints = [
      { x: width * 0.085, y: height * 0.769 },
      { x: width * 0.123, y: height * 0.741 },
      { x: width * 0.145, y: height * 0.711 },
      { x: width * 0.218, y: height * 0.677 },
      { x: width * 0.264, y: height * 0.669 },
      { x: width * 0.289, y: height * 0.667 },
      { x: width * 0.327, y: height * 0.667 },
      { x: width * 0.365, y: height * 0.641 },
      { x: width * 0.383, y: height * 0.615 },
      { x: width * 0.383, y: height * 0.582 },
      { x: width * 0.382, y: height * 0.558 },
      { x: width * 0.382, y: height * 0.519 },
      { x: width * 0.376, y: height * 0.494 },
      { x: width * 0.356, y: height * 0.448 },
      { x: width * 0.335, y: height * 0.403 },
      { x: width * 0.326, y: height * 0.351 },
      { x: width * 0.304, y: height * 0.348 },
      { x: width * 0.268, y: height * 0.348 },
      { x: width * 0.205, y: height * 0.347 },
      { x: width * 0.182, y: height * 0.332 },
      { x: width * 0.149, y: height * 0.317 },
      { x: width * 0.179, y: height * 0.326 },
      { x: width * 0.143, y: height * 0.293 },
      { x: width * 0.093, y: height * 0.250 },
      { x: width * 0.090, y: height * 0.201 },
      { x: width * 0.126, y: height * 0.198 },
      { x: width * 0.162, y: height * 0.215 },
      { x: width * 0.189, y: height * 0.246 },
      { x: width * 0.201, y: height * 0.288 },
      { x: width * 0.240, y: height * 0.313 },
      { x: width * 0.273, y: height * 0.314 },
      { x: width * 0.321, y: height * 0.307 },
      { x: width * 0.340, y: height * 0.285 },
      { x: width * 0.355, y: height * 0.241 },
      { x: width * 0.381, y: height * 0.212 },
      { x: width * 0.410, y: height * 0.191 },
      { x: width * 0.445, y: height * 0.179 },
      { x: width * 0.469, y: height * 0.184 },
      { x: width * 0.502, y: height * 0.188 },
      { x: width * 0.526, y: height * 0.208 },
      { x: width * 0.557, y: height * 0.249 },
      { x: width * 0.572, y: height * 0.277 },
      { x: width * 0.588, y: height * 0.324 },
      { x: width * 0.595, y: height * 0.378 },
      { x: width * 0.593, y: height * 0.426 },
      { x: width * 0.577, y: height * 0.473 },
      { x: width * 0.556, y: height * 0.525 },
      { x: width * 0.549, y: height * 0.561 },
      { x: width * 0.544, y: height * 0.597 },
      { x: width * 0.545, y: height * 0.629 },
      { x: width * 0.556, y: height * 0.665 },
      { x: width * 0.573, y: height * 0.696 },
      { x: width * 0.598, y: height * 0.726 },
      { x: width * 0.640, y: height * 0.735 },
      { x: width * 0.685, y: height * 0.745 },
      { x: width * 0.746, y: height * 0.731 },
      { x: width * 0.778, y: height * 0.703 },
      { x: width * 0.798, y: height * 0.687 },
      { x: width * 0.811, y: height * 0.670 },
      { x: width * 0.818, y: height * 0.652 },
      { x: width * 0.817, y: height * 0.615 },
      { x: width * 0.817, y: height * 0.585 },
      { x: width * 0.809, y: height * 0.529 },
      { x: width * 0.776, y: height * 0.492 },
      { x: width * 0.760, y: height * 0.457 },
      { x: width * 0.742, y: height * 0.423 },
      { x: width * 0.740, y: height * 0.389 },
      { x: width * 0.750, y: height * 0.357 },
      { x: width * 0.771, y: height * 0.331 },
      { x: width * 0.811, y: height * 0.284 }
    ];

    this.splineBarrier = new SplineBarrier(leftPoints, rightPoints, gameEnv);

    // Calculate a perfectly centered path for the Wolf and player spawn
    const centerPoints = [];
    const numCenterPoints = 50;
    for (let i = 0; i <= numCenterPoints; i++) {
        const tLeft = (i / numCenterPoints) * (leftPoints.length - 1);
        const tRight = (i / numCenterPoints) * (rightPoints.length - 1);
        const ptLeft = this.splineBarrier.getSplinePoint(tLeft, leftPoints);
        const ptRight = this.splineBarrier.getSplinePoint(tRight, rightPoints);
        centerPoints.push({
            x: (ptLeft.x + ptRight.x) / 2,
            y: (ptLeft.y + ptRight.y) / 2
        });
    }

    // Dynamically align spawn point slightly down the path so she isn't trapped on the starting edge!
    this.redStartPosition = { x: centerPoints[3].x - 45, y: centerPoints[3].y - 100 };

    const image_data_chase = {
      name: 'chase',
      src: gameEnv.path + "/images/projects/red-riding/chase.png",
      pixels: { height: 580, width: 1038 }
    };

    const sprite_data_red = {
      id: 'Red Riding Hood',
      src: gameEnv.path + "/images/projects/red-riding/red.png",
      SCALE_FACTOR: 6, STEP_FACTOR: 1000, ANIMATION_RATE: 50,
      INIT_POSITION: { x: this.redStartPosition.x, y: this.redStartPosition.y },
      pixels: { height: 192, width: 144 },
      orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      left: { row: 1, start: 0, columns: 3 },
      right: { row: 2, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const sprite_data_wolf = {
      id: 'Wolf',
      src: gameEnv.path + "/images/projects/red-riding/wolfff.png",
      SCALE_FACTOR: 3.5,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 8,
      INIT_POSITION: { x: centerPoints[0].x, y: centerPoints[0].y },
      pathPoints: centerPoints, // Give the Wolf the exact center points
      pixels: { height: 395, width: 632 },
      orientation: { rows: 1, columns: 1 },
      direction: 'right',
      SPEED: 2,
      zIndex: 20
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_chase },
      { class: Player, data: sprite_data_red },
      { class: Wolf, data: sprite_data_wolf }
    ];
  }

  showWinPopup() {
    this.winPopup.style.display = 'block';
    const btn = document.getElementById('winContinueBtn');
    if (btn) {
      btn.onclick = () => {
        this.winPopup.style.display = 'none';
      };
    }
  }

  checkInZone(player, zone) {
    if (!player?.position) return false;
    return (
      player.position.x + player.width > zone.x &&
      player.position.x < zone.x + zone.width &&
      player.position.y + player.height > zone.y &&
      player.position.y < zone.y + zone.height
    );
  }

  checkPlayerWolfCollision(player, wolf) {
    if (!player?.position || !wolf?.position) return false;
    return (
      player.position.x < wolf.position.x + wolf.width &&
      player.position.x + player.width > wolf.position.x &&
      player.position.y < wolf.position.y + wolf.height &&
      player.position.y + player.height > wolf.position.y
    );
  }

  update() {
    if (!this.gameEnv || !this.gameEnv.gameObjects) return;

    let player = null;
    let wolf = null;

    this.gameEnv.gameObjects.forEach(obj => {
      if (obj instanceof Player) player = obj;
      if (obj instanceof Wolf) wolf = obj;
    });

    if (player && !this.wonGame && this.checkInZone(player, this.cottageZone)) {
      this.wonGame = true;
      this.showWinPopup();
      // Transition to level 3 after a short delay
      setTimeout(() => {
        if (this.gameEnv && this.gameEnv.gameControl) {
          // Set the level index to 2 (level 3) and transition
          this.gameEnv.gameControl.currentLevelIndex = 2;
          this.gameEnv.gameControl.transitionToLevel();
        }
      }, 2000); // 2 second delay to show the win message
    }

    if (player && wolf && this.checkPlayerWolfCollision(player, wolf)) {
      player.position.x = this.redStartPosition.x;
      player.position.y = this.redStartPosition.y;
      player.velocity.x = 0;
      player.velocity.y = 0;
    }

    if (player && this.splineBarrier.checkOutOfBounds(player)) {
      player.position.x -= player.velocity.x;
      player.position.y -= player.velocity.y;
    }
  }

  draw() {
    this.splineBarrier.draw(this.debugMode);
  }

  resize() {}

  destroy() {
    if (this.titleElement && this.titleElement.parentNode) this.titleElement.remove();
    if (this.winPopup && this.winPopup.parentNode) this.winPopup.remove();
  }
}

export default GameLevelRedRidingHood2;