import {
  getRacingTurnRate,
  RACING_CAR_HITBOX,
  RACING_CAR_PHYSICS,
} from './RacingCarPhysics.js';
import {
  AUTUMN_SPLINE_BARRIER_POINTS,
  AUTUMN_SPLINE_COLLISION_WIDTH,
  AUTUMN_TRACK_OBSTACLES,
} from './AutumnTrackGeometry.js';
import { AUTUMN_BOT_GENOME } from './AutumnBotGenome.js';
import LapTracker from './LapTracker.js';

export const AUTUMN_TRACK_CENTERLINE = [
  { x: 0.4, y: 0.86 },
  { x: 0.58, y: 0.86 },
  { x: 0.78, y: 0.86 },
  { x: 0.9, y: 0.86 },
  { x: 0.94, y: 0.86 },
  { x: 0.94, y: 0.68 },
  { x: 0.93, y: 0.55 },
  { x: 0.9, y: 0.48 },
  { x: 0.84, y: 0.37 },
  { x: 0.78, y: 0.22 },
  { x: 0.74, y: 0.22 },
  { x: 0.59, y: 0.22 },
  { x: 0.49, y: 0.22 },
  { x: 0.45, y: 0.24 },
  { x: 0.41, y: 0.34 },
  { x: 0.36, y: 0.42 },
  { x: 0.32, y: 0.46 },
  { x: 0.29, y: 0.46 },
  { x: 0.26, y: 0.41 },
  { x: 0.22, y: 0.35 },
  { x: 0.18, y: 0.35 },
  { x: 0.12, y: 0.35 },
  { x: 0.075, y: 0.35 },
  { x: 0.075, y: 0.5 },
  { x: 0.075, y: 0.58 },
  { x: 0.075, y: 0.68 },
  { x: 0.075, y: 0.78 },
  { x: 0.14, y: 0.86 },
  { x: 0.27, y: 0.837 },
];

const MAX_LATERAL_OFFSET = 0.08;
const LEGACY_MAX_LATERAL_OFFSET = 0.028;
const REACH_DISTANCE = 0.025;
const EASY_TARGET_SPEED = 2.4;
const SUPER_EASY_TARGET_SPEED = 1.2;
const CAR_SIZE = 360 / 10;
const BARRIER_SEGMENTS_PER_SECTION = 24;
const BARRIER_COLLISION_RADIUS = CAR_SIZE * (1 - RACING_CAR_HITBOX.widthPercentage) / 2
  + AUTUMN_SPLINE_COLLISION_WIDTH / 2;
const BARRIER_SAFE_DISTANCE = BARRIER_COLLISION_RADIUS + 17;
const BARRIER_STEERING_MARGIN = 2;
const BARRIER_GRID_CELL_SIZE = 32;
const AVOIDANCE_LOOKAHEAD_FRAMES = 12;
const CAR_COLLISION_RADIUS = Math.min(
  CAR_SIZE * (1 - RACING_CAR_HITBOX.widthPercentage),
  CAR_SIZE * (1 - RACING_CAR_HITBOX.heightPercentage),
) / 2;
const OBSTACLE_COLLISION_RADIUS = Math.min(
  CAR_SIZE * (1 - AUTUMN_TRACK_OBSTACLES.box.hitbox.widthPercentage),
  CAR_SIZE * (1 - AUTUMN_TRACK_OBSTACLES.box.hitbox.heightPercentage),
) / 2;
const OBSTACLE_STEERING_MARGIN = 0.5;
const OBSTACLE_CONTACT_PENALTY = 10000;
const BARRIER_CONTACT_PENALTY = 10000;
const AUTUMN_TRACK_OBSTACLE_CENTERS = Object.values(AUTUMN_TRACK_OBSTACLES).map(({ position }) => ({
  x: position.x,
  y: position.y,
}));

function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    2 * p1
    + (-p0 + p2) * t
    + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
    + (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

function sampleSpline(points) {
  const curve = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] || points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] || p2;
    for (let segment = 0; segment < BARRIER_SEGMENTS_PER_SECTION; segment += 1) {
      const t = segment / BARRIER_SEGMENTS_PER_SECTION;
      curve.push({
        x: catmullRom(p0.x, p1.x, p2.x, p3.x, t),
        y: catmullRom(p0.y, p1.y, p2.y, p3.y, t),
      });
    }
  }
  curve.push(points.at(-1));
  return curve;
}

