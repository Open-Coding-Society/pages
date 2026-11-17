/**
 * @module generators/racing
 * @description Turns the Racing panel settings into a playable GameEngine
 * level: a track, one or two cars, optional obstacles, spline barrier walls
 * that keep cars on the road, and a lap race.
 * @data Uses the Racing pictures from game-templates.json. Each track brings
 * its finish line, checkpoint and start position; each car brings its sprite
 * sheet layout. Positions are 0–1 proportions of the canvas. Barriers are the
 * shared builder records `{ id, name, visible, points }`, drawn on the preview.
 * @usage `generateRacingCode(options, images)` returns `{ code, errors }`;
 * errors are `{ field, message }` and leave `code` empty.
 */
import { code, imagePath, levelModule } from './source.mjs';

const WASD = { up: 87, left: 65, down: 83, right: 68 };
const ARROWS = { up: 38, left: 37, down: 40, right: 39 };
const CAR_HITBOX = { widthPercentage: 0.55, heightPercentage: 0.55 };
const SECOND_CAR_OFFSET = 0.05;

function isBetween(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}

function checkOptions(options, images) {
  const errors = [];
  if (typeof options.name !== 'string' || !options.name.trim()) errors.push({ field: 'name', message: 'Enter a game name.' });
  if (!images.get('tracks').has(options.backgroundKey)) errors.push({ field: 'backgroundKey', message: 'Choose a track.' });
  if (!images.get('cars').has(options.carSpriteKey)) errors.push({ field: 'carSpriteKey', message: 'Choose a car.' });
  if (!Number.isInteger(options.laps) || !isBetween(options.laps, 1, 10)) {
    errors.push({ field: 'laps', message: 'Laps must be a whole number from 1 to 10.' });
  }
  if (!isBetween(options.topSpeed, 1, 15)) errors.push({ field: 'topSpeed', message: 'Top speed must be from 1 to 15.' });
  if (!isBetween(options.acceleration, 0.05, 1)) {
    errors.push({ field: 'acceleration', message: 'Acceleration must be from 0.05 to 1.' });
  }
  (options.obstacles ?? []).forEach((obstacle, index) => {
    const placed = isBetween(obstacle.x, 0, 1) && isBetween(obstacle.y, 0, 1);
    if (!images.get('obstacles').has(obstacle.spriteKey) || !placed) {
      errors.push({ field: `obstacles.${index}`, message: `Obstacle ${index + 1} needs a picture and X/Y from 0 to 1.` });
    }
  });
  (options.barriers ?? []).forEach((barrier, index) => {
    const points = Array.isArray(barrier.points) ? barrier.points : [];
    if (points.length < 2 || !points.every((point) => isBetween(point?.x, 0, 1) && isBetween(point?.y, 0, 1))) {
      errors.push({ field: `barriers.${index}`, message: `Barrier ${index + 1} needs at least two points from 0 to 1.` });
    }
  });
  return errors;
}

function carData(car, id, position, keypress, options) {
  return {
    id,
    name: car.name,
    src: imagePath(car.src),
    SCALE_FACTOR: 10,
    STEP_FACTOR: 1100,
    heading: code('Math.PI / 2'),
    rotateWithHeading: true,
    INIT_POSITION: position,
    pixels: car.pixels,
    orientation: { rows: car.rows, columns: car.cols },
    up: { row: car.up.row, start: car.up.start, columns: 1 },
    hitbox: CAR_HITBOX,
    keypress,
    driverPhysics: { maxSpeed: options.topSpeed, acceleration: options.acceleration }
  };
}

export function generateRacingCode(options, images) {
  const errors = checkOptions(options, images);
  if (errors.length > 0) return { code: '', errors };

  const track = images.get('tracks').get(options.backgroundKey);
  const cars = images.get('cars');
  const firstCar = cars.get(options.carSpriteKey);
  // The second player drives a different car when one exists, so the two are easy to tell apart.
  const secondCar = [...cars.values()].find((car) => car.key !== firstCar.key) ?? firstCar;

  const classes = [
    { class: code('GameEnvBackground'), data: { name: track.name, src: imagePath(track.src) } },
    { class: code('PlayerDriver'), data: carData(firstCar, 'car-1', track.start, WASD, options) }
  ];
  if (options.secondPlayer) {
    const position = { x: track.start.x, y: Math.min(track.start.y + SECOND_CAR_OFFSET, 1) };
    classes.push({ class: code('PlayerDriver'), data: carData(secondCar, 'car-2', position, ARROWS, options) });
  }
  (options.obstacles ?? []).forEach((obstacle, index) => {
    const picture = images.get('obstacles').get(obstacle.spriteKey);
    classes.push({
      class: code('Character'),
      data: {
        id: `obstacle-${index + 1}`,
        src: imagePath(picture.src),
        SCALE_FACTOR: 10,
        INIT_POSITION: { x: obstacle.x, y: obstacle.y },
        pixels: picture.pixels,
        orientation: { rows: 1, columns: 1 },
        hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 }
      }
    });
  });
  for (const barrier of options.barriers ?? []) {
    classes.push({
      class: code('SplineBarrier'),
      data: {
        id: barrier.id,
        coordinateSpace: 'normalized',
        visible: barrier.visible !== false,
        splinePoints: barrier.points.map(({ x, y }) => ({ x, y }))
      }
    });
  }
  classes.push({
    class: code('LapRace'),
    data: { totalLaps: options.laps, finishLine: track.finishLine, checkpoint: track.checkpoint }
  });

  const imports = {
    GameControl: 'GameControl.js',
    GameEnvBackground: 'GameEnvBackground.js',
    PlayerDriver: 'PlayerDriver.js',
    LapRace: 'LapRace.js'
  };
  if ((options.obstacles ?? []).length > 0) imports.Character = 'Character.js';
  if ((options.barriers ?? []).length > 0) imports.SplineBarrier = 'SplineBarrier.js';

  return {
    code: levelModule({ imports, className: 'GameLevelRacing', displayName: options.name.trim(), body: '', classes }),
    errors: []
  };
}