const AUTUMN_SPLINE_BARRIER_CURVES = AUTUMN_SPLINE_BARRIER_POINTS.map(sampleSpline);
const barrierIndexes = new Map();

function normalizeAngle(angle) {
  return ((angle + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
}

function getNormal(pointBefore, pointAfter) {
  const dx = (pointAfter.x - pointBefore.x) * 643;
  const dy = (pointAfter.y - pointBefore.y) * 360;
  const length = Math.hypot(dx, dy);
  return { x: -dy / length, y: dx / length };
}

function distanceToRoute(point, route, width, height) {
  let minimumDistance = Infinity;
  for (let index = 0; index < route.length; index += 1) {
    const start = route[index];
    const end = route[(index + 1) % route.length];
    const startX = start.x * width;
    const startY = start.y * height;
    const segmentX = (end.x - start.x) * width;
    const segmentY = (end.y - start.y) * height;
    const lengthSquared = segmentX * segmentX + segmentY * segmentY;
    const projection = Math.max(0, Math.min(1,
      ((point.x - startX) * segmentX + (point.y - startY) * segmentY) / lengthSquared));
    minimumDistance = Math.min(minimumDistance, Math.hypot(
      point.x - (startX + projection * segmentX),
      point.y - (startY + projection * segmentY),
    ));
  }
  return minimumDistance;
}

function getBarrierIndex(width, height) {
  const cacheKey = `${width}x${height}`;
  if (barrierIndexes.has(cacheKey)) return barrierIndexes.get(cacheKey);

  const grid = new Map();
  for (const curve of AUTUMN_SPLINE_BARRIER_CURVES) {
    const scaled = curve.map(({ x, y }) => ({ x: x * width, y: y * height }));
    for (let index = 0; index < scaled.length - 1; index += 1) {
      const start = scaled[index];
      const end = scaled[index + 1];
      const segmentX = end.x - start.x;
      const segmentY = end.y - start.y;
      const length = Math.hypot(segmentX, segmentY);
      if (length === 0) continue;

      const segment = {
        start,
        segmentX,
        segmentY,
        lengthSquared: length * length,
        normalX: -segmentY / length,
        normalY: segmentX / length,
      };
      const minCellX = Math.floor((Math.min(start.x, end.x) - BARRIER_SAFE_DISTANCE) / BARRIER_GRID_CELL_SIZE);
      const maxCellX = Math.floor((Math.max(start.x, end.x) + BARRIER_SAFE_DISTANCE) / BARRIER_GRID_CELL_SIZE);
      const minCellY = Math.floor((Math.min(start.y, end.y) - BARRIER_SAFE_DISTANCE) / BARRIER_GRID_CELL_SIZE);
      const maxCellY = Math.floor((Math.max(start.y, end.y) + BARRIER_SAFE_DISTANCE) / BARRIER_GRID_CELL_SIZE);
      for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
        for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
          const key = `${cellX},${cellY}`;
          if (!grid.has(key)) grid.set(key, []);
          grid.get(key).push(segment);
        }
      }
    }
  }

  barrierIndexes.set(cacheKey, grid);
  return grid;
}

function getNearestPoint(point, grid) {
  let nearest = null;
  const cellX = Math.floor(point.x / BARRIER_GRID_CELL_SIZE);
  const cellY = Math.floor(point.y / BARRIER_GRID_CELL_SIZE);
  const nearby = grid.get(`${cellX},${cellY}`) || [];
  for (const segment of nearby) {
    const { start, segmentX, segmentY, lengthSquared } = segment;

    const projection = Math.max(0, Math.min(1,
      ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / lengthSquared));
    const nearestX = start.x + projection * segmentX;
    const nearestY = start.y + projection * segmentY;
    const dx = point.x - nearestX;
    const dy = point.y - nearestY;
    const distance = Math.hypot(dx, dy);
    if (!nearest || distance < nearest.distance) {
      const segmentLength = Math.sqrt(lengthSquared);
      nearest = {
        distance,
        dx,
        dy,
        normalX: segment.normalX,
        normalY: segment.normalY,
      };
    }
  }
  return nearest;
}

function getObstacleClearance(position, width, height) {
  return Math.min(...AUTUMN_TRACK_OBSTACLE_CENTERS.map(({ x, y }) => (
    Math.hypot(position.x - (x * width + CAR_SIZE / 2), position.y - (y * height + CAR_SIZE / 2))
      - CAR_COLLISION_RADIUS
      - OBSTACLE_COLLISION_RADIUS
  )));
}

function addConeDetour(route, includeApproach = true) {
  const lastPoint = route.at(-1);
  return [
    ...route.slice(0, -1),
    ...(includeApproach ? [{ x: 0.2, y: 0.842, speedFraction: lastPoint.speedFraction }] : []),
    lastPoint,
    { x: 0.38, y: lastPoint.y, speedFraction: lastPoint.speedFraction },
  ];
}

export function createEasyRoute() {
  return [
    ...AUTUMN_TRACK_CENTERLINE,
    { x: 0.31, y: 0.825 },
    { x: 0.36, y: 0.837 },
  ];
}

export function createSuperEasyRoute() {
  const route = createEasyRoute();
  route.splice(1, 0,
    { x: 0.55, y: 0.86 },
    { x: 0.44, y: 0.86 },
    { x: 0.53, y: 0.86 },
  );
  return route;
}

function getSafeSteering({ position, heading, speed, desiredSteer, route, width, height }) {
  const grid = getBarrierIndex(width, height);
  const candidateSteers = [-1, 0, 1];
  const predictedDistances = candidateSteers.map((steer) => {
    const predictedPosition = { ...position };
    let predictedHeading = heading;
    let predictedSpeed = speed;
    let minimumDistance = Infinity;
    let minimumObstacleClearance = Infinity;
    let totalRouteDeviation = 0;

    for (let frame = 0; frame < AVOIDANCE_LOOKAHEAD_FRAMES; frame += 1) {
      predictedSpeed = Math.min(predictedSpeed + RACING_CAR_PHYSICS.acceleration, RACING_CAR_PHYSICS.maxSpeed);
      predictedHeading += steer * getRacingTurnRate(predictedSpeed);
      predictedPosition.x += Math.sin(predictedHeading) * predictedSpeed;
      predictedPosition.y -= Math.cos(predictedHeading) * predictedSpeed;
      const nearest = getNearestPoint(predictedPosition, grid);
      if (nearest) minimumDistance = Math.min(minimumDistance, nearest.distance);
      minimumObstacleClearance = Math.min(
        minimumObstacleClearance,
        getObstacleClearance(predictedPosition, width, height),
      );
      totalRouteDeviation += distanceToRoute(predictedPosition, route, width, height);
    }

    return {
      steer,
      minimumDistance,
      minimumObstacleClearance,
      score: Math.min(minimumDistance, BARRIER_SAFE_DISTANCE)
        - totalRouteDeviation / AVOIDANCE_LOOKAHEAD_FRAMES * 2
        - Math.abs(steer - desiredSteer) * 2,
      obstaclePenalty: Math.max(0, OBSTACLE_STEERING_MARGIN - minimumObstacleClearance) * 4,
    };
  });
  const desiredCandidate = predictedDistances.find(({ steer }) => steer === desiredSteer);
  if (desiredCandidate.minimumDistance >= BARRIER_COLLISION_RADIUS + BARRIER_STEERING_MARGIN
      && desiredCandidate.minimumObstacleClearance >= OBSTACLE_STEERING_MARGIN) {
    return {
      steer: desiredSteer,
      minimumDistance: desiredCandidate.minimumDistance,
    };
  }

  const chosen = predictedDistances.reduce((best, candidate) => {
    return candidate.score - candidate.obstaclePenalty > best.score - best.obstaclePenalty
      ? candidate
      : best;
  });

  return {
    steer: chosen.score - chosen.obstaclePenalty
      > desiredCandidate.score - desiredCandidate.obstaclePenalty
      ? chosen.steer
      : desiredSteer,
    minimumDistance: chosen.minimumDistance,
  };
}

export function createRouteFromGenome(genome) {
  if (!isValidGenome(genome)) {
    throw new TypeError('Autumn bot genome has an invalid shape');
  }

  const route = AUTUMN_TRACK_CENTERLINE.map((point, index) => {
    const normal = getNormal(
      AUTUMN_TRACK_CENTERLINE[(index - 1 + AUTUMN_TRACK_CENTERLINE.length) % AUTUMN_TRACK_CENTERLINE.length],
      AUTUMN_TRACK_CENTERLINE[(index + 1) % AUTUMN_TRACK_CENTERLINE.length],
    );
    const offset = genome.offsets[index] * (genome.offsetScale ?? LEGACY_MAX_LATERAL_OFFSET) * 360;
    return {
      x: point.x + normal.x * offset / 643,
      y: point.y + normal.y * offset / 360,
      speedFraction: genome.speedFractions[index],
    };
  });
  return addConeDetour(route);
}

function isValidGenome(genome) {
  return Boolean(genome)
    && Array.isArray(genome.offsets)
    && Array.isArray(genome.speedFractions)
    && genome.offsets.length === AUTUMN_TRACK_CENTERLINE.length
    && genome.speedFractions.length === AUTUMN_TRACK_CENTERLINE.length
    && !genome.offsets.some((value) => !Number.isFinite(value) || value < -1 || value > 1)
    && !genome.speedFractions.some((value) => !Number.isFinite(value) || value < 0.35 || value > 1)
    && (genome.offsetScale === undefined
      || (Number.isFinite(genome.offsetScale)
        && genome.offsetScale >= LEGACY_MAX_LATERAL_OFFSET
        && genome.offsetScale <= MAX_LATERAL_OFFSET));
}

export function hasReachedRouteWaypoint(position, route, waypointIndex, width, height, reachDistance) {
  const target = route[waypointIndex];
  const targetX = target.x * width;
  const targetY = target.y * height;
  if (Math.hypot(targetX - position.x, targetY - position.y) < reachDistance) return true;

  const previous = route[(waypointIndex - 1 + route.length) % route.length];
  const segmentX = (target.x - previous.x) * width;
  const segmentY = (target.y - previous.y) * height;
  return (position.x - targetX) * segmentX + (position.y - targetY) * segmentY >= 0;
}

export function getBotControls({
  position,
  heading,
  speed,
  waypointIndex,
  route,
  width,
  height,
  mode,
}) {
  const point = route[waypointIndex];
  const targetX = point.x * width - position.x;
  const targetY = point.y * height - position.y;
  const desiredHeading = Math.atan2(targetX, -targetY);
  const headingError = normalizeAngle(desiredHeading - heading);
  const steerThreshold = 0.03;
  const desiredSteer = headingError > steerThreshold ? 1 : headingError < -steerThreshold ? -1 : 0;
  const steering = getSafeSteering({
    position,
    heading,
    speed,
    desiredSteer,
    route,
    width,
    height,
  });
  const targetSpeed = mode === 'ai'
    ? RACING_CAR_PHYSICS.maxSpeed * point.speedFraction * Math.max(0.35, 1 - Math.abs(headingError) / Math.PI)
    : mode === 'superEasy' ? SUPER_EASY_TARGET_SPEED : EASY_TARGET_SPEED;
  return {
    steer: steering.steer,
    throttle: speed < targetSpeed - 0.1 ? 1 : speed > targetSpeed + 0.1 ? -1 : 0,
  };
}

export function createInitialGenome() {
  return {
    offsets: AUTUMN_TRACK_CENTERLINE.map(() => 0),
    speedFractions: AUTUMN_TRACK_CENTERLINE.map(() => 0.82),
    offsetScale: MAX_LATERAL_OFFSET,
  };
}

export function simulateAutumnRace({ mode = 'ai', genome, totalLaps = 3, maxFrames = 3000 } = {}) {
  const route = mode === 'ai'
    ? createRouteFromGenome(genome)
    : mode === 'superEasy' ? createSuperEasyRoute() : createEasyRoute();
  const position = { x: 0.4 * 643, y: 0.82 * 360 };
  const car = {};
  const lapTracker = new LapTracker({
    finishLine: { x: 0.453, top: 0.794, bottom: 0.941 },
    checkpoint: { x: 0.453, top: 0.19, bottom: 0.33 },
    totalLaps,
  });
  let heading = Math.PI / 2;
  let speed = 0;
  let waypointIndex = 1;
  let barrierContacts = 0;
  let obstacleContacts = 0;
  const lapFrames = [];

  for (let frame = 0; frame < maxFrames; frame += 1) {
    const center = { x: position.x + CAR_SIZE / 2, y: position.y + CAR_SIZE / 2 };
    if (hasReachedRouteWaypoint(center, route, waypointIndex, 643, 360, REACH_DISTANCE * 360)) {
      waypointIndex = (waypointIndex + 1) % route.length;
    }

    const control = getBotControls({
      position: center,
      heading,
      speed,
      waypointIndex,
      route,
      width: 643,
      height: 360,
      mode,
    });
    if (control.throttle > 0) {
      speed = Math.min(speed + RACING_CAR_PHYSICS.acceleration, RACING_CAR_PHYSICS.maxSpeed);
    } else if (control.throttle < 0) {
      speed = speed > 0
        ? Math.max(speed - RACING_CAR_PHYSICS.braking, 0)
        : Math.max(speed - RACING_CAR_PHYSICS.acceleration, -RACING_CAR_PHYSICS.reverseSpeed);
    } else {
      speed = speed > 0
        ? Math.max(speed - RACING_CAR_PHYSICS.coasting, 0)
        : Math.min(speed + RACING_CAR_PHYSICS.coasting, 0);
    }
    if (speed !== 0) heading += control.steer * getRacingTurnRate(speed) * Math.sign(speed);
    position.x += Math.sin(heading) * speed;
    position.y -= Math.cos(heading) * speed;
    position.x = Math.min(Math.max(position.x, 0), 643 - CAR_SIZE);
    position.y = Math.min(Math.max(position.y, 0), 360 - CAR_SIZE);

    let collisionCenter = { x: position.x + CAR_SIZE / 2, y: position.y + CAR_SIZE / 2 };
    const nearest = getNearestPoint(collisionCenter, getBarrierIndex(643, 360));
    if (nearest && nearest.distance < BARRIER_COLLISION_RADIUS) {
      barrierContacts += 1;
      const direction = nearest.distance > 0
        ? { x: nearest.dx / nearest.distance, y: nearest.dy / nearest.distance }
        : { x: nearest.normalX, y: nearest.normalY };
      const correction = BARRIER_COLLISION_RADIUS - nearest.distance;
      position.x += direction.x * correction;
      position.y += direction.y * correction;
      collisionCenter = { x: position.x + CAR_SIZE / 2, y: position.y + CAR_SIZE / 2 };
    }
    const obstacleClearance = getObstacleClearance(collisionCenter, 643, 360);
    if (obstacleClearance < 0) obstacleContacts += 1;

    if (lapTracker.update(car, {
      x: (position.x + CAR_SIZE / 2) / 643,
      y: (position.y + CAR_SIZE / 2) / 360,
    })) {
      return {
        completed: true,
        frames: frame + 1,
        seconds: (frame + 1) / 60,
        lapsCompleted: lapTracker.getLapsCompleted(car),
        barrierContacts,
        obstacleContacts,
        lapFrames,
      };
    }
    const lapsCompleted = lapTracker.getLapsCompleted(car);
    if (lapsCompleted > lapFrames.length) lapFrames.push(frame + 1);
  }

  return {
    completed: false,
    frames: maxFrames,
    seconds: maxFrames / 60,
    lapsCompleted: lapTracker.getLapsCompleted(car),
    barrierContacts,
    obstacleContacts,
    lapFrames,
  };
}

export function scoreGenome(genome) {
  const result = simulateAutumnRace({ mode: 'ai', genome, totalLaps: 3, maxFrames: 1500 });
  const collisionPenalty = result.barrierContacts * BARRIER_CONTACT_PENALTY
    + result.obstacleContacts * OBSTACLE_CONTACT_PENALTY;
  if (result.completed && collisionPenalty === 0) return 2_000_000 - result.frames;
  if (result.completed) return 1_000_000 - result.frames - collisionPenalty;
  return result.lapsCompleted * 300_000 - result.frames - collisionPenalty;
}

export function evolveAutumnBot({
  generations = 80,
  populationSize = 48,
  seed = 20261030,
  seedGenomes = [],
} = {}) {
  if (!Number.isInteger(generations) || generations < 1
      || !Number.isInteger(populationSize) || populationSize < 4) {
    throw new RangeError('Training needs generations >= 1 and populationSize >= 4');
  }
  if (!Array.isArray(seedGenomes)) {
    throw new TypeError('Training seedGenomes must be an array');
  }

  let randomSeed = seed >>> 0;
  const random = () => {
    randomSeed = (1664525 * randomSeed + 1013904223) >>> 0;
    return randomSeed / 0x100000000;
  };
  const mutate = (genome, rate) => ({
    offsets: genome.offsets.map((value) => Math.max(-1, Math.min(1,
      value + (random() < rate ? (random() * 2 - 1) * 0.35 : 0)))),
    speedFractions: genome.speedFractions.map((value) => Math.max(0.35, Math.min(1,
      value + (random() < rate ? (random() * 2 - 1) * 0.2 : 0)))),
    offsetScale: MAX_LATERAL_OFFSET,
  });
  const crossover = (first, second) => ({
    offsets: first.offsets.map((value, index) => random() < 0.5 ? value : second.offsets[index]),
    speedFractions: first.speedFractions.map((value, index) => random() < 0.5 ? value : second.speedFractions[index]),
    offsetScale: MAX_LATERAL_OFFSET,
  });

  const normalizeSeedGenome = (genome) => {
    if (!isValidGenome(genome)) {
      throw new TypeError('Autumn bot seed genome has an invalid shape');
    }

    return {
      ...genome,
      offsets: genome.offsets.map((value) => (
        genome.offsetScale === undefined
          ? value * LEGACY_MAX_LATERAL_OFFSET / MAX_LATERAL_OFFSET
          : value
      )),
      offsetScale: MAX_LATERAL_OFFSET,
    };
  };
  const startingGenomes = [
    isValidGenome(AUTUMN_BOT_GENOME)
      ? normalizeSeedGenome(AUTUMN_BOT_GENOME)
      : createInitialGenome(),
    ...seedGenomes.map(normalizeSeedGenome),
    createInitialGenome(),
  ];
  let population = startingGenomes.slice(0, populationSize);
  while (population.length < populationSize) {
    const index = population.length;
    const seedGenome = startingGenomes[index % startingGenomes.length];
    population.push(mutate(seedGenome, index % 2 === 0 ? 0.25 : 1));
  }
  let best = null;
  let bestScore = -Infinity;
  const history = [];

  for (let generation = 0; generation < generations; generation += 1) {
    const ranked = population
      .map((genome) => ({ genome, score: scoreGenome(genome) }))
      .sort((a, b) => b.score - a.score);
    if (ranked[0].score > bestScore) {
      best = ranked[0].genome;
      bestScore = ranked[0].score;
    }
    history.push({ generation: generation + 1, score: ranked[0].score });

    const eliteCount = Math.max(2, Math.floor(populationSize * 0.1));
    const next = ranked.slice(0, eliteCount).map(({ genome }) => genome);
    while (next.length < populationSize) {
      const tournament = () => {
        let winner = ranked[Math.floor(random() * ranked.length)];
        for (let index = 1; index < 4; index += 1) {
          const candidate = ranked[Math.floor(random() * ranked.length)];
          if (candidate.score > winner.score) winner = candidate;
        }
        return winner.genome;
      };
      next.push(mutate(crossover(tournament(), tournament()), 0.35));
    }
    population = next;
  }

  const result = simulateAutumnRace({ mode: 'ai', genome: best, totalLaps: 3, maxFrames: 1500 });
  return { genome: best, score: bestScore, result, history, seed, generations, populationSize };
}
